'use client';

import React, { useState } from 'react';
import { Plus, Search, Receipt, BarChart3, ArrowUpRight, X } from 'lucide-react';
import { CollectionRecord } from '@/types';
import { AdminViewId } from '../AdminSidebar';

interface CollectionsViewProps {
  collections: CollectionRecord[];
  onAddCollection: (record: CollectionRecord) => void;
  onNavigate: (view: AdminViewId) => void;
}

export default function CollectionsView({
  collections,
  onAddCollection,
  onNavigate,
}: CollectionsViewProps) {
  const [dateFilter, setDateFilter] = useState<'Today' | 'All'>('Today');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerId: '',
    agentName: '',
    type: 'EMI' as 'EMI' | 'RD' | 'Loan' | 'MIS' | 'FD',
    amount: 1000,
    mode: 'UPI' as 'UPI' | 'Cash' | 'Bank',
  });

  const filtered = collections.filter((c) => {
    return (
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: CollectionRecord = {
      id: String(Date.now()),
      receiptNo: `RC00${collections.length + 1}`,
      customerName: formData.customerName,
      customerId: formData.customerId,
      agentName: formData.agentName,
      type: formData.type,
      amount: Number(formData.amount),
      mode: formData.mode,
      date: '18 Sep 2026',
    };

    onAddCollection(newRecord);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Buttons (Matching Screen 11) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            All Collections
          </h1>
          <p className="text-xs text-slate-500">
            Field receipts, digital payments, EMI recovery, and reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Link to Agent Collection Report (Panel 12) */}
          <button
            onClick={() => onNavigate('agent-collection')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Agent Report</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Collection</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar (Matching Screen 11: Today dropdown + search) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search receipt number, customer..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="Today">Today (18 Sep 2026)</option>
            <option value="All">All Historical</option>
          </select>
          <span className="text-xs text-slate-400 font-medium hidden md:inline">
            Total: ₹ {filtered.reduce((acc, c) => acc + c.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Table (Matching Screen 11) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Receipt No</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4 text-center">Mode</th>
                <th className="py-3.5 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-blue-600">{item.receiptNo}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{item.customerName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₹ {item.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.mode === 'UPI'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : item.mode === 'Cash'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}
                    >
                      {item.mode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filtered.length} of {collections.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-bold">1</button>
          </div>
        </div>
      </div>

      {/* Add Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                <span>Collect Cash / UPI Payment</span>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Collection Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="EMI">EMI Payment</option>
                    <option value="RD">RD Installment</option>
                    <option value="Loan">Loan Recovery</option>
                    <option value="MIS">MIS Deposit</option>
                    <option value="FD">FD Deposit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cash">Cash at Doorstep</option>
                    <option value="Bank">Bank IMPS / NEFT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Collecting Agent</label>
                  <input
                    type="text"
                    required
                    value={formData.agentName}
                    onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
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
                  Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
