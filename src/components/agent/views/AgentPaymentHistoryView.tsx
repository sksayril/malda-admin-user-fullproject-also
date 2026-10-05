'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  Building,
  ShieldCheck,
  RefreshCw,
  Plus,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  UserCheck,
} from 'lucide-react';
import { Agent, PaymentTransaction } from '@/types';

interface AgentPaymentHistoryViewProps {
  agent: Agent;
  onUpdateWallet?: (amount: number) => void;
}

export default function AgentPaymentHistoryView({
  agent,
  onUpdateWallet,
}: AgentPaymentHistoryViewProps) {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  // New Field Collection Modal
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [custName, setCustName] = useState('ANUP SAHA');
  const [custId, setCustId] = useState('DD00045883');
  const [collectAmount, setCollectAmount] = useState('3000');
  const [collectType, setCollectType] = useState<'RENEWAL' | 'LOAN_EMI' | 'DEPOSIT'>('RENEWAL');
  const [collectMode, setCollectMode] = useState<'Cash' | 'UPI' | 'Bank Transfer'>('Cash');
  const [collectNotes, setCollectNotes] = useState('Daily deposit 10-day renewal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAgentTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/payments/history?agentId=${encodeURIComponent(agent.agentId || 'KNM00006282')}&userType=Agent`
      );
      const data = await res.json();
      if (data.success && data.data?.transactions) {
        setTransactions(data.data.transactions);
      }
    } catch (err) {
      console.error('Error fetching agent transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentTransactions();
  }, [agent.agentId]);

  // Handle Record New Field Collection
  const handleRecordCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectAmount || Number(collectAmount) <= 0) return;
    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const numAmt = Number(collectAmount);
      const receiptNo = `RC-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Save to unified PaymentTransaction API
      const res = await fetch('/api/payments/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: custId,
          userName: custName,
          agentId: agent.agentId || 'KNM00006282',
          agentName: agent.name || 'KESHAB CH MAHATO',
          userType: 'Both',
          type:
            collectType === 'RENEWAL'
              ? 'Field Collection - RD / DRD Renewal'
              : collectType === 'LOAN_EMI'
              ? 'Field Collection - Loan EMI'
              : 'Field Collection - Savings Deposit',
          category: collectType === 'LOAN_EMI' ? 'LOAN_EMI' : 'COLLECTION',
          flow: 'CREDIT',
          amount: numAmt,
          paymentMode: collectMode,
          referenceAccount: custId,
          receiptNo,
          notes: collectNotes || `Doorstep collection by ${agent.name}`,
        }),
      });

      const resData = await res.json();
      if (resData.success && resData.data) {
        setTransactions((prev) => [resData.data, ...prev]);

        // Auto calculate agent commission credit (2.5% direct commission)
        const directCommission = Math.round(numAmt * 0.025);
        if (directCommission > 0 && onUpdateWallet) {
          onUpdateWallet(directCommission);
        }

        setSuccessMsg(
          `Collection of ₹${numAmt.toLocaleString(
            'en-IN'
          )} saved! ₹${directCommission} commission added to wallet.`
        );

        setTimeout(() => {
          setIsCollectModalOpen(false);
          setSuccessMsg('');
        }, 1800);
      }
    } catch (err) {
      console.error('Error recording collection:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter logic
  const filteredTransactions = transactions.filter((tx) => {
    if (selectedCategory !== 'ALL' && tx.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = tx.transactionId?.toLowerCase().includes(q);
      const matchRc = tx.receiptNo?.toLowerCase().includes(q);
      const matchName = tx.userName?.toLowerCase().includes(q);
      const matchType = tx.type?.toLowerCase().includes(q);
      const matchRef = tx.referenceAccount?.toLowerCase().includes(q);
      if (!matchId && !matchRc && !matchName && !matchType && !matchRef) return false;
    }
    return true;
  });

  // Calculate Metrics
  const totalCollected = transactions
    .filter((t) => t.category === 'COLLECTION' || t.category === 'RENEWAL' || t.category === 'LOAN_EMI')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalCommissionsEarned = transactions
    .filter((t) => t.category === 'COMMISSION')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalPayoutsWithdrawn = transactions
    .filter((t) => t.category === 'PAYOUT' || (t.flow === 'DEBIT' && t.category === 'WITHDRAWAL'))
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Total Field Collections</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            ₹ {totalCollected.toLocaleString('en-IN')}
          </h3>
          <span className="text-[11px] font-semibold text-indigo-600 mt-1 block">
            From DRD, RD, EMI, SB
          </span>
        </div>

        {/* Commission Incentives */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Commission & ORC Credited</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-emerald-700 tracking-tight">
            ₹ {totalCommissionsEarned.toLocaleString('en-IN')}
          </h3>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
            Direct Cut + MLM Network Override
          </span>
        </div>

        {/* Payouts Withdrawn */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Payouts Transferred to Bank</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            ₹ {totalPayoutsWithdrawn.toLocaleString('en-IN')}
          </h3>
          <span className="text-[11px] font-semibold text-amber-600 mt-1 block">
            Processed to Bank Account
          </span>
        </div>

        {/* Action Card: Collect Field Payment */}
        <div className="bg-gradient-to-br from-[#0c1330] via-[#172054] to-[#123164] p-5 rounded-3xl text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Live Agent Wallet</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300">
                ACTIVE
              </span>
            </div>
            <h4 className="text-xl font-black mt-1 text-white">
              ₹ {Number(agent.walletBalance || 24500).toLocaleString('en-IN')}
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setIsCollectModalOpen(true)}
            className="mt-3 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Record Field Collection</span>
          </button>
        </div>
      </div>

      {/* Main Agent Ledger Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Agent Payment, Collection & Commission History
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live database ledger of field collections, member deposits, ORC bonuses, and bank payouts for{' '}
              <strong className="text-slate-800">{agent.name} ({agent.agentId})</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchAgentTransactions}
              disabled={loading}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
              <span>Sync Database</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'ALL', label: 'All Activities' },
              { key: 'COLLECTION', label: 'Field Collections' },
              { key: 'COMMISSION', label: 'Commissions & ORC' },
              { key: 'PAYOUT', label: 'Bank Payouts' },
              { key: 'LOAN_EMI', label: 'Loan EMIs' },
              { key: 'RENEWAL', label: 'RD / DRD' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedCategory(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === tab.key
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Member, TXN, Receipt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#121c3b] text-white uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Txn ID & Date</th>
                <th className="py-3.5 px-4">Activity / Description</th>
                <th className="py-3.5 px-4">Member / Account</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No payment or collection records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isCommission = tx.category === 'COMMISSION';
                  const isPayout = tx.category === 'PAYOUT' || tx.flow === 'DEBIT';

                  return (
                    <tr key={tx._id || tx.transactionId} className="hover:bg-slate-50/80 transition">
                      {/* ID & Date */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">
                          {tx.transactionId}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {tx.date}
                        </span>
                      </td>

                      {/* Type & Notes */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCommission
                                ? 'bg-purple-100 text-purple-700'
                                : isPayout
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {isCommission ? '★' : isPayout ? '↑' : '↓'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">{tx.type}</span>
                            {tx.notes && (
                              <span className="text-[10px] text-slate-500 block truncate max-w-[220px]">
                                {tx.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Member / Ref */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 block">
                          {tx.userName || 'Society System'}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {tx.referenceAccount || tx.receiptNo || '—'}
                        </span>
                      </td>

                      {/* Payment Mode */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {tx.paymentMode || 'Cash'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`font-black text-sm ${
                            isCommission
                              ? 'text-purple-700'
                              : isPayout
                              ? 'text-rose-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {isPayout ? '-' : '+'} ₹ {Number(tx.amount).toLocaleString('en-IN')}
                        </span>
                        {tx.receiptNo && (
                          <span className="text-[10px] font-mono text-slate-400 block">
                            {tx.receiptNo}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {tx.status || 'Success'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedTx(tx)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[11px] transition cursor-pointer"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Agent Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#121c3b] to-indigo-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                  MC
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight">MultiCredit 360</h4>
                  <p className="text-[10px] text-indigo-200">Collector Payment Voucher & Receipt</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-dashed border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Official Voucher No
                </span>
                <span className="font-mono text-base font-black text-slate-900">
                  {selectedTx.receiptNo || 'RC-9941'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Date: {selectedTx.date}
                </span>
              </div>

              {/* Amount Display */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                <span className="text-[11px] font-semibold text-indigo-700 block">Amount Value</span>
                <h3 className="text-2xl font-black text-indigo-950 mt-0.5">
                  ₹ {Number(selectedTx.amount).toLocaleString('en-IN')}
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                  SETTLED & VERIFIED IN DATABASE
                </span>
              </div>

              {/* Details Breakdown */}
              <div className="space-y-2 py-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Transaction ID</span>
                  <span className="font-mono font-bold text-slate-800">{selectedTx.transactionId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Member / Customer</span>
                  <span className="font-bold text-slate-800">
                    {selectedTx.userName || 'Self / Advisor'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Collector ID & Name</span>
                  <span className="font-bold text-slate-800">
                    {agent.name} ({agent.agentId})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Policy / Account No</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedTx.referenceAccount || '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Type</span>
                  <span className="font-bold text-slate-800">{selectedTx.type}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Mode</span>
                  <span className="font-bold text-slate-800">{selectedTx.paymentMode}</span>
                </div>
              </div>

              {/* Malda HQ Footer */}
              <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-dashed border-slate-200">
                <p>Authorized Signature & Stamp: Malda HQ Multi-State Society</p>
                <p className="font-bold text-slate-500 mt-0.5">
                  MultiCredit 360 Enterprise Banking Engine
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Voucher / PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="py-2.5 px-4 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Field Collection Modal */}
      {isCollectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Record Field Collection</h4>
                  <p className="text-[10px] text-slate-500">Instant Database Sync & Commission Credit</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCollectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {successMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex flex-col items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleRecordCollection} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer / Member Name</label>
                  <input
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    placeholder="e.g. ANUP SAHA"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account / Policy / Loan No</label>
                  <input
                    type="text"
                    required
                    value={custId}
                    onChange={(e) => setCustId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                    placeholder="e.g. DD00045883 / KISALY511421473"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Type</label>
                    <select
                      value={collectType}
                      onChange={(e) => setCollectType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                    >
                      <option value="RENEWAL">RD / DRD Daily</option>
                      <option value="LOAN_EMI">Loan EMI</option>
                      <option value="DEPOSIT">Savings SB</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Payment Mode</label>
                    <select
                      value={collectMode}
                      onChange={(e) => setCollectMode(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                    >
                      <option value="Cash">Cash (Hand-to-Hand)</option>
                      <option value="UPI">UPI / QR Code</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Collection Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={collectAmount}
                    onChange={(e) => setCollectAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-base text-slate-900"
                    placeholder="Enter amount collected"
                  />
                  <div className="flex gap-2 mt-2">
                    {['500', '1000', '2000', '3000', '5000', '10000'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCollectAmount(amt)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[10px] font-bold text-slate-600 cursor-pointer"
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Collection Narration / Notes</label>
                  <input
                    type="text"
                    value={collectNotes}
                    onChange={(e) => setCollectNotes(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                    placeholder="e.g. 10-day renewal installment"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCollectModalOpen(false)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? 'Saving...' : 'Record & Credit'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
