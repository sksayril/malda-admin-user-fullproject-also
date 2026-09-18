'use client';

import React, { useState } from 'react';
import { Plus, Search, Globe, CheckCircle2, XCircle, X } from 'lucide-react';
import { WhiteLabelPartner } from '@/types';

interface WhiteLabelViewProps {
  partners: WhiteLabelPartner[];
  onAddPartner: (partner: WhiteLabelPartner) => void;
  onToggleStatus: (id: string) => void;
}

export default function WhiteLabelView({
  partners,
  onAddPartner,
  onToggleStatus,
}: WhiteLabelViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    partnerId: `WL00${partners.length + 1}`,
    companyName: '',
    domain: '',
    plan: 'Professional' as 'Basic' | 'Professional' | 'Enterprise',
  });

  const filtered = partners.filter(
    (p) =>
      p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partnerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.domain) return;

    onAddPartner({
      id: String(Date.now()),
      partnerId: formData.partnerId,
      companyName: formData.companyName,
      domain: formData.domain,
      status: 'Active',
      plan: formData.plan,
      branchesCount: 4,
    });

    setIsModalOpen(false);
    setFormData({
      partnerId: `WL00${partners.length + 2}`,
      companyName: '',
      domain: '',
      plan: 'Professional',
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Add Partner Button (Matching Screen 15) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            All Partners
          </h1>
          <p className="text-xs text-slate-500">
            Multi-tenant cooperative white-label branding, custom domains and SaaS subscriptions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Partner</span>
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
            placeholder="Search partner, domain..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          {partners.length} White Label Deployments
        </span>
      </div>

      {/* Table (Matching Screen 15) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Partner ID</th>
                <th className="py-3.5 px-4">Company Name</th>
                <th className="py-3.5 px-4">Domain</th>
                <th className="py-3.5 px-4 text-center">Plan</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-blue-600">{partner.partnerId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{partner.companyName}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {partner.domain}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {partner.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        partner.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}
                    >
                      {partner.status === 'Active' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {partner.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onToggleStatus(partner.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Onboard White Label Tenant</span>
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
                <label className="block font-semibold text-slate-700 mb-1">Company / Society Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Mutual Credit"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Custom Domain / Subdomain</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. apexcredit.in"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SaaS Subscription Plan</label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Basic">Basic (1 Branch, 5 Agents)</option>
                  <option value="Professional">Professional (5 Branches, 50 Agents)</option>
                  <option value="Enterprise">Enterprise (Unlimited Branches & Agents)</option>
                </select>
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
                  Deploy Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
