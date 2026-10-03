'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Agent } from '@/types';

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
  const [activeCategory, setActiveCategory] = useState<'Daily' | 'Monthly'>('Daily');
  const [typeFilter, setTypeFilter] = useState<'Own' | 'Team'>('Own');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected policy for payment modal
  const [selectedPolicy, setSelectedPolicy] = useState<RenewalPolicy | null>(null);
  const [payInstallmentCount, setPayInstallmentCount] = useState(1);
  const [payMode, setPayMode] = useState<'Wallet' | 'Cash' | 'UPI'>('Cash');
  const [paySuccessMsg, setPaySuccessMsg] = useState('');
  const [paidReceipt, setPaidReceipt] = useState<any>(null);

  // Initial Sample Policies based on real video records
  const [policies, setPolicies] = useState<RenewalPolicy[]>([
    {
      policyNo: 'DD0010284',
      applicantName: 'KESHAB CH MAHATO',
      policyAmount: 10,
      plan: 'DRD 365',
      totalDep: 510,
      installmentsPaid: 51,
      totalInstallments: 365,
      nextDueDate: '2026-10-04',
      type: 'Own',
      category: 'Daily',
    },
    {
      policyNo: 'DD0010354',
      applicantName: 'KESHAB CH MAHATO',
      policyAmount: 10,
      plan: 'DRD 365',
      totalDep: 130,
      installmentsPaid: 13,
      totalInstallments: 365,
      nextDueDate: '2026-10-04',
      type: 'Own',
      category: 'Daily',
    },
    {
      policyNo: 'DD0011754',
      applicantName: 'RINA MANDAL SARKAR',
      policyAmount: 200,
      plan: 'DRD 365',
      totalDep: 200,
      installmentsPaid: 1,
      totalInstallments: 365,
      nextDueDate: '2026-10-04',
      type: 'Own',
      category: 'Daily',
    },
    {
      policyNo: 'DD00045883',
      applicantName: 'ANUP SAHA',
      policyAmount: 100,
      plan: 'DRD 365',
      totalDep: 3500,
      installmentsPaid: 35,
      totalInstallments: 365,
      nextDueDate: '2026-10-04',
      type: 'Own',
      category: 'Daily',
    },
    {
      policyNo: 'DD00047994',
      applicantName: 'UTPAL MANDAL',
      policyAmount: 50,
      plan: 'DRD 100',
      totalDep: 1250,
      installmentsPaid: 25,
      totalInstallments: 100,
      nextDueDate: '2026-10-04',
      type: 'Team',
      category: 'Daily',
    },
    // Monthly RD Policies
    {
      policyNo: 'RD00037560',
      applicantName: 'KESHAB CH MAHATO',
      policyAmount: 300,
      plan: 'RD-1 YEAR',
      totalDep: 600,
      installmentsPaid: 2,
      totalInstallments: 12,
      nextDueDate: '2026-10-15',
      type: 'Own',
      category: 'Monthly',
    },
    {
      policyNo: 'RD00050268',
      applicantName: 'KESHAB CH MAHATO',
      policyAmount: 300,
      plan: 'RD-1 YEAR',
      totalDep: 300,
      installmentsPaid: 1,
      totalInstallments: 12,
      nextDueDate: '2026-10-20',
      type: 'Own',
      category: 'Monthly',
    },
    {
      policyNo: 'RD000055331',
      applicantName: 'JAYANTA CHOWDHURY',
      policyAmount: 1000,
      plan: 'RD-3 YEAR',
      totalDep: 12000,
      installmentsPaid: 12,
      totalInstallments: 36,
      nextDueDate: '2026-10-10',
      type: 'Team',
      category: 'Monthly',
    },
    {
      policyNo: 'RD000007883',
      applicantName: 'SANJIB CHOWDHURY',
      policyAmount: 500,
      plan: 'RD-5 YEAR',
      totalDep: 9000,
      installmentsPaid: 18,
      totalInstallments: 60,
      nextDueDate: '2026-10-12',
      type: 'Team',
      category: 'Monthly',
    },
  ]);

  const filteredPolicies = policies.filter(
    (p) =>
      p.category === activeCategory &&
      p.type === typeFilter &&
      (p.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.policyNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePayInstallment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolicy) return;

    const totalAmount = selectedPolicy.policyAmount * payInstallmentCount;
    const commission = Math.round(totalAmount * (activeCategory === 'Daily' ? 0.03 : 0.02));

    // Update policy total deposited
    setPolicies((prev) =>
      prev.map((p) => {
        if (p.policyNo === selectedPolicy.policyNo) {
          return {
            ...p,
            totalDep: p.totalDep + totalAmount,
            installmentsPaid: p.installmentsPaid + payInstallmentCount,
          };
        }
        return p;
      })
    );

    // Credit agent commission
    onUpdateWallet(commission);

    // Save collection record to server
    fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receiptNo: `RC${Math.floor(10000 + Math.random() * 90000)}`,
        customerName: selectedPolicy.applicantName,
        customerId: selectedPolicy.policyNo,
        agentName: agent.name,
        type: activeCategory === 'Daily' ? 'DRD' : 'RD',
        amount: totalAmount,
        mode: payMode,
        date: new Date().toLocaleDateString('en-GB'),
      }),
    }).catch(console.error);

    const receipt = {
      receiptNo: `RNW-${Math.floor(100000 + Math.random() * 900000)}`,
      policyNo: selectedPolicy.policyNo,
      applicantName: selectedPolicy.applicantName,
      plan: selectedPolicy.plan,
      installments: payInstallmentCount,
      amount: totalAmount,
      commissionEarned: commission,
      mode: payMode,
      collectorCode: agent.agentId || 'KNM00006282',
      collectorName: agent.name,
      date: new Date().toLocaleString(),
    };

    setPaidReceipt(receipt);
    setPaySuccessMsg(`✓ Payment of ₹${totalAmount} processed! ₹${commission} commission credited to agent wallet.`);
  };

  return (
    <div className="space-y-6">
      {/* 2 Renewal Mode Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            setActiveCategory('Daily');
            setSelectedPolicy(null);
            setPaidReceipt(null);
          }}
          className={`p-5 rounded-3xl border text-left transition flex items-center justify-between cursor-pointer ${
            activeCategory === 'Daily'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-600 shadow-lg shadow-indigo-500/25'
              : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <span
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                activeCategory === 'Daily' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              <Calendar className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">Daily Schemes</span>
              <h4 className="text-base font-extrabold">Daily Renewal (DRD)</h4>
              <p className={`text-xs mt-0.5 ${activeCategory === 'Daily' ? 'text-indigo-100' : 'text-slate-500'}`}>
                DRD 365, Daily Pigmy Deposit Collection
              </p>
            </div>
          </div>
          <ArrowRight className={`w-5 h-5 ${activeCategory === 'Daily' ? 'text-white' : 'text-slate-400'}`} />
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveCategory('Monthly');
            setSelectedPolicy(null);
            setPaidReceipt(null);
          }}
          className={`p-5 rounded-3xl border text-left transition flex items-center justify-between cursor-pointer ${
            activeCategory === 'Monthly'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 shadow-lg shadow-purple-500/25'
              : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <span
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                activeCategory === 'Monthly' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'
              }`}
            >
              <RefreshCw className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">Recurring Deposits</span>
              <h4 className="text-base font-extrabold">Monthly Renewal (RD)</h4>
              <p className={`text-xs mt-0.5 ${activeCategory === 'Monthly' ? 'text-purple-100' : 'text-slate-500'}`}>
                1-Year, 3-Year & 5-Year RD Installments
              </p>
            </div>
          </div>
          <ArrowRight className={`w-5 h-5 ${activeCategory === 'Monthly' ? 'text-white' : 'text-slate-400'}`} />
        </button>
      </div>

      {/* Main Renewal Table View */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-600" />
              <span>
                {activeCategory === 'Daily' ? 'Daily Renewal (DRD 365)' : 'Monthly Recurring Deposit (RD) Renewal'}
              </span>
            </h3>
            <p className="text-xs text-slate-500">Collect doorstep installments with instant receipt generation</p>
          </div>

          {/* Type Filter & Search Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Own vs Team Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setTypeFilter('Own')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  typeFilter === 'Own' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Own Policies
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('Team')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  typeFilter === 'Team' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Team Downline
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Policy No or Name..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Policy Renewal List Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Policy No</th>
                <th className="py-3 px-4">App Name</th>
                <th className="py-3 px-4 text-right">Policy Amount</th>
                <th className="py-3 px-4">Plan Code</th>
                <th className="py-3 px-4 text-right">Total Dep (₹)</th>
                <th className="py-3 px-4 text-center">Progress</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPolicies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No renewal policies found for {typeFilter} selection.
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((pol) => (
                  <tr key={pol.policyNo} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-indigo-700">{pol.policyNo}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{pol.applicantName}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                      ₹ {pol.policyAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px]">
                        {pol.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                      ₹ {pol.totalDep.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[10px] text-slate-500 block">
                        {pol.installmentsPaid} / {pol.totalInstallments}
                      </span>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mt-1 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${Math.min(100, (pol.installmentsPaid / pol.totalInstallments) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPolicy(pol);
                          setPayInstallmentCount(1);
                          setPaidReceipt(null);
                          setPaySuccessMsg('');
                        }}
                        className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-extrabold shadow-sm cursor-pointer transition"
                      >
                        PAY
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Collect Installment: {selectedPolicy.policyNo}
                </h4>
                <p className="text-[11px] text-slate-500">Applicant: {selectedPolicy.applicantName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paySuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{paySuccessMsg}</span>
              </div>
            )}

            {!paidReceipt ? (
              <form onSubmit={handlePayInstallment} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Plan Name</span>
                    <span className="font-bold text-slate-800">{selectedPolicy.plan}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rate / Installment</span>
                    <span className="font-extrabold text-indigo-700">₹ {selectedPolicy.policyAmount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Deposited</span>
                    <span className="font-bold text-emerald-700">₹ {selectedPolicy.totalDep}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Paid Count</span>
                    <span className="font-medium text-slate-700">{selectedPolicy.installmentsPaid} Installments</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Number of Installments to Pay</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={payInstallmentCount}
                    onChange={(e) => setPayInstallmentCount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-extrabold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Handover Mode</label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800"
                  >
                    <option value="Cash">Cash (Doorstep Handover)</option>
                    <option value="UPI">UPI / QR Code Scan</option>
                    <option value="Wallet">Agent Live Wallet Balance</option>
                  </select>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-indigo-600 block">Total Payable Amount</span>
                    <span className="text-lg font-extrabold text-indigo-950">
                      ₹ {(selectedPolicy.policyAmount * payInstallmentCount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-600 block font-semibold">Agent Commission</span>
                    <span className="text-sm font-extrabold text-emerald-700">
                      + ₹{Math.round(selectedPolicy.policyAmount * payInstallmentCount * 0.025)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPolicy(null)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow-md shadow-pink-500/25 cursor-pointer"
                  >
                    Confirm & Collect [PAY]
                  </button>
                </div>
              </form>
            ) : (
              /* Payment Confirmation & Receipt Preview */
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 font-mono">
                  <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                    <span>RECEIPT #{paidReceipt.receiptNo}</span>
                    <span>{paidReceipt.date}</span>
                  </div>
                  <div className="text-base font-bold text-white">{paidReceipt.applicantName}</div>
                  <div className="text-xs text-indigo-300">Policy: {paidReceipt.policyNo} ({paidReceipt.plan})</div>
                  <div className="flex justify-between pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Paid Amount:</span>
                    <span className="text-base font-extrabold text-emerald-400">₹ {paidReceipt.amount}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Collector:</span>
                    <span>{paidReceipt.collectorName} ({paidReceipt.collectorCode})</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPolicy(null)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
