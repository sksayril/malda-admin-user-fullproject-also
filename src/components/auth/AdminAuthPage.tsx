'use client';

import React, { useState } from 'react';
import { Mail, Lock, Building2, ShieldCheck, UserCheck, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { UserSession } from '@/types';

interface AdminAuthPageProps {
  onLoginSuccess: (user: UserSession) => void;
}

export default function AdminAuthPage({ onLoginSuccess }: AdminAuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('superadmin@multicredit.com');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('Super Admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const payload = isSignUp
        ? { name, email, password, role: 'Super Admin' }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success && result.data?.user) {
        if (result.data.token) {
          localStorage.setItem('mc360_auth_token', result.data.token);
        }
        onLoginSuccess(result.data.user);
      } else {
        setError(result.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      console.error('Auth request error:', err);
      setError(err.message || 'Network error connecting to database server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'Super Admin' | 'Branch Manager' | 'Agent') => {
    setLoading(true);
    setError('');

    const demoCredentials = {
      'Super Admin': { email: 'superadmin@multicredit.com', password: 'admin123' },
      'Branch Manager': { email: 'branch1@multicredit.com', password: 'admin123' },
      Agent: { email: 'rakesh.agent@multicredit.com', password: 'admin123' },
    };

    const creds = demoCredentials[role];

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });

      const result = await res.json();

      if (result.success && result.data?.user) {
        if (result.data.token) {
          localStorage.setItem('mc360_auth_token', result.data.token);
        }
        onLoginSuccess(result.data.user);
      } else {
        // Fallback demo state if offline
        onLoginSuccess({
          id: 'usr_admin_1',
          name: role === 'Super Admin' ? 'Super Admin' : role === 'Branch Manager' ? 'R. Roy' : 'Rakesh Kumar',
          email: creds.email,
          role,
          tenantId: 'TNT001',
          mobile: '+91 98765 43210',
        });
      }
    } catch {
      // Offline fallback
      onLoginSuccess({
        id: 'usr_admin_1',
        name: 'Super Admin',
        email: creds.email,
        role,
        tenantId: 'TNT001',
        mobile: '+91 98765 43210',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Top Notification Bar for Demo */}
      <div className="mb-6 w-full max-w-4xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-2xl p-3 sm:p-4 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="font-semibold">MultiCredit 360 Admin Portal</span>
            <p className="text-xs text-blue-100 hidden sm:block">
              Experience the complete 20-module FinTech & Credit Society platform
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleDemoLogin('Super Admin')}
            className="flex-1 sm:flex-none px-4 py-1.5 bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-lg text-xs shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            1-Click Demo Login
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Column: Form (Matching Screen 1) */}
        <div className="p-8 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold text-xl">
                <span className="tracking-tighter">MC</span>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                  MultiCredit <span className="text-blue-600">360</span>
                </h1>
                <p className="text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                  People | Finance | Growth
                </p>
              </div>
            </div>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {isSignUp ? 'Create Admin Account' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {isSignUp
                  ? 'Register as a new Credit Society Administrator'
                  : 'Login to your admin account'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-xl">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Salim Ansari"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm text-slate-800 transition"
                    />
                    <UserCheck className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@multicredit.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm text-slate-800 transition"
                  />
                  <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm text-slate-800 transition"
                  />
                  <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to demo registered email!')}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Account' : 'Login'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-600 mb-2.5 text-center">
                Demo Credentials (Instant Access)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Super Admin')}
                  className="py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Branch Manager')}
                  className="py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  Branch Mgr
                </button>
              </div>
            </div>
          </div>

          {/* Toggle between Login and Signup */}
          <div className="mt-8 text-center text-xs text-slate-600">
            {isSignUp ? (
              <span>
                Already have an admin account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Login here
                </button>
              </span>
            ) : (
              <span>
                Don&apos;t have an admin account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Visual Presentation (Matching Screen 1) */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0b1736] to-blue-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background decorative circles */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-400/20 mb-6">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Cooperative Credit SaaS v2.4</span>
            </div>

            <h3 className="text-2xl font-bold tracking-tight mb-3">
              Complete Society, Agent & Finance Management
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              End-to-end management covering Loans, EMI Collections, FD/RD/MIS Deposits, 14-Level MLM Commissions, and White Label partner solutions.
            </p>

            {/* Feature tags */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Automated EMI & KYC</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-sky-400" />
                <span>Live Agent Tracking</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span>FD & RD Maturity</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span>14-Level MLM Engine</span>
              </div>
            </div>
          </div>

          {/* Building Architecture Graphic (Matching image 1 bottom card) */}
          <div className="relative z-10 mt-8 pt-4">
            <div className="rounded-2xl overflow-hidden border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-7 h-7 text-sky-400" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Central Operations Center</h4>
                  <p className="text-[11px] text-slate-300">MultiCredit 360 Financial Network</p>
                </div>
              </div>
              <div className="w-full h-24 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 rounded-xl flex items-center justify-center border border-white/10 text-xs text-blue-200 font-medium">
                Together for a Better Tomorrow
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
