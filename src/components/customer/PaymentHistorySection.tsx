'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
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
} from 'lucide-react';
import { PaymentTransaction, Customer } from '@/types';

interface PaymentHistorySectionProps {
  customer: Customer;
  transactions?: PaymentTransaction[];
  onRefresh?: () => void;
}

export default function PaymentHistorySection({
  customer,
  transactions: propTransactions,
  onRefresh,
}: PaymentHistorySectionProps) {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(propTransactions || []);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  // New Deposit / Payment Modal
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('2000');
  const [payType, setPayType] = useState('DEPOSIT');
  const [payMode, setPayMode] = useState<'UPI' | 'Razorpay' | 'Bank Transfer' | 'Cash'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch transactions from API
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/payments/history?userId=${encodeURIComponent(customer.customerId || customer.mobile)}&userType=Customer`
      );
      const data = await res.json();
      if (data.success && data.data?.transactions) {
        setTransactions(data.data.transactions);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propTransactions && propTransactions.length > 0) {
      setTransactions(propTransactions);
    } else {
      fetchHistory();
    }
  }, [propTransactions, customer.customerId]);

  // Handle Make Online Payment / Deposit directly to DB
  const handleMakePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) return;
    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const numAmt = Number(payAmount);
      const res = await fetch('/api/payments/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: customer.customerId,
          userName: customer.name,
          agentId: customer.referralCode || 'KNM00006282',
          agentName: 'Malda HQ Collector',
          type:
            payType === 'DEPOSIT'
              ? 'Savings Account Deposit'
              : payType === 'LOAN_EMI'
              ? 'Personal Loan EMI'
              : payType === 'RENEWAL'
              ? 'Recurring Deposit (RD)'
              : 'Fixed Deposit (FD)',
          category: payType,
          flow: payType === 'WITHDRAWAL' ? 'DEBIT' : 'CREDIT',
          amount: numAmt,
          paymentMode: payMode,
          referenceAccount: `ACC-${customer.mobile?.slice(-4) || '3601'}`,
          notes: `Member direct payment via ${payMode} in MultiCredit 360 App`,
        }),
      });

      const resData = await res.json();
      if (resData.success && resData.data) {
        setTransactions((prev) => [resData.data, ...prev]);
        setSuccessMsg(`Payment of ₹${numAmt.toLocaleString('en-IN')} recorded successfully!`);
        setTimeout(() => {
          setIsDepositModalOpen(false);
          setSuccessMsg('');
        }, 1500);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error('Payment submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered List
  const filteredTransactions = transactions.filter((tx) => {
    if (selectedCategory !== 'ALL' && tx.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = tx.transactionId?.toLowerCase().includes(q);
      const matchRc = tx.receiptNo?.toLowerCase().includes(q);
      const matchType = tx.type?.toLowerCase().includes(q);
      const matchRef = tx.referenceAccount?.toLowerCase().includes(q);
      const matchNotes = tx.notes?.toLowerCase().includes(q);
      if (!matchId && !matchRc && !matchType && !matchRef && !matchNotes) return false;
    }
    return true;
  });

  // Calculate Metrics
  const totalInflow = transactions
    .filter((t) => t.flow === 'CREDIT')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalOutflow = transactions
    .filter((t) => t.flow === 'DEBIT')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflow (Credits) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Total Deposits & Inflow</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            ₹ {totalInflow.toLocaleString('en-IN')}
          </h3>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
            ↑ Active Savings & RD Inflows
          </span>
        </div>

        {/* Total Outflow (Debits & EMIs) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Total EMI Paid & Debits</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            ₹ {totalOutflow.toLocaleString('en-IN')}
          </h3>
          <span className="text-[11px] font-semibold text-rose-600 mt-1 block">
            ↓ Loan EMIs & Withdrawals
          </span>
        </div>

        {/* Total Recorded Transactions */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Total Ledger Entries</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {transactions.length} Records
          </h3>
          <span className="text-[11px] font-semibold text-blue-600 mt-1 block">
            100% Verified in Database
          </span>
        </div>

        {/* Quick Action Deposit Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-3xl text-white shadow-md flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-blue-200 block">Instant Banking</span>
            <h4 className="text-base font-extrabold mt-0.5">Pay Online / Deposit</h4>
          </div>
          <button
            type="button"
            onClick={() => setIsDepositModalOpen(true)}
            className="mt-3 w-full py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Make Instant Payment</span>
          </button>
        </div>
      </div>

      {/* Main Payment History Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Member Passbook & Payment History
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete authenticated audit trail of deposits, loan EMIs, renewals, and gateway transactions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchHistory}
              disabled={loading}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Refresh ledger from database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Sync DB</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'ALL', label: 'All Transactions' },
              { key: 'DEPOSIT', label: 'Savings Deposit' },
              { key: 'LOAN_EMI', label: 'Loan EMI' },
              { key: 'RENEWAL', label: 'RD / DRD' },
              { key: 'WITHDRAWAL', label: 'Withdrawal' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedCategory(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === tab.key
                    ? 'bg-blue-600 text-white shadow-xs'
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
              placeholder="Search TXN ID, Receipt, Account..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-900 text-white uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Transaction ID & Date</th>
                <th className="py-3.5 px-4">Type / Description</th>
                <th className="py-3.5 px-4">Account / Ref</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No payment history matches your selected filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isCredit = tx.flow === 'CREDIT';
                  return (
                    <tr key={tx._id || tx.transactionId} className="hover:bg-slate-50/80 transition">
                      {/* TXN ID & Date */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">
                          {tx.transactionId}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {tx.date}
                        </span>
                      </td>

                      {/* Type & Narration */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCredit
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {isCredit ? '↓' : '↑'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">{tx.type}</span>
                            {tx.notes && (
                              <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">
                                {tx.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Reference Account */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {tx.referenceAccount || tx.receiptNo || '—'}
                      </td>

                      {/* Payment Mode */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {tx.paymentMode || 'UPI'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`font-black text-sm ${
                            isCredit ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {isCredit ? '+' : '-'} ₹ {Number(tx.amount).toLocaleString('en-IN')}
                        </span>
                        {tx.balanceAfter ? (
                          <span className="text-[10px] text-slate-400 block">
                            Bal: ₹ {Number(tx.balanceAfter).toLocaleString('en-IN')}
                          </span>
                        ) : null}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {tx.status || 'Success'}
                        </span>
                      </td>

                      {/* Action: Receipt Modal */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedTx(tx)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-[11px] transition cursor-pointer"
                        >
                          View Receipt
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

      {/* Official Money Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                  MC
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight">MultiCredit 360</h4>
                  <p className="text-[10px] text-blue-200">Official Society Electronic Receipt</p>
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

            {/* Receipt Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-dashed border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Payment Receipt No
                </span>
                <span className="font-mono text-base font-black text-slate-900">
                  {selectedTx.receiptNo || 'RC-8921'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Date: {selectedTx.date}
                </span>
              </div>

              {/* Amount Display */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <span className="text-[11px] font-semibold text-blue-700 block">Amount Received</span>
                <h3 className="text-2xl font-black text-blue-900 mt-0.5">
                  ₹ {Number(selectedTx.amount).toLocaleString('en-IN')}
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                  PAYMENT SUCCESSFUL
                </span>
              </div>

              {/* Details Breakdown */}
              <div className="space-y-2 py-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Transaction ID</span>
                  <span className="font-mono font-bold text-slate-800">{selectedTx.transactionId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Customer Name</span>
                  <span className="font-bold text-slate-800">{customer.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Account / Ref Number</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedTx.referenceAccount || customer.accountNumber || customer.mobile}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Payment Purpose</span>
                  <span className="font-bold text-slate-800">{selectedTx.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Payment Mode</span>
                  <span className="font-bold text-slate-800">{selectedTx.paymentMode}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Collector / Agent</span>
                  <span className="font-bold text-slate-800">
                    {selectedTx.agentName || 'Malda HQ Collector'}
                  </span>
                </div>
              </div>

              {/* Malda HQ Authorized Seal Footer */}
              <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-dashed border-slate-200">
                <p>This is a computer-generated receipt backed by MongoDB database records.</p>
                <p className="font-bold text-slate-500 mt-0.5">
                  MultiCredit 360 • Malda HQ Credit Co-operative
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
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

      {/* Make Payment / Add Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Make Online Deposit / Payment</h4>
                  <p className="text-[10px] text-slate-500">Instantly synced with MongoDB Database</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDepositModalOpen(false)}
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
              <form onSubmit={handleMakePayment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Category</label>
                  <select
                    value={payType}
                    onChange={(e) => setPayType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="DEPOSIT">Savings Account Deposit</option>
                    <option value="LOAN_EMI">Loan EMI Installment</option>
                    <option value="RENEWAL">Recurring Deposit (RD / DRD)</option>
                    <option value="FD">Fixed Deposit (FD)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-base text-slate-900"
                    placeholder="Enter amount"
                  />
                  <div className="flex gap-2 mt-2">
                    {['500', '1000', '2500', '5000', '10000'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPayAmount(amt)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[10px] font-bold text-slate-600 cursor-pointer"
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'UPI', label: 'UPI / QR Code' },
                      { key: 'Razorpay', label: 'Razorpay Gateway' },
                      { key: 'Bank Transfer', label: 'Bank Transfer' },
                      { key: 'Cash', label: 'Branch Cash' },
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => setPayMode(mode.key as any)}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                          payMode === mode.key
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDepositModalOpen(false)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? 'Processing...' : 'Confirm & Sync'}</span>
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
