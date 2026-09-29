'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  CheckCircle2,
  Clock,
  Award,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Settings,
  Users,
  Save,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Plus,
  AlertCircle,
  FileText,
  UserCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { MlmLevelConfig, MlmCommissionLog, Agent } from '@/types';
import { DEFAULT_MLM_LEVEL_CONFIGS } from '@/data/mockData';

export default function MlmCommissionView() {
  const [activeTab, setActiveTab] = useState<'Settings' | 'LevelWise' | 'AgentWise' | 'Ledger'>('Settings');
  const [levels, setLevels] = useState<MlmLevelConfig[]>(DEFAULT_MLM_LEVEL_CONFIGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Agents & Tree state
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [agentTreeData, setAgentTreeData] = useState<any>(null);
  const [treeLoading, setTreeLoading] = useState(false);

  // Commission Logs state
  const [commissionLogs, setCommissionLogs] = useState<MlmCommissionLog[]>([]);
  const [logFilterAgent, setLogFilterAgent] = useState('');
  const [logFilterLevel, setLogFilterLevel] = useState('');

  // Summary KPI
  const [summary, setSummary] = useState({
    totalLevels: 14,
    totalSystemCommission: 500000,
    totalPendingCommission: 50000,
    totalAgents: 0,
  });

  // Fetch MLM settings & stats
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/mlm/settings');
      const data = await res.json();
      if (data.success && data.data?.levels?.length > 0) {
        setLevels(data.data.levels);
        if (data.data.summary) {
          setSummary(data.data.summary);
        }
      }
    } catch (e) {
      console.warn('Error fetching MLM settings:', e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Agents list
  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAgents(data.data);
        if (data.data.length > 0 && !selectedAgentId) {
          setSelectedAgentId(data.data[0].agentId);
        }
      }
    } catch (e) {
      console.warn('Error fetching agents:', e);
    }
  };

  // Fetch Commission Logs
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/mlm/commissions');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCommissionLogs(data.data);
      }
    } catch (e) {
      console.warn('Error fetching logs:', e);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchAgents();
    fetchLogs();
  }, []);

  // Fetch specific agent tree when agent selected
  useEffect(() => {
    if (!selectedAgentId) return;
    setTreeLoading(true);
    fetch(`/api/mlm/tree?agentId=${selectedAgentId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setAgentTreeData(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setTreeLoading(false));
  }, [selectedAgentId]);

  // Handle Level Config Field Changes
  const handleLevelChange = (
    levelNum: number,
    field: keyof MlmLevelConfig,
    value: any
  ) => {
    setLevels((prev) =>
      prev.map((lvl) => (lvl.level === levelNum ? { ...lvl, [field]: value } : lvl))
    );
  };

  // Save Level Configurations to Backend
  const handleSaveLevels = async () => {
    try {
      setSaving(true);
      setSaveMessage('');

      const res = await fetch('/api/mlm/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ levels }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveMessage('✓ All 14 MLM Level criteria & commission rates saved successfully!');
        if (data.data) {
          setLevels(data.data);
        }
        setTimeout(() => setSaveMessage(''), 4000);
      } else {
        alert(data.message || 'Error saving settings');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving MLM settings');
    } finally {
      setSaving(false);
    }
  };

  const filteredLogs = commissionLogs.filter((log) => {
    const matchAgent =
      !logFilterAgent ||
      log.toAgentId.toLowerCase().includes(logFilterAgent.toLowerCase()) ||
      log.toAgentName.toLowerCase().includes(logFilterAgent.toLowerCase()) ||
      log.fromAgentName.toLowerCase().includes(logFilterAgent.toLowerCase());
    const matchLevel = !logFilterLevel || String(log.level) === logFilterLevel;
    return matchAgent && matchLevel;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            <span>Unilevel MLM Commission & Criteria Management</span>
          </h1>
          <p className="text-xs text-slate-500">
            Set 14-Level cooperative referral criteria, commission percentages, fixed bonuses, and inspect agent downline trees.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-indigo-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>14-Tier Dynamic Engine Active</span>
          </span>
          <button
            onClick={() => {
              fetchSettings();
              fetchLogs();
              fetchAgents();
            }}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Total MLM Payouts</span>
          <div className="text-2xl font-bold text-indigo-600">
            ₹ {(summary.totalSystemCommission || 500000).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400">Total Accrued Team Commissions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Configured Levels</span>
          <div className="text-2xl font-bold text-slate-900">{levels.length} Levels</div>
          <span className="text-[11px] text-indigo-600 font-medium">L1 to L14 Active Rules</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Registered Agents</span>
          <div className="text-2xl font-bold text-blue-600">{agents.length} Advisors</div>
          <span className="text-[11px] text-blue-600 font-medium">In Referral Network</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Pending / Hold Payouts</span>
          <div className="text-2xl font-bold text-amber-600">
            ₹ {(summary.totalPendingCommission || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Awaiting Criteria Unlock</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('Settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'Settings'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Level Criteria & Commission Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('LevelWise')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'LevelWise'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Level-Wise Summary (L1 - L14)</span>
        </button>

        <button
          onClick={() => setActiveTab('AgentWise')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'AgentWise'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Agent Downline & Tree Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('Ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'Ledger'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Commission Transactions Ledger ({commissionLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Settings & Criteria Configuration */}
      {activeTab === 'Settings' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-600" />
                <span>Configure 14 MLM Hierarchy Levels & Qualification Criteria</span>
              </h3>
              <p className="text-xs text-slate-500">
                Admin sets commission %, flat joining bonus (₹), minimum direct referrals required, and minimum team volume.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveLevels}
              disabled={saving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Settings...' : 'Save All Level Criteria'}</span>
            </button>
          </div>

          {saveMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{saveMessage}</span>
            </div>
          )}

          {/* Level Configuration Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 w-20">Level</th>
                    <th className="py-3.5 px-4 min-w-[200px]">Level Title / Rank Name</th>
                    <th className="py-3.5 px-4 w-36">Commission Share (%)</th>
                    <th className="py-3.5 px-4 w-36">Direct Joining Bonus (₹)</th>
                    <th className="py-3.5 px-4 w-44">Min Direct Referrals</th>
                    <th className="py-3.5 px-4 w-44">Min Business Vol (₹)</th>
                    <th className="py-3.5 px-4 text-center w-28">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {levels.map((lvl) => (
                    <tr key={lvl.level} className="hover:bg-indigo-50/30 transition">
                      {/* Level Badge */}
                      <td className="py-3.5 px-4">
                        <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center text-xs border border-indigo-100">
                          L{lvl.level}
                        </span>
                      </td>

                      {/* Level Name */}
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          value={lvl.name}
                          onChange={(e) => handleLevelChange(lvl.level, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </td>

                      {/* Commission % */}
                      <td className="py-3.5 px-4">
                        <div className="relative">
                          <input
                            type="number"
                            step="0.05"
                            min="0"
                            max="100"
                            value={lvl.commissionPercent}
                            onChange={(e) =>
                              handleLevelChange(lvl.level, 'commissionPercent', Number(e.target.value) || 0)
                            }
                            className="w-full pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 font-mono font-bold text-indigo-700 text-xs focus:bg-white"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                            %
                          </span>
                        </div>
                      </td>

                      {/* Fixed Bonus ₹ */}
                      <td className="py-3.5 px-4">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                            ₹
                          </span>
                          <input
                            type="number"
                            step="10"
                            min="0"
                            value={lvl.fixedBonus || 0}
                            onChange={(e) =>
                              handleLevelChange(lvl.level, 'fixedBonus', Number(e.target.value) || 0)
                            }
                            className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-slate-200 font-mono font-bold text-emerald-700 text-xs focus:bg-white"
                          />
                        </div>
                      </td>

                      {/* Min Direct Referrals Criteria */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={lvl.minDirectReferrals || 0}
                            onChange={(e) =>
                              handleLevelChange(lvl.level, 'minDirectReferrals', Number(e.target.value) || 0)
                            }
                            className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono font-bold text-slate-900 text-xs focus:bg-white text-center"
                          />
                          <span className="text-[10px] text-slate-400 font-medium">Directs</span>
                        </div>
                      </td>

                      {/* Min Business Volume Criteria */}
                      <td className="py-3.5 px-4">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                            ₹
                          </span>
                          <input
                            type="number"
                            step="5000"
                            min="0"
                            value={lvl.minBusinessVolume || 0}
                            onChange={(e) =>
                              handleLevelChange(lvl.level, 'minBusinessVolume', Number(e.target.value) || 0)
                            }
                            className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-slate-200 font-mono font-bold text-slate-900 text-xs focus:bg-white"
                          />
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleLevelChange(
                              lvl.level,
                              'status',
                              lvl.status === 'Active' ? 'Inactive' : 'Active'
                            )
                          }
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition cursor-pointer ${
                            lvl.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {lvl.status || 'Active'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Criteria are automatically validated in real time before crediting upline wallet balances.</span>
              </span>
              <button
                type="button"
                onClick={handleSaveLevels}
                disabled={saving}
                className="font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer self-end sm:self-auto"
              >
                Save Changes Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Level-Wise Summary */}
      {activeTab === 'LevelWise' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">14-Level Network Performance Breakdown</h3>
            <p className="text-xs text-slate-500">
              Live member counts and cumulative commission distributions across all hierarchical tiers
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Rank Designation</th>
                  <th className="py-3.5 px-4 text-center">Network Members</th>
                  <th className="py-3.5 px-4">Commission %</th>
                  <th className="py-3.5 px-4">Fixed Bonus</th>
                  <th className="py-3.5 px-4">Total Commission</th>
                  <th className="py-3.5 px-4">Unlock Criteria</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {levels.map((lvl) => (
                  <tr key={lvl.level} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-indigo-900">
                      Level {lvl.level}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{lvl.name}</td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-blue-600">
                      {lvl.membersCount || 0} Advisors
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      {lvl.commissionPercent}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">
                      ₹ {lvl.fixedBonus || 0}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹ {(lvl.totalCommissionPaid || (lvl as any).totalCommission || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-500">
                      {lvl.minDirectReferrals > 0 ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                          ≥ {lvl.minDirectReferrals} Directs {lvl.minBusinessVolume > 0 && `& ₹${lvl.minBusinessVolume}`}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">Direct Open</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Agent Downline & Tree Inspector */}
      {activeTab === 'AgentWise' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Agent Downline Tree Inspector</h3>
              <p className="text-xs text-slate-500">
                Select any field agent to inspect their sponsor chain, direct referrals, and 14-level downlines
              </p>
            </div>

            <div className="w-full sm:w-72">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Agent to Inspect:</label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
              >
                {agents.map((agt) => (
                  <option key={agt.agentId} value={agt.agentId}>
                    {agt.name} ({agt.agentId}) - {agt.referralCode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {treeLoading ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold">Loading agent downline tree...</span>
            </div>
          ) : agentTreeData ? (
            <div className="space-y-4">
              {/* Selected Agent Quick Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-extrabold text-lg text-white border border-white/20">
                      {agentTreeData.agent?.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{agentTreeData.agent?.name}</h4>
                      <span className="text-xs font-mono text-indigo-200">
                        {agentTreeData.agent?.agentId} • Referral Code: <strong className="text-amber-300">{agentTreeData.agent?.referralCode}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                      <span className="text-indigo-200 block text-[10px]">Direct Agents</span>
                      <strong className="text-base text-white">{agentTreeData.agent?.directAgentsCount || 0} Agents</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                      <span className="text-indigo-200 block text-[10px]">Total Downlines</span>
                      <strong className="text-base text-white">{agentTreeData.totalDownlineMembers || 0} Members</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                      <span className="text-indigo-200 block text-[10px]">Wallet Balance</span>
                      <strong className="text-base text-emerald-300">₹ {(agentTreeData.agent?.walletBalance || 0).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Levels Downline Breakdown */}
              <div className="space-y-3">
                {agentTreeData.levelBreakdown?.map((lvl: any) => (
                  <div
                    key={lvl.level}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center">
                          L{lvl.level}
                        </span>
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs">{lvl.name}</h5>
                          <span className="text-[10px] text-slate-400">
                            Commission: {lvl.commissionPercent}% • Fixed Bonus: ₹{lvl.fixedBonus}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            lvl.isUnlocked
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {lvl.isUnlocked ? '✓ Criteria Unlocked' : `Requires ${lvl.minDirectReferrals} Directs`}
                        </span>
                        <span className="px-3 py-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
                          {lvl.membersCount} Member{lvl.membersCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Members List */}
                    {lvl.members?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                        {lvl.members.map((m: any) => (
                          <div
                            key={m.agentId}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold text-slate-900 block">{m.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {m.agentId} • {m.mobile}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                              {m.branch}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic pt-1">No agents joined at Level {lvl.level} yet.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 text-xs">
              Select an agent from the dropdown to view downline tree.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Commission Transactions Ledger */}
      {activeTab === 'Ledger' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={logFilterAgent}
                onChange={(e) => setLogFilterAgent(e.target.value)}
                placeholder="Search agent name or ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logFilterLevel}
                onChange={(e) => setLogFilterLevel(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="">All Levels (L1 - L14)</option>
                {Array.from({ length: 14 }).map((_, idx) => (
                  <option key={idx + 1} value={String(idx + 1)}>
                    Level {idx + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Tx ID & Date</th>
                    <th className="py-3.5 px-4">From Agent</th>
                    <th className="py-3.5 px-4">Beneficiary (To Agent)</th>
                    <th className="py-3.5 px-4 text-center">Level</th>
                    <th className="py-3.5 px-4">Event Type</th>
                    <th className="py-3.5 px-4 text-right">Commission Earned</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No commission transactions recorded yet. They will appear here automatically when agents join, onboard customers, or make collections.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.transactionId || log.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{log.transactionId}</span>
                          <span className="text-[10px] text-slate-400">{log.date}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {log.fromAgentName} ({log.fromAgentId})
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-indigo-700 block">{log.toAgentName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.toAgentId}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-[11px] border border-indigo-100">
                            Level {log.level}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {log.eventType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700 text-sm">
                          + ₹ {log.commissionAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              log.status === 'Credited'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
