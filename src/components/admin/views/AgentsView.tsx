'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  X,
  MapPin,
  Eye,
  EyeOff,
  Wallet,
  Tag,
  KeyRound,
} from 'lucide-react';
import { Agent } from '@/types';

interface AgentsViewProps {
  agents: Agent[];
  onAddAgent: (agent: Agent) => void;
  onToggleStatus: (id: string) => void;
  onViewLocation: (agentId: string) => void;
}

export default function AgentsView({
  agents,
  onAddAgent,
  onToggleStatus,
  onViewLocation,
}: AgentsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});

  const [formData, setFormData] = useState<Partial<Agent>>({
    agentId: `AGT00${agents.length + 1}`,
    name: '',
    mobile: '',
    email: '',
    password: 'agent123',
    branch: 'Kolkata HQ',
    status: 'Active',
  });

  const togglePasswordReveal = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.referralCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.mobile.includes(searchTerm)
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) return;

    const cleanMob = formData.mobile.replace(/\D/g, '').slice(-10);
    onAddAgent({
      id: String(Date.now()),
      agentId: formData.agentId || `AGT00${agents.length + 1}`,
      name: formData.name,
      mobile: cleanMob,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}.agent@multicredit.com`,
      password: formData.password || 'agent123',
      branch: formData.branch || 'Kolkata HQ',
      status: 'Active',
      referralCode: `AGT-${cleanMob.slice(-4) || '3601'}`,
      sponsorReferralCode: formData.sponsorReferralCode || '',
      sponsorAgentId: formData.sponsorAgentId || '',
      directAgentsCount: 0,
      totalTeamCount: 0,
      walletBalance: 2500,
      totalCommission: 2500,
      totalDirectCustomers: 0,
      online: true,
      lastActive: 'Just now',
      totalCollection: '₹ 0',
      transactions: 0,
      target: '₹ 1,00,000',
      achievementRate: 0,
    });

    setIsModalOpen(false);
    setFormData({
      agentId: `AGT00${agents.length + 2}`,
      name: '',
      mobile: '',
      email: '',
      password: 'agent123',
      branch: 'Kolkata HQ',
      status: 'Active',
      sponsorReferralCode: '',
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Add Agent Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            All Agents & Advisors
          </h1>
          <p className="text-xs text-slate-500">
            Field collectors, referral codes, wallet balances, commissions and admin password audit
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Agent</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by agent name, ID, referral code, or mobile..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Total {agents.length} Registered Agents
        </span>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Agent ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Referral Code</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Password (Admin View)</th>
                <th className="py-3.5 px-4">Wallet Bal</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((agent) => {
                const isPasswordShown = revealedPasswords[agent.id];
                const agentPassword = agent.password || 'agent123';
                const refCode = agent.referralCode || `AGT-${agent.mobile.slice(-4)}`;
                const wallet = Number(agent.walletBalance) || 18450;

                return (
                  <tr key={agent.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-indigo-600">{agent.agentId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <span className="block leading-tight">{agent.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{agent.branch}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700 bg-indigo-50/30">
                      {refCode}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">{agent.mobile}</td>

                    {/* Admin Original Password Viewer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-900 font-bold text-[11px]">
                          {isPasswordShown ? agentPassword : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordReveal(agent.id)}
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
                          title={isPasswordShown ? 'Hide Password' : 'View Original Password'}
                        >
                          {isPasswordShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                      ₹ {wallet.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          agent.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {agent.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {agent.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewLocation(agent.agentId)}
                          className="px-2 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1 transition cursor-pointer"
                          title="View Live Location"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Map</span>
                        </button>
                        <button
                          onClick={() => onToggleStatus(agent.id)}
                          className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
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
          <span>Showing 1 to {filtered.length} of {agents.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded-md bg-indigo-600 text-white font-bold">1</button>
          </div>
        </div>
      </div>

      {/* Add Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Register New Agent</span>
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
                <label className="block font-semibold text-slate-700 mb-1">Agent ID</label>
                <input
                  type="text"
                  required
                  value={formData.agentId}
                  onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Agent Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salim Ansari"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Agent Password</label>
                  <input
                    type="text"
                    placeholder="agent123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sponsor Referral Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. AGT-3601 (Upline Sponsor)"
                  value={formData.sponsorReferralCode || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, sponsorReferralCode: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50/50 uppercase font-mono text-xs font-bold text-indigo-900"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Connects this agent to upline's 14-level unilevel tree.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Branch</label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Kolkata HQ">Main Branch (Kolkata HQ)</option>
                  <option value="Bardhaman">Bardhaman Branch</option>
                  <option value="Durgapur">Durgapur Branch</option>
                  <option value="Asansol">Asansol Branch</option>
                  <option value="Siliguri">Siliguri Branch</option>
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm"
                >
                  Save Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
