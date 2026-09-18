'use client';

import React, { useState } from 'react';
import { Plus, Search, PiggyBank, Clock, TrendingUp, CheckCircle2, X } from 'lucide-react';
import { DepositAccount } from '@/types';
import { calculateFdMaturity, calculateRdMaturity } from '@/lib/financials';

interface DepositsViewProps {
  deposits: DepositAccount[];
  onAddDeposit: (deposit: DepositAccount) => void;
}

export default function DepositsView({ deposits, onAddDeposit }: DepositsViewProps) {
  const [activeTab, setActiveTab] = useState<'FD' | 'RD' | 'MIS'>('FD');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New deposit form
  const [formData, setFormData] = useState({
    customerName: 'Suresh Mahto',
    type: 'FD' as 'FD' | 'RD' | 'MIS',
    amount: 50000,
    tenureYears: 2,
  });

  const filtered = deposits.filter((d) => {
    const matchesTab = d.type === activeTab;
    const matchesSearch =
      d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.accountId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAcc: DepositAccount = {
      id: String(Date.now()),
      accountId: `${formData.type}00${deposits.length + 1}`,
      customerName: formData.customerName,
      type: formData.type,
      amount: Number(formData.amount),
      startDate: '18 Sep 2026',
      maturityDate: '18 Sep 2028',
      status: 'Active',
    };

    onAddDeposit(newAcc);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header & Add Deposit Button (Matching Screen 10) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            All Deposits
          </h1>
          <p className="text-xs text-slate-500">
            Fixed Deposits (FD), Recurring Deposits (RD), and Monthly Income Schemes (MIS)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Deposit</span>
        </button>
      </div>

      {/* Tabs (FD, RD, MIS - Matching Screen 10) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('FD')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'FD'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          <span>FD</span>
        </button>

        <button
          onClick={() => setActiveTab('RD')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'RD'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>RD</span>
        </button>

        <button
          onClick={() => setActiveTab('MIS')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'MIS'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>MIS</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search in ${activeTab} accounts...`}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Showing {filtered.length} {activeTab} accounts
        </span>
      </div>

      {/* Table (Matching Screen 10) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Account ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Start Date</th>
                <th className="py-3.5 px-4">Maturity</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((dep) => (
                <tr key={dep.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-blue-600">{dep.accountId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{dep.customerName}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₹ {dep.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{dep.startDate}</td>
                  <td className="py-3.5 px-4 text-slate-500">{dep.maturityDate}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        dep.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {dep.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filtered.length} of {filtered.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-bold">1</button>
          </div>
        </div>
      </div>

      {/* Add Deposit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-blue-600" />
                <span>Open New Deposit Account</span>
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
                <label className="block font-semibold text-slate-700 mb-1">Deposit Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="FD">Fixed Deposit (FD) - 8.5% p.a.</option>
                  <option value="RD">Recurring Deposit (RD) - 7.5% p.a.</option>
                  <option value="MIS">Monthly Income Scheme (MIS) - 9.0% p.a.</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {formData.type === 'RD' ? 'Monthly Installment (₹)' : 'Principal Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tenure (Years)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={10}
                    value={formData.tenureYears}
                    onChange={(e) => setFormData({ ...formData, tenureYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-purple-700">Projected Maturity Return:</span>
                <span className="font-bold text-purple-900 text-sm">
                  {formData.type === 'FD'
                    ? `₹ ${calculateFdMaturity(formData.amount, 8.5, formData.tenureYears).maturityAmount.toLocaleString()}`
                    : `₹ ${calculateRdMaturity(formData.amount, 7.5, formData.tenureYears * 12).maturityAmount.toLocaleString()}`}
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
                  Open Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
