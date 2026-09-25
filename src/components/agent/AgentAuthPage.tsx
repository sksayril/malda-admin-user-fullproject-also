'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Mail,
  Phone,
  Lock,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Briefcase,
  Wallet,
} from 'lucide-react';
import { Agent } from '@/types';

interface AgentAuthPageProps {
  initialMode?: 'login' | 'signup';
}

export default function AgentAuthPage({ initialMode = 'login' }: AgentAuthPageProps) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('9876543210');
  const [loginPassword, setLoginPassword] = useState('agent123');

  // Signup form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('Kolkata HQ');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/agent/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success && data.data?.agent) {
        localStorage.setItem('mc360_agent_session', JSON.stringify(data.data.agent));
        router.push('/agent/dashboard');
      } else {
        setError(data.message || 'Invalid agent credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const payload = {
        name,
        email,
        mobile,
        password,
        branch,
        address,
      };

      const res = await fetch('/api/agent/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data?.agent) {
        localStorage.setItem('mc360_agent_session', JSON.stringify(data.data.agent));
        setSuccessMsg('Agent account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/agent/dashboard');
        }, 1200);
      } else {
        setError(data.message || 'Agent signup failed');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (agent: Agent) => {
    localStorage.setItem('mc360_agent_session', JSON.stringify(agent));
    router.push('/agent/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Top Portal Switcher Bar */}
      <div className="mb-5 w-full max-w-4xl bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">MultiCredit 360 Portals:</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/login"
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Admin Portal</span>
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
      </div>

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Column: Form */}
        <div className="p-7 sm:p-9 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold text-lg">
                <span>MC</span>
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                  Agent <span className="text-indigo-600">Portal</span>
                </h1>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  Field Collectors & Advisors
                </p>
              </div>
            </div>

            {/* Header */}
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {isSignUp ? 'Join as Society Agent' : 'Agent Login'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isSignUp
                  ? 'Register to onboard customers, collect EMI & earn MLM commissions'
                  : 'Manage your wallet balance, referral network and collections'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl">
                {successMsg}
              </div>
            )}

            {/* Login Form */}
            {!isSignUp ? (
              <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Agent ID / Mobile / Email / Referral Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. AGT001 or 9876543210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 text-xs"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Agent Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 text-xs"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Login to Agent Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSignup} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rakesh Kumar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rakesh@multicredit.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Assigned Branch</label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      <option value="Kolkata HQ">Main Branch (Kolkata HQ)</option>
                      <option value="Bardhaman">Bardhaman Branch</option>
                      <option value="Durgapur">Durgapur Branch</option>
                      <option value="Asansol">Asansol Branch</option>
                      <option value="Siliguri">Siliguri Branch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Office / Base Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Park Street, Kolkata, West Bengal"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration & Get Referral Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Logins for Agent */}
            {!isSignUp && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 mb-2 text-center">
                  1-Click Demo Agent Access
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier('9876543210');
                      setLoginPassword('agent123');
                    }}
                    className="py-1.5 px-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-[11px] font-medium transition cursor-pointer text-left"
                  >
                    <span className="font-bold block">Rakesh Kumar (AGT001)</span>
                    <span className="text-[10px] text-slate-500">Kolkata HQ • 24 Users</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier('9876543211');
                      setLoginPassword('agent123');
                    }}
                    className="py-1.5 px-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-[11px] font-medium transition cursor-pointer text-left"
                  >
                    <span className="font-bold block">Sima Das (AGT002)</span>
                    <span className="text-[10px] text-slate-500">Bardhaman • 18 Users</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Login / Signup */}
          <div className="mt-6 text-center text-xs text-slate-600">
            {isSignUp ? (
              <span>
                Already an agent?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Agent Login
                </button>
              </span>
            ) : (
              <span>
                Want to become an agent?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Register Now
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Visual Presentation */}
        <div className="bg-gradient-to-br from-[#0c1435] via-[#1b144b] to-[#123163] p-7 sm:p-9 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-medium border border-indigo-400/20 mb-5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Multi-Level MLM & Field Commission Engine</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2">
              Empower Your Financial Growth & Earnings
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed mb-6">
              Onboard customers with Aadhaar and PAN verification, collect daily/monthly deposits, and earn instant commission payouts directly in your wallet.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-2 text-xs text-slate-200">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2.5">
                <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Wallet Balance & Direct Payout Withdrawals</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2.5">
                <Users className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Onboard Customers with Full KYC & Automatic Referral Bonus</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>14-Level MLM Commission Tracking & Real-Time Analytics</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-white/15 text-[11px] text-slate-300">
            Authorized by MultiCredit 360 Cooperative Society.
          </div>
        </div>
      </div>
    </div>
  );
}
