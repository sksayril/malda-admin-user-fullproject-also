'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  UserCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  X,
  FileText,
  KeyRound,
  CreditCard,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { Customer } from '@/types';

interface CustomersViewProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onAddCustomer: (customer: Customer) => void;
  onToggleStatus: (id: string) => void;
}

export default function CustomersView({
  customers,
  onSelectCustomer,
  onAddCustomer,
  onToggleStatus,
}: CustomersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});
  const [selectedKycCustomer, setSelectedKycCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState<Partial<Customer>>({
    customerId: `CUS00${customers.length + 1}`,
    name: '',
    mobile: '',
    email: '',
    password: 'cust123',
    panNumber: '',
    adhaarNumber: '',
    address: 'Kolkata, West Bengal',
    pincode: '700001',
    dob: '15 Aug 1992',
    type: 'Loan',
    status: 'Active',
    kycStatus: 'Verified',
  });

  const togglePasswordReveal = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm) ||
      c.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) return;

    const cleanMob = formData.mobile.replace(/\D/g, '').slice(-10);
    const newCustomer: Customer = {
      id: String(Date.now()),
      customerId: formData.customerId || `CUS00${customers.length + 1}`,
      name: formData.name,
      mobile: cleanMob,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      password: formData.password || 'cust123',
      panNumber: formData.panNumber || 'ABCDE1234F',
      panImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
      adhaarNumber: formData.adhaarNumber || '2456 7890 1234',
      adhaarImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
      address: formData.address || 'West Bengal, India',
      pincode: formData.pincode || '700001',
      accountNumber: `MC360-${cleanMob}`,
      debitCardNumber: `5421 8812 ${cleanMob.slice(-4)} 2026`,
      debitCardExpiry: '09/31',
      debitCardCvv: '834',
      savingsBalance: 5000,
      dob: formData.dob || '01 Jan 1995',
      type: formData.type || 'Loan',
      status: 'Active',
      kycStatus: 'Verified',
      accountsCount: 1,
      loansCount: formData.type === 'Loan' ? 1 : 0,
      depositsCount: formData.type !== 'Loan' ? 1 : 0,
      collectionsCount: 0,
      documentsCount: 4,
    };

    onAddCustomer(newCustomer);
    setIsModalOpen(false);
    setFormData({
      customerId: `CUS00${customers.length + 2}`,
      name: '',
      mobile: '',
      email: '',
      password: 'cust123',
      panNumber: '',
      adhaarNumber: '',
      address: 'Kolkata, West Bengal',
      pincode: '700001',
      dob: '15 Aug 1992',
      type: 'Loan',
      status: 'Active',
      kycStatus: 'Verified',
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Add Customer Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            All Customers & KYC Registry
          </h1>
          <p className="text-xs text-slate-500">
            Member database, account numbers, KYC documents & administrator password visibility
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search & Counter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name, account, ID, or phone..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Showing {filtered.length} of {customers.length} Customers
        </span>
      </div>

      {/* Table with Account Number and Original Password Inspection */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Customer ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Account No</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Password (Admin View)</th>
                <th className="py-3.5 px-4 text-center">KYC Docs</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((customer) => {
                const isPasswordShown = revealedPasswords[customer.id];
                const custPassword = customer.password || 'cust123';

                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                    onClick={() => onSelectCustomer(customer)}
                  >
                    <td className="py-3.5 px-4 font-bold text-blue-600">{customer.customerId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                        {customer.name.charAt(0)}
                      </div>
                      <span>{customer.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {customer.accountNumber || `MC360-${customer.mobile}`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{customer.mobile}</td>

                    {/* Admin Original Password Viewer */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-900 font-bold text-[11px]">
                          {isPasswordShown ? custPassword : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordReveal(customer.id)}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
                          title={isPasswordShown ? 'Hide Password' : 'View Original Password'}
                        >
                          {isPasswordShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* KYC Documents Button */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedKycCustomer(customer)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Docs ({customer.documentsCount || 4})</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          customer.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {customer.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {customer.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectCustomer(customer)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1 transition cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => onToggleStatus(customer.id)}
                          className="px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        >
                          Toggle
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filtered.length} of {customers.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-bold">2</button>
          </div>
        </div>
      </div>

      {/* KYC Documents Admin Viewer Modal */}
      {selectedKycCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>KYC Documents: {selectedKycCustomer.name}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Customer ID: {selectedKycCustomer.customerId} • Account: {selectedKycCustomer.accountNumber || `MC360-${selectedKycCustomer.mobile}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedKycCustomer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* PAN Card View */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block">PAN Card Details</span>
                <p className="font-mono text-sm font-extrabold text-blue-700">
                  {selectedKycCustomer.panNumber || 'ABCDE1234F'}
                </p>
                <div className="h-40 rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <img
                    src={selectedKycCustomer.panImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'}
                    alt="PAN"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Aadhaar Card View */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block">Aadhaar Card Details</span>
                <p className="font-mono text-sm font-extrabold text-blue-700">
                  {selectedKycCustomer.adhaarNumber || '2456 7890 1234'}
                </p>
                <div className="h-40 rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <img
                    src={selectedKycCustomer.adhaarImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'}
                    alt="Aadhaar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Address & Credentials Info */}
            <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs space-y-1.5">
              <p>
                <strong>Residential Address:</strong> {selectedKycCustomer.address || 'Kolkata, West Bengal'}
              </p>
              <p>
                <strong>Pincode:</strong> {selectedKycCustomer.pincode || '700017'}
              </p>
              <p>
                <strong>Customer Password:</strong>{' '}
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {selectedKycCustomer.password || 'cust123'}
                </span>
              </p>
              <p>
                <strong>Agent / Referral Code:</strong>{' '}
                <span className="font-mono font-bold text-indigo-700">
                  {selectedKycCustomer.referralCode || 'AGT-3601'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Add New Customer / Member</span>
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
                <label className="block font-semibold text-slate-700 mb-1">Customer ID</label>
                <input
                  type="text"
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Md. Salim Ansari"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Password</label>
                  <input
                    type="text"
                    placeholder="cust123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PAN Card No</label>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 uppercase font-mono rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aadhaar Card No</label>
                  <input
                    type="text"
                    placeholder="2456 7890 1234"
                    value={formData.adhaarNumber}
                    onChange={(e) => setFormData({ ...formData, adhaarNumber: e.target.value })}
                    className="w-full px-3 py-2 font-mono rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Kolkata, West Bengal"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                />
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
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
