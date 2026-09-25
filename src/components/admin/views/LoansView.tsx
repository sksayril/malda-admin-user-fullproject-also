'use client';

import React, { useState } from 'react';
import { Plus, Search, CreditCard, CheckCircle2, Clock, XCircle, ArrowRight, X } from 'lucide-react';
import { LoanApplication, LoanStatus } from '@/types';
import { calculateEmi } from '@/lib/financials';

interface LoansViewProps {
  loans: LoanApplication[];
  onSelectLoan: (loan: LoanApplication) => void;
  onAddLoan: (loan: LoanApplication) => void;
}

export default function LoansView({ loans, onSelectLoan, onAddLoan }: LoansViewProps) {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New loan form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerId: '',
    loanType: 'Personal Loan' as const,
    amount: 50000,
    tenureMonths: 24,
    interestRate: 12,
  });

  const tabs = ['All', 'Pending', 'Approved', 'Disbursed', 'Rejected'];

  const filtered = loans.filter((loan) => {
    const matchesTab = activeTab === 'All' || loan.status === activeTab;
    const matchesSearch =
      loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.loanType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const { monthlyEmi } = calculateEmi(formData.amount, formData.interestRate, formData.tenureMonths);

    const newLoan: LoanApplication = {
      id: String(Date.now()),
      loanId: `LN00${loans.length + 1}`,
      customerName: formData.customerName,
      customerId: formData.customerId,
      loanType: formData.loanType,
      amount: Number(formData.amount),
      tenureMonths: Number(formData.tenureMonths),
      interestRate: Number(formData.interestRate),
      monthlyEmi,
      appliedDate: '18 Sep 2026',
      status: 'Pending',
      step: 'Verification',
    };

    onAddLoan(newLoan);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Disbursed':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-600 border-rose-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header & New Loan Button (Matching Screen 8) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            All Loan Applications
          </h1>
          <p className="text-xs text-slate-500">
            Origination, underwriting, sanctions, EMI schedules and recovery
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Loan Application</span>
        </button>
      </div>

      {/* Tabs Bar (Matching Screen 8) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by loan ID, customer name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Showing {filtered.length} loans
        </span>
      </div>

      {/* Table (Matching Screen 8) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Loan ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((loan) => (
                <tr
                  key={loan.id}
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                  onClick={() => onSelectLoan(loan)}
                >
                  <td className="py-3.5 px-4 font-bold text-blue-600">{loan.loanId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{loan.customerName}</div>
                    <span className="text-[10px] text-slate-400 font-normal">{loan.loanType}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₹ {loan.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                        loan.status
                      )}`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{loan.appliedDate}</td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectLoan(loan)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1 transition cursor-pointer ml-auto"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filtered.length} of {loans.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-bold">2</button>
          </div>
        </div>
      </div>

      {/* New Loan Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>New Loan Application</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loan Type</label>
                <select
                  value={formData.loanType}
                  onChange={(e) => setFormData({ ...formData, loanType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Emergency Loan">Emergency Loan</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Small Loan">Small Loan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loan Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tenure (Months)</label>
                  <input
                    type="number"
                    required
                    min={3}
                    max={60}
                    value={formData.tenureMonths}
                    onChange={(e) => setFormData({ ...formData, tenureMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  required
                  step="0.5"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Real-time EMI Preview */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Calculated Monthly EMI:</span>
                <span className="font-bold text-blue-700 text-sm">
                  ₹ {calculateEmi(formData.amount, formData.interestRate, formData.tenureMonths).monthlyEmi.toLocaleString()}
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
