'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Share2,
  Calendar,
  Layers,
  PiggyBank,
  Briefcase,
  AlertCircle,
  Building,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { Agent } from '@/types';

interface AgentQueryReportsViewProps {
  agent: Agent;
}

export default function AgentQueryReportsView({ agent }: AgentQueryReportsViewProps) {
  const [activeQueryModule, setActiveQueryModule] = useState<
    'dailyRd' | 'rd' | 'sb' | 'fd' | 'loan' | 'businessReport' | 'emiCollection' | 'dueEmi' | 'savingWork' | 'planSummary'
  >('businessReport');

  // Daily RD & RD State
  const [selectedPolicyNo, setSelectedPolicyNo] = useState('DD00045883');
  const [showDailyStatement, setShowDailyStatement] = useState(false);

  // SB State
  const [sbSearchTerm, setSbSearchTerm] = useState('keshab');
  const [selectedSbAccount, setSelectedSbAccount] = useState('KISALY511421473');
  const [showSbStatement, setShowSbStatement] = useState(false);

  // Loan State
  const [selectedLoanId, setSelectedLoanId] = useState('L011822');
  const [showLoanStatement, setShowLoanStatement] = useState(false);

  // Business Report State (From Video!)
  const [bizType, setBizType] = useState<'SELF' | 'TEAM'>('TEAM');
  const [collectionType, setCollectionType] = useState<'ALL' | 'RD' | 'DRD' | 'SAVINGS' | 'LOAN'>('ALL');
  const [fromDate, setFromDate] = useState('2026-09-01');
  const [toDate, setToDate] = useState('2026-09-30');
  const [isSearchingBiz, setIsSearchingBiz] = useState(false);
  const [bizSearchResults, setBizSearchResults] = useState<any[]>([]);

  // Sample Policies
  const sampleDailyPolicies = [
    { code: 'DD00045883', name: 'ANUP SAHA' },
    { code: 'DD00047994', name: 'UTPAL MANDAL' },
    { code: 'DD00102841', name: 'KESHAB CH MAHATO' },
    { code: 'DD00103540', name: 'KESHAB CH MAHATO' },
    { code: 'DD00117540', name: 'RINA MANDAL SARKAR' },
    { code: 'RD00037560', name: 'KESHAB CH MAHATO' },
    { code: 'RD00050268', name: 'KESHAB CH MAHATO' },
  ];

  const sampleSbAccounts = [
    { code: 'KISALY511421473', name: 'KESHAB MANDAL', balance: 18875.59 },
    { code: 'KISALY511421325', name: 'KESHAB CH MAHATO', balance: 25200.0 },
    { code: 'KISALY511423496', name: 'RINA MANDAL SARKAR', balance: 14778.5 },
  ];

  const sampleLoans = [
    { code: 'L011822', customer: 'SWAPAN BALA', amount: 50000, emi: 2857, tenure: 24, paidEmis: 8, balance: 34200 },
    { code: 'L012595', customer: 'KESHAR DAS', amount: 75000, emi: 4300, tenure: 24, paidEmis: 6, balance: 54100 },
    { code: 'L011908', customer: 'MAHESHWAR MAHATO', amount: 30000, emi: 1892, tenure: 18, paidEmis: 12, balance: 9400 },
  ];

  // Comprehensive Dataset for Business Report (matches video live stream)
  const masterBizData = [
    { id: 'DD000059750', type: 'Policy Renewal', planCode: 'DRD', amount: 3000, date: '20260905', colCode: 'HOK0000002', bizType: 'TEAM', cat: 'DRD' },
    { id: 'DD000059750', type: 'Policy Renewal', planCode: 'DRD', amount: 5000, date: '20260907', colCode: 'HOK0000002', bizType: 'TEAM', cat: 'DRD' },
    { id: 'DD000060582', type: 'Policy Renewal', planCode: 'DRD', amount: 2000, date: '20260907', colCode: 'HOK0000002', bizType: 'TEAM', cat: 'DRD' },
    { id: 'DD000060582', type: 'Policy Renewal', planCode: 'DRD', amount: 4300, date: '20260909', colCode: 'HOK0000002', bizType: 'TEAM', cat: 'DRD' },
    { id: 'DD0000591614', type: 'Policy Renewal', planCode: 'DRD', amount: 18400, date: '20260907', colCode: 'HOK0000002', bizType: 'TEAM', cat: 'DRD' },
    { id: 'DD0000591614', type: 'Policy Renewal', planCode: 'DRD', amount: 7000, date: '20260907', colCode: 'HOK0000002', bizType: 'TEAM', cat: 'DRD' },
    { id: 'DD000060582', type: 'Policy Renewal', planCode: 'DRD', amount: 1000, date: '20260909', colCode: 'HOK0000002', bizType: 'TEAM', cat: 'DRD' },
    { id: 'DD000060582', type: 'Policy Renewal', planCode: 'DRD', amount: 2000, date: '20260909', colCode: 'HOK0000002', bizType: 'TEAM', cat: 'DRD' },
    { id: 'DD000060582', type: 'Policy Renewal', planCode: 'DRD', amount: 23000, date: '20260914', colCode: 'HOK0000002', bizType: 'TEAM', cat: 'DRD' },
    { id: 'DD000059750', type: 'Policy Renewal', planCode: 'DRD', amount: 16500, date: '20260915', colCode: 'HOK0000002', bizType: 'TEAM', cat: 'DRD' },
    { id: 'DD000060582', type: 'Policy Renewal', planCode: 'DRD', amount: 18900, date: '20260918', colCode: 'HOK0000002', bizType: 'TEAM', cat: 'DRD' },
    { id: 'RD000055331', type: 'Policy Renewal', planCode: 'RD', amount: 10000, date: '20260920', colCode: 'KNM00000017', bizType: 'TEAM', cat: 'RD' },
    { id: 'RD000055331', type: 'Policy Renewal', planCode: 'RD', amount: 90000, date: '20260929', colCode: 'KNM00000017', bizType: 'TEAM', cat: 'RD' },
    { id: 'RD000007883', type: 'Policy Renewal', planCode: 'RD', amount: 50000, date: '20260920', colCode: 'KNM00000017', bizType: 'TEAM', cat: 'RD' },
    { id: 'RD000007883', type: 'Policy Renewal', planCode: 'RD', amount: 20000, date: '20260929', colCode: 'KNM00000017', bizType: 'TEAM', cat: 'RD' },
    { id: 'RD000007883', type: 'Policy Renewal', planCode: 'RD', amount: 900, date: '20260930', colCode: 'KNM00000017', bizType: 'TEAM', cat: 'RD' },
    { id: 'KISALY511421473', type: 'Savings Transaction', planCode: 'SD04', amount: 18875.59, date: '20260918', colCode: 'KNM00006282', bizType: 'TEAM', cat: 'SAVINGS' },
    { id: 'KISALY511421473', type: 'Savings Transaction', planCode: 'SD04', amount: 20000, date: '20260918', colCode: 'KNM00006282', bizType: 'TEAM', cat: 'SAVINGS' },
    { id: 'KISALY511421473', type: 'Savings Transaction', planCode: 'SD04', amount: -21906.75, date: '20260918', colCode: 'KNM00006282', bizType: 'TEAM', cat: 'SAVINGS' },
    { id: 'KISALY511423496', type: 'Savings Transaction', planCode: 'SD04', amount: 8100, date: '20260915', colCode: 'KNM00006282', bizType: 'TEAM', cat: 'SAVINGS' },
    { id: 'L012595', type: 'Loan Repayment', planCode: 'KINL013', amount: 1891, date: '20260905', colCode: 'KNM00006282', bizType: 'TEAM', cat: 'LOAN' },
    { id: 'L011908', type: 'Loan Repayment', planCode: 'KINL015', amount: 3782, date: '20260905', colCode: 'KNM00006282', bizType: 'TEAM', cat: 'LOAN' },
    { id: 'L013097', type: 'Loan Repayment', planCode: 'KINL013', amount: 5701, date: '20260905', colCode: 'KNM00006282', bizType: 'TEAM', cat: 'LOAN' },
    { id: 'L011822', type: 'Loan Repayment', planCode: 'KINL018', amount: 12295, date: '20260907', colCode: 'KNM00006282', bizType: 'TEAM', cat: 'LOAN' },
    { id: 'L009820', type: 'Loan Repayment', planCode: 'KINL013', amount: 15128, date: '20260928', colCode: 'KNM00006282', bizType: 'TEAM', cat: 'LOAN' },
  ];

  const handleSearchBusinessReport = () => {
    setIsSearchingBiz(true);
    setTimeout(() => {
      const filtered = masterBizData.filter((item) => {
        if (collectionType !== 'ALL' && item.cat !== collectionType) return false;
        return true;
      });
      setBizSearchResults(filtered);
      setIsSearchingBiz(false);
    }, 400);
  };

  const totalCollectionSum = (bizSearchResults.length > 0 ? bizSearchResults : masterBizData).reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  return (
    <div className="space-y-6">
      {/* 10 Query & Report Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { key: 'dailyRd', title: 'Daily RD', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { key: 'rd', title: 'RD Account', icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50' },
          { key: 'sb', title: 'SB Account', icon: PiggyBank, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { key: 'fd', title: 'FD Deposits', icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
          { key: 'loan', title: 'Loan EMI', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
          { key: 'businessReport', title: 'Business Report', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { key: 'emiCollection', title: 'EMI Collection', icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-50' },
          { key: 'dueEmi', title: 'Due EMI Report', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { key: 'savingWork', title: 'Saving Work', icon: Clock, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { key: 'planSummary', title: 'Plan Summary', icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((mod) => {
          const Icon = mod.icon;
          const isActive = activeQueryModule === mod.key;
          return (
            <button
              key={mod.key}
              type="button"
              onClick={() => setActiveQueryModule(mod.key as any)}
              className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-white/20 text-white' : `${mod.bg} ${mod.color}`
                }`}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span className="font-extrabold text-xs tracking-tight">{mod.title}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Business Report View (Core Main Feature from Video) */}
      {activeQueryModule === 'businessReport' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Agent Business Summary & Performance Ledger</span>
              </h3>
              <p className="text-xs text-slate-500">Filter collection ledger by Self or Team and plan categories</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
              Collector: {agent.agentId || 'KNM00006282'}
            </span>
          </div>

          {/* Form Filters matching video UI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Employee Name</label>
              <input
                type="text"
                readOnly
                value={agent.name || 'KESHAB CH MAHATO'}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Employee Code</label>
              <input
                type="text"
                readOnly
                value={agent.agentId || 'KNM00006282'}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Biz. Type</label>
              <select
                value={bizType}
                onChange={(e) => setBizType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-indigo-700"
              >
                <option value="SELF">SELF</option>
                <option value="TEAM">TEAM</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Collection Type</label>
              <select
                value={collectionType}
                onChange={(e) => setCollectionType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                <option value="ALL">ALL COLLECTIONS</option>
                <option value="RD">RD (Recurring)</option>
                <option value="DRD">DRD (Daily)</option>
                <option value="SAVINGS">SAVINGS (SB)</option>
                <option value="LOAN">LOAN (EMI)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleSearchBusinessReport}
              disabled={isSearchingBiz}
              className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-pink-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{isSearchingBiz ? 'Searching...' : 'SEARCH BUSINESS LEDGER'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Txn / Policy Id</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Plan Code</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Col Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(bizSearchResults.length > 0 ? bizSearchResults : masterBizData).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.id}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-indigo-700">{row.planCode}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      ₹ {row.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{row.date}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 font-semibold">{row.colCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Total Collection Calculation Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-extrabold tracking-tight">
                Total Collection ({bizType} • {collectionType}):
              </span>
            </div>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">
              ₹ {totalCollectionSum.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      {/* 2. Daily RD Query */}
      {activeQueryModule === 'dailyRd' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Daily Recurring Deposit (DRD) Policy Query</span>
            </h3>
            <p className="text-xs text-slate-500">Lookup installment dues, payment dates and passbook schedule</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Policy *</label>
              <select
                value={selectedPolicyNo}
                onChange={(e) => {
                  setSelectedPolicyNo(e.target.value);
                  setShowDailyStatement(false);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                {sampleDailyPolicies.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} - {p.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Policy No.</label>
              <input
                type="text"
                readOnly
                value={selectedPolicyNo}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono font-extrabold text-indigo-700"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setShowDailyStatement(true)}
                className="flex-1 py-2 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Show
              </button>
              <button
                type="button"
                onClick={() => alert('PDF downloaded')}
                className="p-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => alert('Share link copied')}
                className="p-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showDailyStatement && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 mt-4">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-pink-600 text-white uppercase font-bold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Policy No.</th>
                    <th className="py-3 px-4">Inst. No</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Pay Date</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{selectedPolicyNo}</td>
                    <td className="py-3 px-4 font-bold text-center">1</td>
                    <td className="py-3 px-4 font-mono text-slate-400">--/--/----</td>
                    <td className="py-3 px-4 font-mono text-slate-700">31/03/2026</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">100</td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-600">100</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{selectedPolicyNo}</td>
                    <td className="py-3 px-4 font-bold text-center">2</td>
                    <td className="py-3 px-4 font-mono text-slate-400">--/--/----</td>
                    <td className="py-3 px-4 font-mono text-slate-700">01/04/2026</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">100</td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-600">200</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. SB Account Query */}
      {activeQueryModule === 'sb' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-emerald-600" />
              <span>Savings Bank (SB) Account Inquiry</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Account No.</label>
              <select
                value={selectedSbAccount}
                onChange={(e) => {
                  setSelectedSbAccount(e.target.value);
                  setShowSbStatement(false);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {sampleSbAccounts.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.name} - {a.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Account No.</label>
              <input
                type="text"
                readOnly
                value={selectedSbAccount}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-indigo-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Applicant Name</label>
              <input
                type="text"
                readOnly
                value={sampleSbAccounts.find((a) => a.code === selectedSbAccount)?.name || ''}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Balance</label>
              <input
                type="text"
                readOnly
                value={`₹ ${sampleSbAccounts.find((a) => a.code === selectedSbAccount)?.balance.toLocaleString('en-IN')}`}
                className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-extrabold"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowSbStatement(true)}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold"
            >
              Show Statement
            </button>
            <button
              type="button"
              onClick={() => alert('Downloaded')}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Shared')}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Loan EMI Query */}
      {activeQueryModule === 'loan' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-600" />
              <span>Loan Schedule & EMI Inquiry</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Loan</label>
              <select
                value={selectedLoanId}
                onChange={(e) => {
                  setSelectedLoanId(e.target.value);
                  setShowLoanStatement(false);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {sampleLoans.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.customer} - {l.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Loan ID</label>
              <input
                type="text"
                readOnly
                value={selectedLoanId}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-indigo-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                readOnly
                value={sampleLoans.find((l) => l.code === selectedLoanId)?.customer || ''}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowLoanStatement(true)}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold"
            >
              Show
            </button>
            <button
              type="button"
              onClick={() => alert('Downloaded')}
              className="p-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => alert('Shared')}
              className="p-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Other Quick Reports: FD, EMI Collection, Due EMI, Plan Summary */}
      {(activeQueryModule === 'fd' ||
        activeQueryModule === 'rd' ||
        activeQueryModule === 'emiCollection' ||
        activeQueryModule === 'dueEmi' ||
        activeQueryModule === 'savingWork' ||
        activeQueryModule === 'planSummary') && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <h4 className="text-base font-bold text-slate-900 capitalize">
            {activeQueryModule.replace(/([A-Z])/g, ' $1')} Report
          </h4>
          <p className="text-xs text-slate-500">Live consolidated summary for active schemes</p>
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            ✓ All active account ledgers synchronized for branch {agent.branch}. Click Search / Show to generate statement.
          </div>
        </div>
      )}
    </div>
  );
}
