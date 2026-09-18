'use client';

import React, { useState } from 'react';
import {
  Building2,
  Save,
  Upload,
  CheckCircle2,
  FileText,
  ShieldCheck,
  CreditCard,
  Percent,
} from 'lucide-react';
import { SocietyInfo } from '@/types';

interface SocietyViewProps {
  society: SocietyInfo;
  onUpdate: (updated: SocietyInfo) => void;
}

export default function SocietyView({ society, onUpdate }: SocietyViewProps) {
  const [formData, setFormData] = useState<SocietyInfo>(society);
  const [savedMessage, setSavedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'bank' | 'terms' | 'privacy' | 'loan' | 'deposit'>('bank');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Save Button Bar (Matching Screen 3) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Society Details
          </h1>
          <p className="text-xs text-slate-500">
            Configure apex cooperative society parameters, legal compliance & policies
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Society profile and policy parameters saved successfully!</span>
        </div>
      )}

      {/* 2-Column Layout (Matching Screen 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Society Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Society Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={formData.regNumber}
                  onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PAN Number
                </label>
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Address
              </label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Logo Card & Policies (Matching Screen 3) */}
        <div className="space-y-4">
          {/* Logo Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
            <label className="block text-xs font-semibold text-slate-700 mb-3">
              Society Official Logo
            </label>
            <div className="w-24 h-24 mx-auto rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 flex flex-col items-center justify-center p-3 mb-3 relative overflow-hidden">
              {formData.logo && formData.logo.startsWith('http') ? (
                <img src={formData.logo} alt="Society Logo" className="w-full h-full object-contain" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    MC
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold mt-1">MultiCredit</span>
                </>
              )}
            </div>
            <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Upload to AWS S3</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const data = new FormData();
                  data.append('file', file);
                  data.append('entityType', 'society_logo');
                  data.append('entityId', 'MSCS_2024_101');
                  try {
                    const res = await fetch('/api/s3/upload', {
                      method: 'POST',
                      body: data,
                    });
                    const result = await res.json();
                    if (result.success) {
                      setFormData({ ...formData, logo: result.data.url });
                      alert(`Logo successfully uploaded to Amazon S3: ${result.data.fileKey}`);
                    } else {
                      alert(`S3 Upload failed: ${result.message}`);
                    }
                  } catch (err: any) {
                    alert(`Upload error: ${err.message}`);
                  }
                }}
              />
            </label>
          </div>

          {/* Quick Config Tabs (Bank, Terms, Privacy, Loan Policy, Deposit Config) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('bank')}
              className={`w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                activeTab === 'bank' ? 'bg-blue-50/70 text-blue-700 font-bold' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <span>Bank Details</span>
              </div>
              <span className="text-[11px] text-slate-400">SBI 3456...</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className={`w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                activeTab === 'terms' ? 'bg-blue-50/70 text-blue-700 font-bold' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Terms & Conditions</span>
              </div>
              <span className="text-[11px] text-slate-400">Configured</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                activeTab === 'privacy' ? 'bg-blue-50/70 text-blue-700 font-bold' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Privacy Policy</span>
              </div>
              <span className="text-[11px] text-slate-400">GDPR/RBI</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('loan')}
              className={`w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                activeTab === 'loan' ? 'bg-blue-50/70 text-blue-700 font-bold' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Percent className="w-4 h-4 text-amber-500" />
                <span>Loan Policy</span>
              </div>
              <span className="text-[11px] text-slate-400">10%-16%</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('deposit')}
              className={`w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                activeTab === 'deposit' ? 'bg-blue-50/70 text-blue-700 font-bold' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-purple-500" />
                <span>Deposit Configuration</span>
              </div>
              <span className="text-[11px] text-slate-400">FD/RD/MIS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
