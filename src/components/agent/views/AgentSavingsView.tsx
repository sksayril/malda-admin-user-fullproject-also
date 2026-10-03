'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  ArrowRightLeft,
  History,
  FileSpreadsheet,
  Search,
  Download,
  Share2,
  CheckCircle,
  X,
  CreditCard,
  Building,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Printer,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { Agent, Customer } from '@/types';

interface AgentSavingsViewProps {
  agent: Agent;
  customers: Customer[];
  onAddCustomer: (customer: Customer, commission: number) => void;
  onUpdateWallet: (amount: number) => void;
}

export default function AgentSavingsView({
  agent,
  customers,
  onAddCustomer,
  onUpdateWallet,
}: AgentSavingsViewProps) {
  const [subTab, setSubTab] = useState<'create' | 'transaction' | 'last10' | 'statement'>('create');

  // Create Account State
  const [custName, setCustName] = useState('');
  const [custMobile, setCustMobile] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('pass123');
  const [custPan, setCustPan] = useState('');
  const [custAadhaar, setCustAadhaar] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custPincode, setCustPincode] = useState('');
  const [initialDeposit, setInitialDeposit] = useState(1000);
  const [createLoading, setCreateLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Transaction State
  const [txCustSearch, setTxCustSearch] = useState('');
  const [selectedTxCustomer, setSelectedTxCustomer] = useState<Customer | null>(null);
  const [txType, setTxType] = useState<'Deposit' | 'Withdrawal' | 'Transfer'>('Deposit');
  const [txAmount, setTxAmount] = useState<number>(500);
  const [txRemarks, setTxRemarks] = useState('');
  const [receiptData, setReceiptData] = useState<any>(null);

  // Statement State
  const [stmtSearch, setStmtSearch] = useState('');
  const [selectedStmtCust, setSelectedStmtCust] = useState<Customer | null>(null);
  const [showStatement, setShowStatement] = useState(false);

  // Mock Transactions dataset
  const [transactions, setTransactions] = useState<any[]>([
    {
      id: 'TXN-984210',
      accountNo: 'SB-11421473',
      custName: 'KESHAB MANDAL',
      type: 'Deposit',
      amount: 18875.59,
      date: '2026-09-28 11:24 AM',
      balanceAfter: 24500.0,
      mode: 'Cash',
      status: 'Success',
    },
    {
      id: 'TXN-984209',
      accountNo: 'SB-11421325',
      custName: 'KESHAB CH MAHATO',
      type: 'Deposit',
      amount: 20000.0,
      date: '2026-09-26 03:15 PM',
      balanceAfter: 45200.0,
      mode: 'UPI',
      status: 'Success',
    },
    {
      id: 'TXN-984208',
      accountNo: 'SB-11421473',
      custName: 'KESHAB MANDAL',
      type: 'Withdrawal',
      amount: 21906.75,
      date: '2026-09-24 09:40 AM',
      balanceAfter: 5624.41,
      mode: 'Cash',
      status: 'Success',
    },
    {
      id: 'TXN-984207',
      accountNo: 'SB-11421473',
      custName: 'KESHAB MANDAL',
      type: 'Deposit',
      amount: 52.15,
      date: '2026-09-20 01:10 PM',
      balanceAfter: 27531.16,
      mode: 'Auto Interest',
      status: 'Success',
    },
    {
      id: 'TXN-984206',
      accountNo: 'SB-11423496',
      custName: 'RINA MANDAL SARKAR',
      type: 'Withdrawal',
      amount: 578.5,
      date: '2026-09-18 04:30 PM',
      balanceAfter: 14200.0,
      mode: 'Cash',
      status: 'Success',
    },
    {
      id: 'TXN-984205',
      accountNo: 'SB-11423496',
      custName: 'RINA MANDAL SARKAR',
      type: 'Deposit',
      amount: 8100.0,
      date: '2026-09-15 12:00 PM',
      balanceAfter: 14778.5,
      mode: 'UPI',
      status: 'Success',
    },
    {
      id: 'TXN-984204',
      accountNo: 'SB-11421325',
      custName: 'KESHAB CH MAHATO',
      type: 'Deposit',
      amount: 1042.0,
      date: '2026-09-12 10:15 AM',
      balanceAfter: 25200.0,
      mode: 'Cash',
      status: 'Success',
    },
  ]);

  // Handle New Customer Account Creation
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setSuccessMsg('');

    try {
      const generatedAcc = `SB-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const newCust: Customer = {
        id: `CUS-${Date.now()}`,
        customerId: `CUS-${Math.floor(1000 + Math.random() * 9000)}`,
        name: custName,
        mobile: custMobile,
        email: custEmail || `${custMobile}@domain.com`,
        password: custPassword,
        panNumber: custPan.toUpperCase(),
        adhaarNumber: custAadhaar,
        address: custAddress,
        pincode: custPincode,
        accountNumber: generatedAcc,
        savingsBalance: Number(initialDeposit) || 1000,
        type: 'Loan',
        status: 'Active',
        kycStatus: 'Verified',
        accountsCount: 1,
        loansCount: 0,
        depositsCount: 0,
        collectionsCount: 0,
        documentsCount: 2,
      };

      // API call to server
      const res = await fetch('/api/agent/create-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.agentId,
          agentReferralCode: agent.referralCode || `AGT-${agent.mobile?.slice(-4) || '3601'}`,
          ...newCust,
        }),
      });

      const commission = 250;
      onAddCustomer(newCust, commission);
      onUpdateWallet(commission);

      // Add initial transaction
      setTransactions((prev) => [
        {
          id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          accountNo: generatedAcc,
          custName: newCust.name,
          type: 'Deposit',
          amount: Number(initialDeposit),
          date: new Date().toLocaleString(),
          balanceAfter: Number(initialDeposit),
          mode: 'Cash',
          status: 'Success',
        },
        ...prev,
      ]);

      setSuccessMsg(
        `✓ Savings Account ${generatedAcc} created for ${newCust.name}! ₹${commission} direct onboarding commission added to your wallet.`
      );

      // Clear Form
      setCustName('');
      setCustMobile('');
      setCustEmail('');
      setCustPan('');
      setCustAadhaar('');
      setCustAddress('');
      setCustPincode('');
      setInitialDeposit(1000);
    } catch (err: any) {
      alert(err.message || 'Error creating account');
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle Transaction (Deposit/Withdrawal)
  const handleExecuteTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxCustomer) {
      alert('Please select a customer account');
      return;
    }

    const currentBal = selectedTxCustomer.savingsBalance || 5000;
    let newBal = currentBal;
    if (txType === 'Deposit') {
      newBal = currentBal + Number(txAmount);
    } else if (txType === 'Withdrawal') {
      if (currentBal < Number(txAmount)) {
        alert('Insufficient account balance for withdrawal!');
        return;
      }
      newBal = currentBal - Number(txAmount);
    }

    selectedTxCustomer.savingsBalance = newBal;

    const newTx = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      accountNo: selectedTxCustomer.accountNumber || `SB-${selectedTxCustomer.mobile}`,
      custName: selectedTxCustomer.name,
      type: txType,
      amount: Number(txAmount),
      date: new Date().toLocaleString(),
      balanceAfter: newBal,
      mode: 'Doorstep Agent',
      status: 'Success',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Give agent commission on collection
    if (txType === 'Deposit') {
      const comm = Math.round(Number(txAmount) * 0.015);
      onUpdateWallet(comm);
    }

    setReceiptData({
      ...newTx,
      agentName: agent.name,
      agentId: agent.agentId,
      branch: agent.branch,
    });
  };

  return (
    <div className="space-y-6">
      {/* 4 Feature Sub-Nav Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setSubTab('create')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
            subTab === 'create'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
              : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                subTab === 'create' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              <UserPlus className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Module 1.1</span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Create Account</h4>
            <p className={`text-[11px] mt-0.5 ${subTab === 'create' ? 'text-indigo-100' : 'text-slate-500'}`}>
              New Savings KYC Form
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('transaction')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
            subTab === 'transaction'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
              : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                subTab === 'transaction' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <ArrowRightLeft className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Module 1.2</span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Account Transaction</h4>
            <p className={`text-[11px] mt-0.5 ${subTab === 'transaction' ? 'text-indigo-100' : 'text-slate-500'}`}>
              Deposit & Withdraw
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('last10')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
            subTab === 'last10'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
              : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                subTab === 'last10' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-600'
              }`}
            >
              <History className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Module 1.3</span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Last 10 Transactions</h4>
            <p className={`text-[11px] mt-0.5 ${subTab === 'last10' ? 'text-indigo-100' : 'text-slate-500'}`}>
              Mini Statement Feed
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('statement')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
            subTab === 'statement'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
              : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                subTab === 'statement' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Module 1.4</span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Account Statement</h4>
            <p className={`text-[11px] mt-0.5 ${subTab === 'statement' ? 'text-indigo-100' : 'text-slate-500'}`}>
              Lookup, Download & Share
            </p>
          </div>
        </button>
      </div>

      {/* 1. Create Account View */}
      {subTab === 'create' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <span>Open New Savings Bank (SB) Account</span>
              </h3>
              <p className="text-xs text-slate-500">
                Collector Branch: <strong className="text-slate-700">{agent.branch}</strong> • Auto-credited Onboarding Commission: <strong className="text-emerald-600">+₹250</strong>
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              Active Sponsor: {agent.agentId}
            </span>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateAccount} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. KESHAB MANDAL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={custMobile}
                  onChange={(e) => setCustMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email ID (Optional)</label>
                <input
                  type="email"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="customer@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Deposit Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="500"
                  step="100"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-extrabold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">PAN Card Number</label>
                <input
                  type="text"
                  value={custPan}
                  onChange={(e) => setCustPan(e.target.value.toUpperCase())}
                  placeholder="BWPPK1428J"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono uppercase text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Aadhaar Card Number</label>
                <input
                  type="text"
                  value={custAadhaar}
                  onChange={(e) => setCustAadhaar(e.target.value)}
                  placeholder="4582 7431 5828"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-900"
                />
              </div>

              <div className="sm:col-span-2 grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Communication Address</label>
                  <input
                    type="text"
                    value={custAddress}
                    onChange={(e) => setCustAddress(e.target.value)}
                    placeholder="PAKUAHAT, MALDA, WEST BENGAL"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={custPincode}
                    onChange={(e) => setCustPincode(e.target.value)}
                    placeholder="732122"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={createLoading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                <span>{createLoading ? 'Processing KYC...' : 'Open Account & Issue Passbook'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Account Transaction View */}
      {subTab === 'transaction' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
                <span>Doorstep Savings Account Transaction</span>
              </h3>
              <p className="text-xs text-slate-500">Perform Cash/UPI Deposit or Authorized Withdrawal</p>
            </div>

            <form onSubmit={handleExecuteTransaction} className="space-y-4 text-xs">
              {/* Customer Selector / Search */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Customer Savings Account *</label>
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={txCustSearch}
                    onChange={(e) => setTxCustSearch(e.target.value)}
                    placeholder="Type name or account no to search customer..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {customers
                    .filter(
                      (c) =>
                        c.name.toLowerCase().includes(txCustSearch.toLowerCase()) ||
                        c.accountNumber?.includes(txCustSearch) ||
                        c.mobile.includes(txCustSearch)
                    )
                    .map((cust) => (
                      <div
                        key={cust.id}
                        onClick={() => setSelectedTxCustomer(cust)}
                        className={`p-3 flex items-center justify-between cursor-pointer transition ${
                          selectedTxCustomer?.id === cust.id
                            ? 'bg-indigo-50/80 border-l-4 border-indigo-600'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">{cust.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            A/C: {cust.accountNumber || `SB-${cust.mobile}`} • {cust.mobile}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Available Bal</span>
                          <span className="font-extrabold text-slate-900">
                            ₹ {(cust.savingsBalance || 15000).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Transaction Type */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTxType('Deposit')}
                  className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition ${
                    txType === 'Deposit'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Deposit (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTxType('Withdrawal')}
                  className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition ${
                    txType === 'Withdrawal'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Withdrawal (-)</span>
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Transaction Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="10"
                  step="10"
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-extrabold text-base"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks / Note</label>
                <input
                  type="text"
                  value={txRemarks}
                  onChange={(e) => setTxRemarks(e.target.value)}
                  placeholder="e.g. Weekly savings deposit"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedTxCustomer}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
              >
                Confirm & Generate Official Receipt
              </button>
            </form>
          </div>

          {/* Live Receipt Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold tracking-tight">Transaction Receipt</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-900/60 text-indigo-300 border border-indigo-700">
                  MC360 LIVE
                </span>
              </div>

              {receiptData ? (
                <div className="mt-4 space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-mono">TXN #{receiptData.id}</span>
                    <span className="text-base font-extrabold text-white block">{receiptData.custName}</span>
                    <span className="text-[11px] text-indigo-300 font-mono">A/C: {receiptData.accountNo}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Action:</span>
                    <span className="font-bold text-emerald-400">{receiptData.type}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Amount:</span>
                    <span className="font-extrabold text-white text-base">
                      ₹ {receiptData.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">New Balance:</span>
                    <span className="font-bold text-indigo-300">
                      ₹ {receiptData.balanceAfter.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Agent:</span>
                    <span className="font-medium text-slate-300">{receiptData.agentName} ({receiptData.agentId})</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Date:</span>
                    <span className="font-mono text-slate-300 text-[10px]">{receiptData.date}</span>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500 text-xs">
                  Select customer and submit transaction to view and print receipt.
                </div>
              )}
            </div>

            {receiptData && (
              <div className="pt-4 border-t border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Last 10 Transactions View */}
      {subTab === 'last10' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500" />
                <span>Last 10 Savings Account Transactions</span>
              </h3>
              <p className="text-xs text-slate-500">Real-time ledger updates across your assigned accounts</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              Showing {transactions.slice(0, 10).length} records
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Txn ID</th>
                  <th className="py-3 px-4">Account No</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-right">Balance (₹)</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transactions.slice(0, 10).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{tx.id}</td>
                    <td className="py-3 px-4 font-mono text-indigo-600 font-bold">{tx.accountNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{tx.custName}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.type === 'Deposit'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      ₹ {Number(tx.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      ₹ {Number(tx.balanceAfter).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400 font-mono">{tx.date}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Account Statement View */}
      {subTab === 'statement' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <span>Customer Savings Account Statement</span>
            </h3>
            <p className="text-xs text-slate-500">Search customer, view ledger statement, download PDF or share</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">Search Customer</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={stmtSearch}
                  onChange={(e) => setStmtSearch(e.target.value)}
                  placeholder="Search name or account..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">Select Account</label>
              <select
                onChange={(e) => {
                  const found = customers.find((c) => c.accountNumber === e.target.value || c.id === e.target.value);
                  setSelectedStmtCust(found || null);
                  setShowStatement(false);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="">-- Choose Account --</option>
                {customers
                  .filter((c) => c.name.toLowerCase().includes(stmtSearch.toLowerCase()))
                  .map((c) => (
                    <option key={c.id} value={c.accountNumber || c.id}>
                      {c.name} - {c.accountNumber || `SB-${c.mobile}`}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setShowStatement(true)}
                disabled={!selectedStmtCust}
                className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                Show Statement
              </button>
              <button
                type="button"
                onClick={() => alert('Statement PDF downloaded')}
                disabled={!showStatement}
                className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-40"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => alert('Statement link copied to clipboard')}
                disabled={!showStatement}
                className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-40"
                title="Share Statement"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Statement Sheet */}
          {showStatement && selectedStmtCust && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Applicant Name</span>
                  <span className="font-extrabold text-slate-900">{selectedStmtCust.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Account Number</span>
                  <span className="font-mono font-bold text-indigo-600">
                    {selectedStmtCust.accountNumber || `SB-${selectedStmtCust.mobile}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Mobile No</span>
                  <span className="font-medium text-slate-700">{selectedStmtCust.mobile}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Current Balance</span>
                  <span className="font-extrabold text-emerald-600 text-sm">
                    ₹ {(selectedStmtCust.savingsBalance || 15000).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Transactions in statement */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Particulars / Txn ID</th>
                      <th className="py-2.5 px-3 text-right">Debit (-)</th>
                      <th className="py-2.5 px-3 text-right">Credit (+)</th>
                      <th className="py-2.5 px-3 text-right">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {transactions
                      .filter((tx) => tx.custName === selectedStmtCust.name || tx.accountNo === selectedStmtCust.accountNumber)
                      .map((t) => (
                        <tr key={t.id}>
                          <td className="py-2.5 px-3 text-[11px] font-mono text-slate-400">{t.date}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-900">{t.type} - #{t.id}</td>
                          <td className="py-2.5 px-3 text-right text-rose-600 font-bold">
                            {t.type === 'Withdrawal' ? `₹ ${t.amount.toLocaleString('en-IN')}` : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">
                            {t.type === 'Deposit' ? `₹ ${t.amount.toLocaleString('en-IN')}` : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                            ₹ {t.balanceAfter.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
