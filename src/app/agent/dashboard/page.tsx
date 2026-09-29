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
} from 'lucide-react';
import { Agent, Customer, CollectionRecord } from '@/types';

export default function AgentDashboardPage() {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [downlineTree, setDownlineTree] = useState<any>(null);
  const [mlmLogs, setMlmLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'customers' | 'mlmNetwork' | 'collections'>('customers');
  const [loading, setLoading] = useState(true);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedCustomerForCollection, setSelectedCustomerForCollection] = useState<Customer | null>(null);

  // Quick collection form
  const [collectAmount, setCollectAmount] = useState(500);
  const [collectType, setCollectType] = useState<'EMI' | 'RD' | 'Loan' | 'MIS'>('EMI');
  const [collectMode, setCollectMode] = useState<'UPI' | 'Cash' | 'Bank'>('UPI');

  // Customer Onboarding Form (Agent User Create)
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custMobile, setCustMobile] = useState('');
  const [custPassword, setCustPassword] = useState('cust123');
  const [custPanNumber, setCustPanNumber] = useState('');
  const [custPanImage, setCustPanImage] = useState('');
  const [custAdhaarNumber, setCustAdhaarNumber] = useState('');
  const [custAdhaarImage, setCustAdhaarImage] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custPincode, setCustPincode] = useState('');
  const [onboardLoading, setOnboardLoading] = useState(false);
  const [onboardMsg, setOnboardMsg] = useState('');

  // Search in customer table
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mc360_agent_session');
    if (!saved) {
      router.replace('/agent/login');
      return;
    }

    try {
      const parsedAgent: Agent = JSON.parse(saved);
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

  const handleLogout = () => {
    localStorage.removeItem('mc360_agent_session');
    router.push('/agent/login');
  };

  const copyReferralCode = () => {
    if (!agent) return;
    const code = agent.referralCode || `AGT-${agent.mobile?.slice(-4) || '3601'}`;
    navigator.clipboard.writeText(code);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const copyReferralLink = () => {
    if (!agent) return;
    const code = agent.referralCode || `AGT-${agent.mobile?.slice(-4) || '3601'}`;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/agent/signup?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Image Upload helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'pan' | 'adhaar') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'pan') {
          setCustPanImage(reader.result as string);
        } else {
          setCustAdhaarImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Onboard Customer Submission
  const handleOnboardCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;
    setOnboardLoading(true);
    setOnboardMsg('');

    try {
      const payload = {
        agentId: agent.agentId,
        agentReferralCode: agent.referralCode || `AGT-${agent.mobile.slice(-4)}`,
        name: custName,
        email: custEmail,
        mobile: custMobile,
        password: custPassword,
        panNumber: custPanNumber,
        panImage: custPanImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
        adhaarNumber: custAdhaarNumber,
        adhaarImage: custAdhaarImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
        address: custAddress,
        pincode: custPincode,
        type: 'Loan',
      };

      const res = await fetch('/api/agent/create-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data?.customer) {
        // Add to customer list
        setCustomers((prev) => [data.data.customer, ...prev]);

        // Credit agent wallet
        const commission = data.data.commissionEarned || 250;
        const updatedWallet = (Number(agent.walletBalance) || 18450) + commission;
        const updatedAgent = {
          ...agent,
          walletBalance: updatedWallet,
          totalDirectCustomers: (agent.totalDirectCustomers || 0) + 1,
        };
        setAgent(updatedAgent);
        localStorage.setItem('mc360_agent_session', JSON.stringify(updatedAgent));

        setOnboardMsg(`✓ Customer created successfully! ₹${commission} direct referral commission credited to your wallet.`);
        setTimeout(() => {
          setIsOnboardModalOpen(false);
          setOnboardMsg('');
          setCustName('');
          setCustEmail('');
          setCustMobile('');
          setCustPanNumber('');
          setCustPanImage('');
          setCustAdhaarNumber('');
          setCustAdhaarImage('');
          setCustAddress('');
          setCustPincode('');
        }, 1500);
      } else {
        alert(data.message || 'Customer creation failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating customer');
    } finally {
      setOnboardLoading(false);
    }
  };

  // Handle Quick Collection
  const handleRecordCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent || !selectedCustomerForCollection) return;

    const newCol: CollectionRecord = {
      id: String(Date.now()),
      receiptNo: `RC${Math.floor(100 + Math.random() * 900)}`,
      customerName: selectedCustomerForCollection.name,
      customerId: selectedCustomerForCollection.customerId,
      agentName: agent.name,
      type: collectType,
      amount: Number(collectAmount),
      mode: collectMode,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setCollections((prev) => [newCol, ...prev]);

    // Add agent commission cut (2.5% of collected amount)
    const commissionEarned = Math.round(Number(collectAmount) * 0.025);
    const updatedWallet = (Number(agent.walletBalance) || 18450) + commissionEarned;
    const updatedAgent = { ...agent, walletBalance: updatedWallet };
    setAgent(updatedAgent);
    localStorage.setItem('mc360_agent_session', JSON.stringify(updatedAgent));

    // Save to server
    fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCol),
    }).catch(console.error);

    alert(`Receipt #${newCol.receiptNo} recorded! ₹${commissionEarned} collection commission credited to your wallet.`);
    setIsCollectModalOpen(false);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm) ||
      c.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || !agent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Loading Agent Portal...</p>
        </div>
      </div>
    );
  }

  const referralCode = agent.referralCode || `AGT-${agent.mobile?.slice(-4) || '3601'}`;
  const walletBalance = Number(agent.walletBalance) || 18450;
  const totalCommission = Number(agent.totalCommission) || 42500;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-extrabold text-sm">
              MC
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1">
                MultiCredit <span className="text-indigo-600">360</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                Field Agent & Advisor Portal
              </span>
            </div>
          </div>

          {/* Portal Switcher */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <Link
              href="/admin/dashboard"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin</span>
            </Link>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold flex items-center gap-1.5 shadow-sm">
              <Users className="w-3.5 h-3.5" />
              <span>Agent Portal (Active)</span>
            </span>
            <Link
              href="/customer/login"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              <span>Customer Portal</span>
            </Link>
          </div>

          {/* Agent Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                {agent.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {agent.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-medium">
                  {agent.agentId} • {agent.branch}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Top Highlight Banner: Wallet, Referral Code, and Onboard Button */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Wallet Balance Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1330] via-[#172054] to-[#123164] text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">Agent Wallet Balance</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  LIVE
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ₹ {walletBalance.toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-slate-300 mt-1">
                Total Earned Commissions: <span className="font-bold text-amber-300">₹ {totalCommission.toLocaleString('en-IN')}</span>
              </p>
            </div>

            <div className="relative z-10 mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(true)}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Withdraw Payout</span>
              </button>
            </div>
          </div>

          {/* Referral Code & Invite Link Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Your Referral Code & Link</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                  title="Show QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 mb-2">
                <span className="font-mono text-base font-extrabold text-indigo-900 tracking-wider">
                  {referralCode}
                </span>
                <button
                  type="button"
                  onClick={copyReferralCode}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px] transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedRef ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Direct Invite Link */}
              <button
                type="button"
                onClick={copyReferralLink}
                className="w-full py-1.5 px-2.5 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-[11px] flex items-center justify-between transition cursor-pointer"
              >
                <span className="truncate">🔗 Invite Agent Link</span>
                <span className="text-[10px] text-indigo-600 font-semibold shrink-0">
                  {copiedLink ? '✓ Copied Link' : 'Copy Link'}
                </span>
              </button>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Direct Team: <strong className="text-indigo-700">{agent?.directAgentsCount || 0} Agents</strong></span>
              <span className="text-purple-700 font-bold">{downlineTree?.totalDownlineMembers || 0} Total Network</span>
            </div>
          </div>

          {/* Quick Action: Onboard Customer Button Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h4 className="text-base font-extrabold">Agent User Create (Onboard)</h4>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Register new customers directly with Aadhaar, PAN card images, address, and password. Earn instant ₹250 wallet bonus.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOnboardModalOpen(true)}
              className="mt-4 py-3 bg-white hover:bg-indigo-50 text-indigo-700 font-extrabold rounded-2xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Onboard New Customer (গ্রাহক যোগ)</span>
            </button>
          </div>
        </div>

        {/* Commission Count & Breakdown Stats */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Commission Count & MLM Level Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500">
                Detailed commission streams from customer onboarding, collections, deposits & 14-level team overrides
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Rank: Level {agent?.level || 1} Advisor
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block">Direct Onboarding Bonus</span>
              <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                ₹ {Math.round(walletBalance * 0.35).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">({customers.length} verified accounts)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block">FD / RD Deposit Commission</span>
              <span className="text-base font-extrabold text-indigo-700 mt-0.5 block">
                ₹ {Math.round(walletBalance * 0.3).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-indigo-600 font-semibold">(1.0% recurring share)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block">Daily / EMI Loan Collection</span>
              <span className="text-base font-extrabold text-blue-700 mt-0.5 block">
                ₹ {Math.round(walletBalance * 0.25).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-blue-600 font-semibold">(2.5% door collection)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block">14-Level MLM Network Share</span>
              <span className="text-base font-extrabold text-purple-700 mt-0.5 block">
                ₹ {Number(agent?.mlmCommissionEarned || Math.round(walletBalance * 0.1)).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-purple-600 font-semibold">({downlineTree?.totalDownlineMembers || 0} downline agents)</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Switcher */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>My Registered Customers ({customers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mlmNetwork')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'mlmNetwork'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>My 14-Level MLM Team Network ({downlineTree?.totalDownlineMembers || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('collections')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'collections'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Collection Receipts ({collections.length})</span>
          </button>
        </div>

        {/* Tab 1: Customers View */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span>My Registered Customers ({customers.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Customers enrolled under your referral code with KYC records and collection actions
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, phone, or account..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Account Number</th>
                    <th className="py-3.5 px-4">Mobile</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4 text-center">KYC Status</th>
                    <th className="py-3.5 px-4 text-right">Savings Bal</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No customers found matching search.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
                              {cust.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{cust.name}</span>
                              <span className="text-[10px] text-slate-400">{cust.customerId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                          {cust.accountNumber || `MC360-${cust.mobile}`}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">{cust.mobile}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {cust.type || 'Loan'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {cust.kycStatus || 'Verified'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                          ₹ {(cust.savingsBalance || 15000).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCustomerForCollection(cust);
                              setIsCollectModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Collect EMI / RD
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: 14-Level MLM Team Network */}
        {activeTab === 'mlmNetwork' && (
          <div className="space-y-4">
            {/* Team Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
                <span className="text-xs font-medium text-slate-500 block mb-1">Directly Referred Agents</span>
                <div className="text-2xl font-extrabold text-indigo-600">
                  {agent?.directAgentsCount || 0} Agents
                </div>
                <span className="text-[11px] text-slate-400">Level 1 Direct Partners</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
                <span className="text-xs font-medium text-slate-500 block mb-1">Total 14-Level Network</span>
                <div className="text-2xl font-extrabold text-purple-600">
                  {downlineTree?.totalDownlineMembers || 0} Downline Members
                </div>
                <span className="text-[11px] text-purple-600 font-medium">Accumulated Multi-tier Team</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
                <span className="text-xs font-medium text-slate-500 block mb-1">MLM Team Commission</span>
                <div className="text-2xl font-extrabold text-emerald-600">
                  ₹ {Number(agent?.mlmCommissionEarned || 0).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Earned from Downline Overrides</span>
              </div>
            </div>

            {/* Level Breakdown Cards */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your 14-Level Compensation Tiers</h3>
                <p className="text-xs text-slate-500">
                  Criteria configured by Admin. Unlock deeper levels by introducing more direct active agents.
                </p>
              </div>

              <div className="space-y-3">
                {downlineTree?.levelBreakdown ? (
                  downlineTree.levelBreakdown.map((lvl: any) => (
                    <div
                      key={lvl.level}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                            L{lvl.level}
                          </span>
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs">{lvl.name}</h5>
                            <span className="text-[10px] text-slate-500">
                              Commission: <strong className="text-indigo-700">{lvl.commissionPercent}%</strong> • Joining Bonus: <strong className="text-emerald-700">₹{lvl.fixedBonus}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              lvl.isUnlocked
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {lvl.isUnlocked ? '✓ Unlocked' : `Locked (Need ${lvl.minDirectReferrals} Directs)`}
                          </span>
                          <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800">
                            {lvl.membersCount} Member{lvl.membersCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {lvl.members?.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60">
                          {lvl.members.map((m: any) => (
                            <div
                              key={m.agentId}
                              className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between shadow-2xs"
                            >
                              <div>
                                <span className="font-bold text-slate-900 block">{m.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {m.agentId} • {m.mobile}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                                {m.branch}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No downline records loaded yet. Share your referral link to build your team!
                  </div>
                )}
              </div>
            </div>

            {/* Recent MLM Commission Distributions */}
            {mlmLogs?.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Your Recent Unilevel Commission Credits</h4>
                <div className="space-y-2">
                  {mlmLogs.map((log: any) => (
                    <div
                      key={log._id || log.transactionId}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">
                          Level {log.level} Override from {log.fromAgentName} ({log.eventType})
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Tx #{log.transactionId} • {log.date}
                        </span>
                      </div>
                      <span className="font-extrabold text-emerald-700 text-sm">
                        + ₹ {log.commissionAmount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Collections View */}
        {activeTab === 'collections' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Recent Agent Collection Receipts</span>
            </h3>

            <div className="space-y-2 text-xs">
              {collections.length === 0 ? (
                <p className="py-8 text-center text-slate-400 italic">No collections recorded yet.</p>
              ) : (
                collections.map((col) => (
                  <div
                    key={col.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {col.customerName} ({col.type})
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Receipt #{col.receiptNo} • Mode: {col.mode} • Date: {col.date}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-700">
                      + ₹ {col.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Agent User Create (Onboard Customer with Documents) */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900">Onboard New Customer</h4>
                <p className="text-[11px] text-slate-500">
                  Referral code <strong className="text-indigo-600">{referralCode}</strong> will be automatically linked.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOnboardModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {onboardMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                {onboardMsg}
              </div>
            )}

            <form onSubmit={handleOnboardCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Salim Ansari"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={custMobile}
                    onChange={(e) => setCustMobile(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Set Customer Password *</label>
                <input
                  type="password"
                  required
                  value={custPassword}
                  onChange={(e) => setCustPassword(e.target.value)}
                  placeholder="Password for customer portal"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                />
              </div>

              {/* PAN Card Section */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    value={custPanNumber}
                    onChange={(e) => setCustPanNumber(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-1.5 uppercase font-mono rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Upload PAN Card Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'pan')}
                    className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700"
                  />
                  {custPanImage && (
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                      ✓ PAN Card Image attached
                    </span>
                  )}
                </div>
              </div>

              {/* Aadhaar Card Section */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aadhaar Card Number</label>
                  <input
                    type="text"
                    value={custAdhaarNumber}
                    onChange={(e) => setCustAdhaarNumber(e.target.value)}
                    placeholder="2456 7890 1234"
                    className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Upload Aadhaar Card Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'adhaar')}
                    className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700"
                  />
                  {custAdhaarImage && (
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                      ✓ Aadhaar Card Image attached
                    </span>
                  )}
                </div>
              </div>

              {/* Address & Pincode */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={custAddress}
                    onChange={(e) => setCustAddress(e.target.value)}
                    placeholder="Village/Street, City"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={custPincode}
                    onChange={(e) => setCustPincode(e.target.value)}
                    placeholder="700017"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-indigo-700 font-bold block">Agent Direct Commission</span>
                  <span className="text-xs text-indigo-950 font-medium">Auto-credited upon account creation</span>
                </div>
                <span className="text-base font-extrabold text-emerald-700">+ ₹250</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={onboardLoading}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-70"
                >
                  {onboardLoading ? 'Registering...' : 'Register Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Collect EMI / RD */}
      {isCollectModalOpen && selectedCustomerForCollection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-base font-bold text-slate-900">
                Collect from {selectedCustomerForCollection.name}
              </h4>
              <button
                type="button"
                onClick={() => setIsCollectModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordCollection} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Collection Type</label>
                <select
                  value={collectType}
                  onChange={(e) => setCollectType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="EMI">Loan EMI Payment</option>
                  <option value="RD">Recurring Deposit (RD)</option>
                  <option value="MIS">MIS Monthly Collection</option>
                  <option value="Loan">Loan Principal Payoff</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Collected Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="100"
                  step="50"
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-extrabold text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                <select
                  value={collectMode}
                  onChange={(e) => setCollectMode(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="UPI">UPI / Digital QR</option>
                  <option value="Cash">Cash (Doorstep Handover)</option>
                  <option value="Bank">Direct Bank Transfer</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-semibold">
                You will receive ₹{Math.round(collectAmount * 0.025)} commission into your agent wallet!
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCollectModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-slate-900">Your Agent QR Code</h4>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-48 h-48 mx-auto bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-white font-mono text-xs font-bold p-2 text-center">
                Scan with MC360 App
                <br />
                {referralCode}
              </div>
            </div>
            <p className="text-xs font-mono font-bold text-indigo-700 mt-3">{referralCode}</p>
            <p className="text-[11px] text-slate-500 mt-1">Show this QR to customers for quick link.</p>
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
                <span className="text-slate-500 text-[11px] block">Available to Withdraw</span>
                <span className="text-2xl font-extrabold text-slate-900">
                  ₹ {walletBalance.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transfer Destination</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800">
                  <option>SBI Bank (A/C: •••• 3412)</option>
                  <option>Instant UPI (mobile@upi)</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-[11px]">
                Direct NEFT / IMPS payout authorized within 10 minutes.
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
                    alert(`Payout request of ₹${walletBalance} initiated to registered bank account!`);
                    setIsPayoutModalOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20"
                >
                  Withdraw All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
