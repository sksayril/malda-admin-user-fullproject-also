'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Wallet,
  Tag,
  Copy,
  Check,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Share2,
  QrCode,
  ShieldCheck,
  CreditCard,
  LogOut,
  Building2,
  TrendingUp,
  Award,
  Search,
  UserCheck,
  Eye,
  FileText,
  X,
  Sparkles,
  MapPin,
  Calendar,
  PiggyBank,
  RefreshCw,
  Layers,
  GitFork,
  HelpCircle,
} from 'lucide-react';
import { Agent, Customer, CollectionRecord } from '@/types';
import AgentSavingsView from '@/components/agent/views/AgentSavingsView';
import AgentRenewalView from '@/components/agent/views/AgentRenewalView';
import AgentQueryReportsView from '@/components/agent/views/AgentQueryReportsView';
import AgentOrcView from '@/components/agent/views/AgentOrcView';
import AgentProfileChainView from '@/components/agent/views/AgentProfileChainView';

export default function AgentDashboardPage() {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [downlineTree, setDownlineTree] = useState<any>(null);
  const [mlmLogs, setMlmLogs] = useState<any[]>([]);

  // 5 Main Core Functional Modules from Video Analysis
  const [mainModule, setMainModule] = useState<'savings' | 'renewal' | 'query' | 'orc' | 'profile'>('savings');

  const [loading, setLoading] = useState(true);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mc360_agent_session');
    if (!saved) {
      // Create a fallback default agent session for Malda Collector Keshab Ch Mahato if not present
      const defaultAgent: Agent = {
        id: 'AGT-001',
        agentId: 'KNM00006282',
        name: 'KESHAB CH MAHATO',
        mobile: '8759598798',
        email: 'keshabmahato@gmail.com',
        branch: 'MALDA HQ',
        status: 'Active',
        referralCode: 'AGT-8798',
        level: 1,
        directAgentsCount: 18,
        totalTeamCount: 142,
        mlmCommissionEarned: 23649.23,
        walletBalance: 24500,
        totalCommission: 78500,
        totalDirectCustomers: 34,
        target: '₹ 5,00,000',
        achievementRate: 92,
      };
      setAgent(defaultAgent);
      localStorage.setItem('mc360_agent_session', JSON.stringify(defaultAgent));
      setLoading(false);
      return;
    }

    try {
      const parsedAgent: Agent = JSON.parse(saved);
      if (!parsedAgent.agentId) parsedAgent.agentId = 'KNM00006282';
      setAgent(parsedAgent);

      // Fetch live agent data & assigned customers
      fetch(`/api/agent/data?agentId=${parsedAgent.agentId || parsedAgent.mobile}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data) {
            if (res.data.agent) setAgent(res.data.agent);
            if (res.data.customers) setCustomers(res.data.customers);
            if (res.data.collections) setCollections(res.data.collections);
            if (res.data.downlineTree) setDownlineTree(res.data.downlineTree);
            if (res.data.mlmCommissionLogs) setMlmLogs(res.data.mlmCommissionLogs);
          }
        })
        .catch((err) => console.warn('Error loading agent data:', err))
        .finally(() => setLoading(false));
    } catch (e) {
      console.error(e);
      router.replace('/agent/login');
    }
  }, [router]);

  const handleConfirmLogout = () => {
    localStorage.removeItem('mc360_agent_session');
    router.push('/agent/login');
  };

  const handleUpdateWallet = (amount: number) => {
    if (!agent) return;
    const current = Number(agent.walletBalance) || 0;
    const updated = current + amount;
    const updatedAgent = { ...agent, walletBalance: updated };
    setAgent(updatedAgent);
    localStorage.setItem('mc360_agent_session', JSON.stringify(updatedAgent));
  };

  const handleAddCustomer = (newCustomer: Customer, commissionEarned: number) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    if (agent) {
      const updatedAgent = {
        ...agent,
        totalDirectCustomers: (agent.totalDirectCustomers || 0) + 1,
      };
      setAgent(updatedAgent);
      localStorage.setItem('mc360_agent_session', JSON.stringify(updatedAgent));
    }
  };

  const copyReferralCode = () => {
    if (!agent) return;
    const code = agent.referralCode || `AGT-${agent.mobile?.slice(-4) || '8798'}`;
    navigator.clipboard.writeText(code);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const copyReferralLink = () => {
    if (!agent) return;
    const code = agent.referralCode || `AGT-${agent.mobile?.slice(-4) || '8798'}`;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/agent/signup?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading || !agent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Loading MultiCredit 360 Agent Portal...</p>
        </div>
      </div>
    );
  }

  const referralCode = agent.referralCode || `AGT-${agent.mobile?.slice(-4) || '8798'}`;
  const walletBalance = Number(agent.walletBalance) || 24500;
  const totalCommission = Number(agent.totalCommission) || 78500;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black text-sm">
              MC
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1">
                MultiCredit <span className="text-indigo-600">360</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                Collector & Field Advisor Portal
              </span>
            </div>
          </div>

          {/* Portal Switcher & Live Wallet */}
          <div className="hidden md:flex items-center gap-2.5 text-xs">
            <Link
              href="/admin/dashboard"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin Portal</span>
            </Link>

            <span className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold flex items-center gap-1.5 shadow-sm">
              <Users className="w-3.5 h-3.5" />
              <span>Agent App (Active)</span>
            </span>

            <Link
              href="/customer/login"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              <span>Customer Portal</span>
            </Link>
          </div>

          {/* Agent Profile & Logout Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {agent.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                  {agent.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-semibold">
                  {agent.agentId || 'KNM00006282'} • {agent.branch || 'MALDA HQ'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-2.5 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer border border-transparent hover:border-rose-100"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Top Highlight Banners (Wallet & Live Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Live Wallet Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1330] via-[#172054] to-[#123164] text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">Agent Available Balance</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  LIVE WALLET
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ₹ {walletBalance.toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-slate-300 mt-1">
                Total Incentives & Commissions: <span className="font-bold text-amber-300">₹ {totalCommission.toLocaleString('en-IN')}</span>
              </p>
            </div>

            <div className="relative z-10 mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(true)}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Withdraw Payout</span>
              </button>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs transition cursor-pointer"
                title="View Agent QR"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Referral & Collector ID Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Collector Referral & Team Link</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Rank {agent.level || 1} Advisor
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 mb-2">
                <span className="font-mono text-base font-extrabold text-indigo-900 tracking-wider">
                  {referralCode}
                </span>
                <button
                  type="button"
                  onClick={copyReferralCode}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px] transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedRef ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Direct Invite Link */}
              <button
                type="button"
                onClick={copyReferralLink}
                className="w-full py-2 px-3 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-[11px] flex items-center justify-between transition cursor-pointer"
              >
                <span className="truncate">🔗 Copy Team Registration Link</span>
                <span className="text-[10px] text-indigo-600 font-semibold shrink-0">
                  {copiedLink ? '✓ Copied' : 'Share'}
                </span>
              </button>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Direct Agents: <strong className="text-indigo-700">{agent.directAgentsCount || 18}</strong></span>
              <span className="text-purple-700 font-bold">{agent.totalTeamCount || 142} Total Network</span>
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h4 className="text-base font-extrabold">Field Collection & Growth</h4>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Collection target achieved: <strong className="text-amber-300">{agent.achievementRate || 92}%</strong>. Collect Daily/Monthly deposits, loans, and earn instant commissions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/15 text-xs">
              <div className="p-2 rounded-xl bg-white/10">
                <span className="text-[10px] text-indigo-200 block">Total Collections</span>
                <span className="font-extrabold text-white text-sm">₹ 57.75 Lakh</span>
              </div>
              <div className="p-2 rounded-xl bg-white/10">
                <span className="text-[10px] text-indigo-200 block">Over-Riding Share</span>
                <span className="font-extrabold text-emerald-300 text-sm">₹ 23,649.23</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Core Modules Switcher (Tabs) based strictly on Video Functionality */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center gap-1.5">
          {[
            { key: 'savings', label: '1. Savings Account', icon: PiggyBank },
            { key: 'renewal', label: '2. Renewal (DRD / RD)', icon: RefreshCw },
            { key: 'query', label: '3. Query Account & Reports', icon: FileText },
            { key: 'orc', label: '4. ORC Commission', icon: TrendingUp },
            { key: 'profile', label: '5. Profile & Chain View', icon: GitFork },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = mainModule === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMainModule(tab.key as any)}
                className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Module Content Renderer */}
        {mainModule === 'savings' && (
          <AgentSavingsView
            agent={agent}
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onUpdateWallet={handleUpdateWallet}
          />
        )}

        {mainModule === 'renewal' && (
          <AgentRenewalView agent={agent} onUpdateWallet={handleUpdateWallet} />
        )}

        {mainModule === 'query' && <AgentQueryReportsView agent={agent} />}

        {mainModule === 'orc' && <AgentOrcView agent={agent} />}

        {mainModule === 'profile' && <AgentProfileChainView agent={agent} />}
      </main>

      {/* Confirmation Modal: Are you sure you want to Logout? (From Video) */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900">Are you sure you want to Logout?</h4>
              <p className="text-xs text-slate-500 mt-1">
                You will need your Collector ID or mobile number and password to login back.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                No, Stay Logged In
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-pink-500/25 cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payout Withdrawal Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-base font-bold text-slate-900">Withdraw Wallet Payout</h4>
              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Available Live Balance</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹ {walletBalance.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transfer Destination</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800">
                  <option>State Bank of India (A/C: •••• 5828)</option>
                  <option>Direct Instant UPI (8759598798@upi)</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-[11px] font-medium">
                Direct NEFT / IMPS payout to registered bank account.
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Payout request of ₹${walletBalance} initiated!`);
                    setIsPayoutModalOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Withdraw All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-slate-900">Agent Referral QR</h4>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-48 h-48 mx-auto bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-white font-mono text-xs font-bold p-3 text-center">
                MultiCredit 360
                <br />
                {agent.name}
                <br />
                <span className="text-indigo-400 text-sm mt-1 block">{agent.agentId || 'KNM00006282'}</span>
              </div>
            </div>
            <p className="text-xs font-mono font-bold text-indigo-700 mt-3">{referralCode}</p>
            <p className="text-[11px] text-slate-500 mt-1">Show QR to customer for instant onboarding.</p>
          </div>
        </div>
      )}
    </div>
  );
}
