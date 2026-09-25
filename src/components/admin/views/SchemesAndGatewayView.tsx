'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  CreditCard,
  Percent,
  DollarSign,
  Tag,
  Key,
  ShieldCheck,
  Building2,
  Sparkles,
  AlertCircle,
  Lock,
  Save,
  RefreshCw,
  X,
} from 'lucide-react';
import { ProductScheme, GatewaySettings } from '@/types';
import { INITIAL_SCHEMES, INITIAL_GATEWAY_SETTINGS } from '@/data/mockData';

export default function SchemesAndGatewayView() {
  const [schemes, setSchemes] = useState<ProductScheme[]>(INITIAL_SCHEMES);
  const [gateway, setGateway] = useState<GatewaySettings>(INITIAL_GATEWAY_SETTINGS);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'LOAN' | 'FD' | 'RD' | 'MIS'>('ALL');
  const [activeTab, setActiveTab] = useState<'schemes' | 'razorpay'>('schemes');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState('');

  // Scheme Edit / Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Partial<ProductScheme> | null>(null);

  useEffect(() => {
    // Load live schemes and gateway settings
    fetch('/api/schemes')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setSchemes(res.data);
      })
      .catch((err) => console.warn('Schemes fetch err:', err));

    fetch('/api/settings/gateway')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setGateway(res.data);
      })
      .catch((err) => console.warn('Gateway fetch err:', err));
  }, []);

  const handleSaveGateway = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/settings/gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gateway),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess('✓ Razorpay Payment Gateway & Commission Settings updated successfully!');
        setTimeout(() => setSavedSuccess(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSchemeStatus = async (id: string, currentStatus: 'Active' | 'Inactive') => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setSchemes((prev) =>
      prev.map((s) => (s.id === id || s.code === id ? { ...s, status: newStatus } : s))
    );

    const targetScheme = schemes.find((s) => s.id === id || s.code === id);
    if (targetScheme) {
      fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...targetScheme, status: newStatus }),
      }).catch(console.error);
    }
  };

  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheme) return;

    try {
      const res = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingScheme),
      });
      const data = await res.json();
      if (data.success) {
        if (editingScheme.id) {
          setSchemes((prev) =>
            prev.map((s) => (s.id === editingScheme.id || s.code === editingScheme.code ? data.data : s))
          );
        } else {
          setSchemes((prev) => [data.data, ...prev]);
        }
        setIsModalOpen(false);
        setEditingScheme(null);
        setSavedSuccess('✓ Product Scheme offer saved and live for customers & agents!');
        setTimeout(() => setSavedSuccess(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSchemes =
    activeCategory === 'ALL' ? schemes : schemes.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Offers, Schemes & Razorpay Settings
          </h1>
          <p className="text-xs text-slate-500">
            Define Loan offers, FD, RD, MIS rates, set agent commission % and configure Razorpay payment gateway
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setEditingScheme({
                code: `SCH-${activeCategory === 'ALL' ? 'LN' : activeCategory}-0${schemes.length + 1}`,
                category: activeCategory === 'ALL' ? 'LOAN' : (activeCategory as any),
                name: '',
                interestRate: 8.5,
                minAmount: 5000,
                maxAmount: 500000,
                tenureMonths: 12,
                agentCommissionPercent: 2.0,
                status: 'Active',
                description: '',
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Scheme / Offer</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Main Switcher: Schemes Config vs Razorpay Gateway */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'schemes'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Loan & Investment Offers ({schemes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('razorpay')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'razorpay'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Razorpay Payment Gateway & Commissions</span>
        </button>
      </div>

      {/* Tab 1: Schemes List */}
      {activeTab === 'schemes' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['ALL', 'LOAN', 'FD', 'RD', 'MIS'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat === 'ALL'
                  ? 'All Schemes'
                  : cat === 'LOAN'
                  ? 'Loan Offers'
                  : cat === 'FD'
                  ? 'Fixed Deposits (FD)'
                  : cat === 'RD'
                  ? 'Recurring Deposits (RD)'
                  : 'Monthly Income (MIS)'}
              </button>
            ))}
          </div>

          {/* Schemes Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id || scheme.code}
                className={`bg-white p-5 rounded-3xl border transition shadow-2xs flex flex-col justify-between ${
                  scheme.status === 'Active' ? 'border-slate-200/90' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                      {scheme.code}
                    </span>
                    <button
                      onClick={() => handleToggleSchemeStatus(scheme.id || scheme.code, scheme.status)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                        scheme.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {scheme.status === 'Active' ? 'Active Offer' : 'Disabled'}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{scheme.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{scheme.description || 'Admin managed scheme'}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Interest Rate</span>
                      <span className="text-base font-extrabold text-blue-700">{scheme.interestRate}% p.a.</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Agent Commission</span>
                      <span className="text-base font-extrabold text-emerald-700">
                        {scheme.agentCommissionPercent}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Tenure</span>
                      <span className="font-bold text-slate-800">
                        {scheme.isDailyLoan ? '100 Days Daily' : `${scheme.tenureMonths} Months`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Amount Range</span>
                      <span className="font-bold text-slate-800">
                        ₹{(scheme.minAmount / 1000).toFixed(0)}k - ₹{(scheme.maxAmount / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Type: {scheme.category}
                  </span>
                  <button
                    onClick={() => {
                      setEditingScheme(scheme);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Rates</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Razorpay Payment Gateway Settings */}
      {activeTab === 'razorpay' && (
        <div className="max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-lg">
              ₹
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Razorpay Payment Gateway API Keys & Auto Collection
              </h3>
              <p className="text-xs text-slate-500">
                Configure your merchant keys. Online deposits, loan EMIs & daily installments will be collected automatically.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveGateway} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Razorpay Key ID *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={gateway.razorpayKeyId}
                    onChange={(e) => setGateway({ ...gateway, razorpayKeyId: e.target.value })}
                    placeholder="rzp_test_..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 bg-slate-50 focus:bg-white"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Razorpay Key Secret *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={gateway.razorpayKeySecret}
                    onChange={(e) => setGateway({ ...gateway, razorpayKeySecret: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 bg-slate-50 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Webhook Secret Key (Optional)</label>
              <input
                type="text"
                value={gateway.razorpayWebhookSecret}
                onChange={(e) => setGateway({ ...gateway, razorpayWebhookSecret: e.target.value })}
                placeholder="whsec_..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Gateway Environment</span>
                  <span className="text-[11px] text-slate-500">
                    {gateway.isLiveMode ? 'Live Production Mode' : 'Test / Sandbox Mode'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gateway.isLiveMode}
                    onChange={(e) => setGateway({ ...gateway, isLiveMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Agent Onboarding Bonus</span>
                  <span className="text-[11px] text-slate-500">Per Customer Registered</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-slate-900">
                  <span>₹</span>
                  <input
                    type="number"
                    value={gateway.onboardingCommission}
                    onChange={(e) => setGateway({ ...gateway, onboardingCommission: Number(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 rounded-lg border border-slate-200 bg-white font-extrabold text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100 text-blue-900 text-[11px] leading-relaxed">
              💡 <strong>Automated Collection & Commission Engine:</strong> When customers make payments through Razorpay, receipts are automatically generated in collections and the linked agent receives their commission instantly in their wallet based on the scheme rates.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Keys...' : 'Save Razorpay Credentials & Rules'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Edit Scheme Modal */}
      {isModalOpen && editingScheme && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-base font-bold text-slate-900">
                {editingScheme.id ? 'Edit Scheme / Offer Rates' : 'Create New Scheme / Offer'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingScheme(null);
                }}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScheme} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={editingScheme.category}
                    onChange={(e) => setEditingScheme({ ...editingScheme, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="LOAN">Loan Product</option>
                    <option value="FD">Fixed Deposit (FD)</option>
                    <option value="RD">Recurring Deposit (RD)</option>
                    <option value="MIS">Monthly Income Scheme (MIS)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scheme Code *</label>
                  <input
                    type="text"
                    required
                    value={editingScheme.code}
                    onChange={(e) => setEditingScheme({ ...editingScheme, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scheme Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1-Year Super Saver FD"
                  value={editingScheme.name}
                  onChange={(e) => setEditingScheme({ ...editingScheme, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Interest Rate (% p.a.) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingScheme.interestRate}
                    onChange={(e) => setEditingScheme({ ...editingScheme, interestRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-blue-700 font-extrabold text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Agent Commission (% share) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingScheme.agentCommissionPercent}
                    onChange={(e) => setEditingScheme({ ...editingScheme, agentCommissionPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-emerald-700 font-extrabold text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Amount (₹)</label>
                  <input
                    type="number"
                    value={editingScheme.minAmount}
                    onChange={(e) => setEditingScheme({ ...editingScheme, minAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Amount (₹)</label>
                  <input
                    type="number"
                    value={editingScheme.maxAmount}
                    onChange={(e) => setEditingScheme({ ...editingScheme, maxAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tenure (Months)</label>
                  <input
                    type="number"
                    value={editingScheme.tenureMonths}
                    onChange={(e) => setEditingScheme({ ...editingScheme, tenureMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingScheme.status}
                    onChange={(e) => setEditingScheme({ ...editingScheme, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Active">Active (Visible to Customers)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Summary</label>
                <textarea
                  rows={2}
                  value={editingScheme.description}
                  onChange={(e) => setEditingScheme({ ...editingScheme, description: e.target.value })}
                  placeholder="Details shown to customer when viewing this offer..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingScheme(null);
                  }}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20"
                >
                  Save & Publish Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
