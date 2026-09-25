'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Lock,
  FileText,
  Upload,
  CreditCard,
  MapPin,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Building2,
  Users,
} from 'lucide-react';
import { Customer } from '@/types';

interface CustomerAuthPageProps {
  initialMode?: 'login' | 'signup';
}

export default function CustomerAuthPage({ initialMode = 'login' }: CustomerAuthPageProps) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [panImage, setPanImage] = useState('');
  const [adhaarNumber, setAdhaarNumber] = useState('');
  const [adhaarImage, setAdhaarImage] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle image upload to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'pan' | 'adhaar') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'pan') {
          setPanImage(reader.result as string);
        } else {
          setAdhaarImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/customer/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success && data.data?.customer) {
        localStorage.setItem('mc360_customer_session', JSON.stringify(data.data.customer));
        router.push('/customer/dashboard');
      } else {
        setError(data.message || 'Invalid customer credentials');
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
        panNumber,
        panImage: panImage || '',
        adhaarNumber,
        adhaarImage: adhaarImage || '',
        address,
        pincode,
        referralCode,
      };

      const res = await fetch('/api/customer/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data?.customer) {
        localStorage.setItem('mc360_customer_session', JSON.stringify(data.data.customer));
        setSuccessMsg('Account created successfully! Redirecting to customer dashboard...');
        setTimeout(() => {
          router.push('/customer/dashboard');
        }, 1200);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
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
          <Link
            href="/agent/login"
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Agent Portal</span>
          </Link>
          <span className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5 shadow-sm">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Customer Portal (Active)</span>
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Column: Form */}
        <div className="p-7 sm:p-9 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold text-lg">
                <span>MC</span>
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                  Customer <span className="text-blue-600">Portal</span>
                </h1>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  Self-Service Banking & Loans
                </p>
              </div>
            </div>

            {/* Header */}
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {isSignUp ? 'Open Customer Account' : 'Customer Login'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isSignUp
                  ? 'Enter your KYC documents, Aadhaar, PAN and address'
                  : 'Access your Debit Card, FD, RD, MIS and Loans'}
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
                    Mobile Number / Email / Account No
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. 9876543210 or MC360-9876543210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 text-xs"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 text-xs"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Login to Customer Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Signup Form with Complete KYC Documents */
              <form onSubmit={handleSignup} className="space-y-3 text-xs max-h-[460px] overflow-y-auto pr-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Md. Salim Ansari"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 text-xs"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="salim@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Set Password *</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create secure password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 text-xs"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* PAN Card & Image */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">PAN Card Number</label>
                    <input
                      type="text"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      className="w-full px-3 py-1.5 uppercase font-mono rounded-lg border border-slate-200 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Upload PAN Card Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'pan')}
                      className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {panImage && (
                      <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                        ✓ PAN Card photo attached
                      </span>
                    )}
                  </div>
                </div>

                {/* Aadhaar Card & Image */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Aadhaar Card Number</label>
                    <input
                      type="text"
                      value={adhaarNumber}
                      onChange={(e) => setAdhaarNumber(e.target.value)}
                      placeholder="2456 7890 1234"
                      className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Upload Aadhaar Card Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'adhaar')}
                      className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {adhaarImage && (
                      <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                        ✓ Aadhaar Card photo attached
                      </span>
                    )}
                  </div>
                </div>

                {/* Address & Pincode */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Full Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Village/Street, City, District"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="700017"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* Referral Code */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Agent / Referral Code (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      placeholder="e.g. AGT-3601"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 font-mono text-xs uppercase"
                    />
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete KYC & Open Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Toggle Login / Signup */}
          <div className="mt-6 text-center text-xs text-slate-600">
            {isSignUp ? (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Customer Login
                </button>
              </span>
            ) : (
              <span>
                New customer?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Open Free Account
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Visual Presentation */}
        <div className="bg-gradient-to-br from-[#0c183a] via-[#102a6b] to-[#0a4575] p-7 sm:p-9 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium border border-blue-400/20 mb-5">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Direct Customer Self-Service</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2">
              Virtual Debit Card, Investments & Instant Credit
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed mb-6">
              Track your savings balance, manage Fixed Deposits (8.5%), Recurring Deposits (7.5%), Monthly Income Schemes (9.0%), and doorstep daily loan collections.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-2 text-xs text-slate-200">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Instant Holographic Virtual Debit Card & Unique Account Number</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>FD, RD & MIS high-yield interest compounding calculation</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100-Day Market Daily Loan repayment schedule tracking</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-white/15 text-[11px] text-slate-300">
            Need help? Visit your nearest branch or contact your assigned society agent.
          </div>
        </div>
      </div>
    </div>
  );
}
