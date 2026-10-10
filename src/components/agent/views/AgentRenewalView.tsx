'use client';

import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Calendar,
  Clock,
  Search,
  CheckCircle,
  X,
  CreditCard,
  DollarSign,
  Printer,
  ShieldCheck,
  Building,
  User,
  Users,
  ArrowRight,
  TrendingUp,
  Receipt,
  Plus,
  AlertCircle,
  Store,
  Check,
} from 'lucide-react';
import { Agent, Customer } from '@/types';

interface DailyLoanRecord {
  id: string;
  loanId: string;
  customerName: string;
  customerId: string;
  agentId?: string;
  agentName?: string;
  loanType: string;
  amount: number;
  interestRate: number;
  dailyInstallment: number;
  daysTotal: number;
  daysPaid: number;
  missedDays: number;
  carryForwardDue: number;
  todayDue: number;
  totalPayable: number;
  totalCollected: number;
  balanceRemaining: number;
  status: string;
  appliedDate?: string;
  disbursedDate?: string;
}

interface RenewalPolicy {
  policyNo: string;
  applicantName: string;
  policyAmount: number;
  plan: string;
  totalDep: number;
  installmentsPaid: number;
  totalInstallments: number;
  nextDueDate: string;
  type: 'Own' | 'Team';
  category: 'Daily' | 'Monthly';
}

interface AgentRenewalViewProps {
  agent: Agent;
  onUpdateWallet: (amount: number) => void;
}

export default function AgentRenewalView({ agent, onUpdateWallet }: AgentRenewalViewProps) {
  const [activeTab, setActiveTab] = useState<'DailyLoans' | 'SavingsRenewal'>('DailyLoans');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Daily Loans from DB
  const [dailyLoans, setDailyLoans] = useState<DailyLoanRecord[]>([]);
  const [registeredCustomers, setRegisteredCustomers] = useState<Customer[]>([]);

  // Issue New Daily Loan Modal State
  const [isIssueLoanModalOpen, setIsIssueLoanModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [newLoanAmount, setNewLoanAmount] = useState<number>(20000);
  const [newLoanTenureDays, setNewLoanTenureDays] = useState<number>(100);
  const [newLoanInterestRate, setNewLoanInterestRate] = useState<number>(10);
  const [issueLoading, setIssueLoading] = useState(false);
  const [issueSuccessMsg, setIssueSuccessMsg] = useState('');

  // Daily Collection Modal State
  const [selectedLoan, setSelectedLoan] = useState<DailyLoanRecord | null>(null);
  const [collectionOption, setCollectionOption] = useState<'today' | 'carryForward' | 'custom'>('carryForward');
  const [customCollectAmount, setCustomCollectAmount] = useState<number>(0);
  const [payMode, setPayMode] = useState<'Cash' | 'UPI' | 'Wallet'>('Cash');
  const [paySuccessMsg, setPaySuccessMsg] = useState('');
  const [paidReceipt, setPaidReceipt] = useState<any>(null);
  const [isCollecting, setIsCollecting] = useState(false);

  // Renewal Policies (DRD & RD fallback)
  const [activeCategory, setActiveCategory] = useState<'Daily' | 'Monthly'>('Daily');
  const [selectedPolicy, setSelectedPolicy] = useState<RenewalPolicy | null>(null);
  const [payInstallmentCount, setPayInstallmentCount] = useState(1);

  // Fetch real Daily Loans and Registered Customers for this Agent
  const loadAgentLoansAndCustomers = async () => {
    setLoading(true);
    try {
      const agentIdentifier = agent.agentId || 'KNM00006282';

      // 1. Fetch Daily Loans for this agent
      const loansRes = await fetch(`/api/loans?agentId=${encodeURIComponent(agentIdentifier)}&isDaily=true`);
      const loansData = await loansRes.json();
      if (loansData.success && Array.isArray(loansData.data)) {
        setDailyLoans(loansData.data);
      }

      // 2. Fetch Customers registered under this agent
      const agentDataRes = await fetch(`/api/agent/data?agentId=${encodeURIComponent(agentIdentifier)}`);
      const agentData = await agentDataRes.json();
      if (agentData.success && agentData.data?.customers) {
        setRegisteredCustomers(agentData.data.customers);
        if (agentData.data.customers.length > 0 && !selectedCustomerId) {
          setSelectedCustomerId(agentData.data.customers[0].customerId);
        }
      }
    } catch (err) {
      console.warn('Error loading daily loans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgentLoansAndCustomers();
  }, [agent.agentId]);

  // Calculated preview for new daily loan
  const calculatedTotalPayable = newLoanAmount + Math.round((newLoanAmount * newLoanInterestRate) / 100);
  const calculatedDailyInstallment = Math.round(calculatedTotalPayable / (newLoanTenureDays || 100));
  const estimatedAgentCommission = Math.round(newLoanAmount * 0.03); // 3% commission

  // Handle Issuing New Daily Loan
  const handleIssueDailyLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert('Please select a customer');
      return;
    }

    const customer = registeredCustomers.find((c) => c.customerId === selectedCustomerId);
    setIssueLoading(true);

    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          customerName: customer ? customer.name : 'Valued Member',
          amount: newLoanAmount,
          interestRate: newLoanInterestRate,
          isDailyLoan: true,
          dailyTenureDays: newLoanTenureDays,
          daysTotal: newLoanTenureDays,
          agentId: agent.agentId || 'KNM00006282',
          agentName: agent.name,
          agentReferralCode: agent.referralCode || 'AGT-3601',
          loanType: 'Daily Loan',
          status: 'Approved',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIssueSuccessMsg(`✓ Daily Loan issued! Daily collection of ₹${calculatedDailyInstallment}/day is now active.`);
        setTimeout(() => {
          setIsIssueLoanModalOpen(false);
          setIssueSuccessMsg('');
          loadAgentLoansAndCustomers();
        }, 1200);
      } else {
        alert(data.message || 'Failed to issue loan');
      }
    } catch (err: any) {
      alert('Network error issuing daily loan');
    } finally {
      setIssueLoading(false);
    }
  };

  // Determine collection amount in modal
  const getCollectionAmount = (loan: DailyLoanRecord) => {
    if (collectionOption === 'today') return loan.dailyInstallment;
    if (collectionOption === 'carryForward') return loan.todayDue || loan.dailyInstallment;
    return customCollectAmount || loan.dailyInstallment;
  };

  // Handle Collecting Daily Loan Installment
  const handleCollectDailyLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;

    const amountToCollect = getCollectionAmount(selectedLoan);
    if (amountToCollect <= 0) {
      alert('Please enter a valid collection amount');
      return;
    }

    setIsCollecting(true);
    const commission = Math.round(amountToCollect * 0.03); // 3% collection commission

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanId: selectedLoan.loanId,
          customerId: selectedLoan.customerId,
          customerName: selectedLoan.customerName,
          amount: amountToCollect,
          agentId: agent.agentId || 'KNM00006282',
          agentName: agent.name,
          type: 'DAILY_LOAN',
          mode: payMode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update wallet locally
        onUpdateWallet(commission);

        const receipt = {
          receiptNo: data.data.receiptNo,
          loanId: selectedLoan.loanId,
          customerName: selectedLoan.customerName,
          customerId: selectedLoan.customerId,
          amount: amountToCollect,
          daysPaidCount: data.data.daysPaidCount || 1,
          commissionEarned: commission,
          mode: payMode,
          date: new Date().toLocaleString(),
          agentId: agent.agentId,
          agentName: agent.name,
        };

        setPaidReceipt(receipt);
        setPaySuccessMsg(`✓ Collection of ₹${amountToCollect} successful! ₹${commission} commission credited to wallet.`);

        // Reload data in background
        loadAgentLoansAndCustomers();
      } else {
        alert(data.message || 'Collection failed');
      }
    } catch (err) {
      alert('Network error while recording collection');
    } finally {
      setIsCollecting(false);
    }
  };

  const filteredDailyLoans = dailyLoans.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.customerName?.toLowerCase().includes(q) ||
      l.loanId?.toLowerCase().includes(q) ||
      l.customerId?.toLowerCase().includes(q)
    );
  });

  // Calculate Aggregates
  const totalDailyCollectibleToday = dailyLoans.reduce((sum, l) => sum + (l.todayDue || 0), 0);
  const totalCarryForwardDueSum = dailyLoans.reduce((sum, l) => sum + (l.carryForwardDue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Doorstep Daily Loan & Carry-Forward Collection Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Daily Collections & Carry Forward Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Track customer daily EMI collections. Missed daily installments automatically carry forward into cumulative dues. 3.0% commission instantly credited to your agent wallet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsIssueLoanModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Daily Loan</span>
            </button>
            <button
              onClick={loadAgentLoansAndCustomers}
              disabled={loading}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-xs transition flex items-center gap-1.5 cursor-pointer border border-white/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/5">
            <span className="text-slate-400 block text-[11px] font-medium">Active Daily Loans</span>
            <span className="text-xl font-black text-white mt-0.5 block">{dailyLoans.length} Loans</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/5">
            <span className="text-slate-400 block text-[11px] font-medium">Today's Total Due</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">
              ₹ {totalDailyCollectibleToday.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-amber-500/10 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-500/20">
            <span className="text-amber-300 block text-[11px] font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400" /> Carry-Forward Overdue
            </span>
            <span className="text-xl font-black text-amber-400 mt-0.5 block">
              ₹ {totalCarryForwardDueSum.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/5">
            <span className="text-slate-400 block text-[11px] font-medium">Agent Collection Cut</span>
            <span className="text-xl font-black text-indigo-300 mt-0.5 block">3.0% Instant</span>
          </div>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              setActiveTab('DailyLoans');
              setSelectedLoan(null);
              setPaidReceipt(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'DailyLoans'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4 text-amber-500" />
            <span>Daily Loans (দৈনিক ঋণ কালেকশন)</span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-100 text-amber-800">
              {dailyLoans.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, loan ID..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Daily Loans Collection Grid / Sheet */}
      {activeTab === 'DailyLoans' && (
        <div className="space-y-4">
          {filteredDailyLoans.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <Store className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Active Daily Loans Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active daily loans registered under your code yet. You can issue a new daily loan to any of your onboarded customers right now!
              </p>
              <button
                onClick={() => setIsIssueLoanModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                + Issue First Daily Loan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDailyLoans.map((loan) => {
                const daysPaid = loan.daysPaid || 0;
                const daysTotal = loan.daysTotal || 100;
                const percentage = Math.min(100, Math.round((daysPaid / daysTotal) * 100));
                const hasMissed = (loan.missedDays || 0) > 0;

                return (
                  <div
                    key={loan.id}
                    className={`bg-white rounded-3xl p-5 border transition shadow-xs flex flex-col justify-between ${
                      hasMissed
                        ? 'border-amber-300 ring-2 ring-amber-400/20 bg-gradient-to-b from-amber-50/30 to-white'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md">
                            {loan.loanId}
                          </span>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {loan.daysTotal} Days Term
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {loan.status}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="mb-3.5">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{loan.customerName}</h4>
                        <span className="text-[11px] text-slate-500 font-mono">Code: {loan.customerId}</span>
                      </div>

                      {/* Daily EMI & Due Numbers */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 mb-3 text-xs">
                        <div>
                          <span className="text-slate-500 text-[10px] block">Daily Installment</span>
                          <span className="text-sm font-extrabold text-slate-900">₹ {loan.dailyInstallment}/day</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Balance Left</span>
                          <span className="text-sm font-extrabold text-slate-900">
                            ₹ {loan.balanceRemaining?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Carry Forward Alert Banner */}
                      {hasMissed ? (
                        <div className="bg-amber-100/80 border border-amber-300 rounded-2xl p-2.5 text-xs text-amber-900 mb-3 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">
                              ⚠️ {loan.missedDays} Missed Days (Carried Forward)
                            </span>
                            <span className="text-[11px] text-amber-800">
                              Overdue: ₹{loan.carryForwardDue} + Today ₹{loan.dailyInstallment} ={' '}
                              <strong className="text-amber-950 font-black">Total Due ₹{loan.todayDue}</strong>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2 text-[11px] text-emerald-800 mb-3 flex items-center gap-1.5 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Up to date. Today's Due: ₹{loan.dailyInstallment}</span>
                        </div>
                      )}

                      {/* Repayment Progress Bar */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                          <span>Collection Progress</span>
                          <span>
                            {daysPaid} / {daysTotal} Days ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Total Due Today</span>
                        <span className="text-base font-black text-indigo-700">₹ {loan.todayDue}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLoan(loan);
                          setCollectionOption(hasMissed ? 'carryForward' : 'today');
                          setCustomCollectAmount(loan.todayDue);
                          setPaidReceipt(null);
                          setPaySuccessMsg('');
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/20"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Collect</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: Issue New Daily Loan */}
      {isIssueLoanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsIssueLoanModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Issue New Daily Loan</h3>
                <p className="text-xs text-slate-500">Provide doorstep daily market credit to your registered customer</p>
              </div>
            </div>

            {issueSuccessMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-800 text-xs font-bold text-center">
                {issueSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleIssueDailyLoan} className="space-y-4">
                {/* Select Customer */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Select Customer (Under Your Code)</label>
                  {registeredCustomers.length === 0 ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                      No customer registered under your agent code yet. Please onboard a customer first via Savings tab!
                    </div>
                  ) : (
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {registeredCustomers.map((c) => (
                        <option key={c.customerId} value={c.customerId}>
                          {c.name} ({c.customerId}) - {c.mobile}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Loan Amount & Tenure */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Loan Amount (₹)</label>
                    <input
                      type="number"
                      step="1000"
                      min="5000"
                      max="100000"
                      value={newLoanAmount}
                      onChange={(e) => setNewLoanAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Tenure (Days)</label>
                    <select
                      value={newLoanTenureDays}
                      onChange={(e) => setNewLoanTenureDays(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    >
                      <option value={30}>30 Days</option>
                      <option value={50}>50 Days</option>
                      <option value={100}>100 Days (Standard)</option>
                      <option value={150}>150 Days</option>
                    </select>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Flat Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="5"
                    max="20"
                    value={newLoanInterestRate}
                    onChange={(e) => setNewLoanInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                {/* Calculation Summary Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-slate-50 p-4 rounded-2xl border border-indigo-100 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Repayment Amount:</span>
                    <strong className="text-slate-900">₹ {calculatedTotalPayable.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Daily Installment to Collect:</span>
                    <strong className="text-indigo-700 text-sm font-black">₹ {calculatedDailyInstallment} / day</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 border-t border-indigo-100 pt-1.5">
                    <span>Your Estimated Agent Commission:</span>
                    <strong className="text-emerald-700 font-black">₹ {estimatedAgentCommission} (3%)</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={issueLoading || registeredCustomers.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{issueLoading ? 'Issuing Daily Loan...' : 'Approve & Issue Daily Loan'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Collect Daily Installment with Carry Forward Settlement */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedLoan(null)}
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Collect Daily Installment</h3>
                <p className="text-xs text-slate-500">{selectedLoan.customerName} ({selectedLoan.loanId})</p>
              </div>
            </div>

            {paidReceipt ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Payment Receipt #{paidReceipt.receiptNo}</span>
                  </div>
                  <div className="divide-y divide-emerald-200/60 pt-1 text-[11px]">
                    <div className="flex justify-between py-1">
                      <span>Amount Collected:</span>
                      <strong>₹ {paidReceipt.amount}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Days Credited:</span>
                      <strong>{paidReceipt.daysPaidCount} day(s)</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Payment Mode:</span>
                      <strong>{paidReceipt.mode}</strong>
                    </div>
                    <div className="flex justify-between py-1 text-emerald-700 font-bold">
                      <span>Agent Commission Credited:</span>
                      <strong>+ ₹ {paidReceipt.commissionEarned}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    onClick={() => setSelectedLoan(null)}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCollectDailyLoan} className="space-y-4 text-xs">
                {/* Carry Forward Information */}
                {selectedLoan.missedDays > 0 && (
                  <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl text-amber-900">
                    <div className="font-bold mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{selectedLoan.missedDays} Missed Days Carry-Forward</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Previous Missed: ₹{selectedLoan.carryForwardDue} | Today's EMI: ₹{selectedLoan.dailyInstallment}
                    </p>
                  </div>
                )}

                {/* Selection Options */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">Select Collection Option:</label>
                  
                  {selectedLoan.missedDays > 0 && (
                    <label className="flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50/50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="collectOption"
                          checked={collectionOption === 'carryForward'}
                          onChange={() => setCollectionOption('carryForward')}
                          className="accent-indigo-600"
                        />
                        <span>Clear All Dues (Carry-Forward + Today)</span>
                      </div>
                      <strong className="font-black text-amber-900">₹ {selectedLoan.todayDue}</strong>
                    </label>
                  )}

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="collectOption"
                        checked={collectionOption === 'today'}
                        onChange={() => setCollectionOption('today')}
                        className="accent-indigo-600"
                      />
                      <span>Today's Installment Only</span>
                    </div>
                    <strong className="font-black text-slate-900">₹ {selectedLoan.dailyInstallment}</strong>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="collectOption"
                        checked={collectionOption === 'custom'}
                        onChange={() => setCollectionOption('custom')}
                        className="accent-indigo-600"
                      />
                      <span>Custom Payment Amount</span>
                    </div>
                    {collectionOption === 'custom' && (
                      <input
                        type="number"
                        min="10"
                        step="10"
                        value={customCollectAmount}
                        onChange={(e) => setCustomCollectAmount(Number(e.target.value))}
                        className="w-24 px-2 py-1 text-right bg-white border border-slate-300 rounded-lg font-bold"
                      />
                    )}
                  </label>
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Mode:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Cash', 'UPI', 'Wallet'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPayMode(m)}
                        className={`py-2 rounded-xl font-bold transition cursor-pointer border ${
                          payMode === m
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Commission Preview */}
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-800 flex justify-between items-center">
                  <span>Your 3% Instant Commission:</span>
                  <strong className="text-emerald-900 font-extrabold text-sm">
                    + ₹ {Math.round(getCollectionAmount(selectedLoan) * 0.03)}
                  </strong>
                </div>

                <button
                  type="submit"
                  disabled={isCollecting}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-4 h-4" />
                  <span>
                    {isCollecting ? 'Recording Collection...' : `Confirm Collection of ₹${getCollectionAmount(selectedLoan)}`}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
