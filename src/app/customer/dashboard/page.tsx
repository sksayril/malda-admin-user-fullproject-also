'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  CreditCard,
  LogOut,
  ShieldCheck,
  Building2,
  Users,
  PiggyBank,
  Landmark,
  AlertTriangle,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  Eye,
  X,
} from 'lucide-react';
import { Customer, LoanApplication, DepositAccount, CollectionRecord } from '@/types';
import VirtualDebitCard from '@/components/customer/VirtualDebitCard';
import LatePaymentChart from '@/components/customer/LatePaymentChart';
import InvestmentsSection from '@/components/customer/InvestmentsSection';
import LoansSection from '@/components/customer/LoansSection';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [deposits, setDeposits] = useState<DepositAccount[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'investments' | 'loans' | 'latechart' | 'kyc'>('overview');

  // Deposit/Withdraw modal
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(1000);
  const [selectedDocImg, setSelectedDocImg] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mc360_customer_session');
    if (!saved) {
      router.replace('/customer/login');
      return;
    }

    try {
      const parsedCustomer: Customer = JSON.parse(saved);
      setCustomer(parsedCustomer);

      // Fetch live data for this customer
      fetch(`/api/customer/data?customerId=${parsedCustomer.customerId || parsedCustomer.mobile}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data) {
            if (res.data.customer) setCustomer(res.data.customer);
            if (res.data.loans) setLoans(res.data.loans);
            if (res.data.deposits) setDeposits(res.data.deposits);
            if (res.data.collections) setCollections(res.data.collections);
          }
        })
        .catch((err) => console.warn('Error loading customer data:', err))
        .finally(() => setLoading(false));
    } catch (e) {
      console.error(e);
      router.replace('/customer/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('mc360_customer_session');
    router.push('/customer/login');
  };

  const handleAddDeposit = (newDep: DepositAccount) => {
    setDeposits((prev) => [newDep, ...prev]);
    // Also save to database
    fetch('/api/deposits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDep),
    }).catch(console.error);
  };

  const handleApplyLoan = (newLoan: LoanApplication) => {
    setLoans((prev) => [newLoan, ...prev]);
    fetch('/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLoan),
    }).catch(console.error);
  };

  const handleAddSavings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    const addAmt = Number(depositAmount);
    const updatedBalance = (customer.savingsBalance || 25400) + addAmt;
    const updated = { ...customer, savingsBalance: updatedBalance };
    setCustomer(updated);
    localStorage.setItem('mc360_customer_session', JSON.stringify(updated));

    // Razorpay Online Payment & Collection Verification
    try {
      const verifyRes = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: `pay_rzp_${Date.now()}`,
          orderId: `order_rzp_${Date.now()}`,
          customerId: customer.customerId,
          customerName: customer.name,
          amount: addAmt,
          type: 'DEPOSIT',
        }),
      });
      const resData = await verifyRes.json();
      const receiptNo = resData.data?.receiptNo || `RC${Math.floor(100 + Math.random() * 900)}`;

      const newCol: CollectionRecord = {
        id: String(Date.now()),
        receiptNo,
        customerName: customer.name,
        customerId: customer.customerId,
        agentName: resData.data?.agentName || 'Razorpay Online Gateway',
        type: 'FD',
        amount: addAmt,
        mode: 'UPI',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      setCollections((prev) => [newCol, ...prev]);
    } catch (err) {
      console.warn('Payment verify error:', err);
    }

    setIsDepositModalOpen(false);
  };

  if (loading || !customer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Loading Customer Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-extrabold text-sm">
              MC
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1">
                MultiCredit <span className="text-blue-600">360</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                Customer Banking Portal
              </span>
            </div>
          </div>

          {/* Portal Hop Switcher */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <Link
              href="/admin/dashboard"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin</span>
            </Link>
            <Link
              href="/agent/dashboard"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Agent Portal</span>
            </Link>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {customer.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {customer.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-medium">
                  {customer.customerId}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Welcome & Navigation Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Welcome back, {customer.name}! 👋
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                KYC {customer.kycStatus || 'Verified'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Account No: <span className="font-mono font-bold text-slate-800">{customer.accountNumber || `MC360-${customer.mobile}`}</span> • Mobile: {customer.mobile}
            </p>
          </div>

          {/* Quick Tab Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'overview', label: 'Overview & Debit Card' },
              { id: 'investments', label: 'FD / RD / MIS' },
              { id: 'loans', label: 'Loans & Daily Loan' },
              { id: 'latechart', label: 'Late Payment Chart' },
              { id: 'kyc', label: 'KYC Documents' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  activeView === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content depending on Active View */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Top Grid: Debit Card on left, Savings & Fast Actions on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Debit Card Component */}
              <div className="lg:col-span-6">
                <VirtualDebitCard customer={customer} balance={customer.savingsBalance || 25400} />
              </div>

              {/* Right: Balance & Quick Stats */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-semibold text-slate-500">Savings Account Balance</span>
                      <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                        ₹ {(customer.savingsBalance || 25400).toLocaleString('en-IN')}
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsDepositModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Funds (Deposit)</span>
                    </button>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-500 font-medium block">Total FDs & RDs</span>
                      <span className="text-base font-extrabold text-indigo-700">
                        {deposits.length} Accounts
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-500 font-medium block">Active Loans</span>
                      <span className="text-base font-extrabold text-blue-700">
                        {loans.length} Loans
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-500 font-medium block">Assigned Agent</span>
                      <span className="text-xs font-bold text-slate-800">
                        {customer.referralCode || 'AGT-3601'}
                      </span>
                    </div>
                  </div>

                  {/* KYC & Identity verification banner */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">Verified Society Member</span>
                        <span className="text-[11px] text-slate-600">
                          PAN: {customer.panNumber || 'ABCDE1234F'} • Aadhaar: {customer.adhaarNumber || '•••• •••• 1234'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveView('kyc')}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      View KYC
                    </button>
                  </div>
                </div>

                {/* Quick Transaction / Passbook Log */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Recent Collections & Passbook Entries
                  </h4>
                  <div className="space-y-2 text-xs">
                    {collections.length === 0 ? (
                      <p className="text-slate-400 py-3 text-center">No recent transaction entries.</p>
                    ) : (
                      collections.slice(0, 3).map((col) => (
                        <div
                          key={col.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                              ↓
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block">
                                {col.type} Payment ({col.receiptNo})
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {col.date} • By {col.agentName}
                              </span>
                            </div>
                          </div>
                          <span className="font-extrabold text-emerald-700">
                            + ₹ {col.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Market Loan & Term Loans Summary */}
            <LoansSection
              loans={loans}
              onApplyLoan={handleApplyLoan}
              customerName={customer.name}
              customerId={customer.customerId}
            />

            {/* Investments Section */}
            <InvestmentsSection
              deposits={deposits}
              onAddDeposit={handleAddDeposit}
              customerName={customer.name}
              customerId={customer.customerId}
            />

            {/* Late Payment Penalty Matrix */}
            <LatePaymentChart />
          </div>
        )}

        {activeView === 'investments' && (
          <InvestmentsSection
            deposits={deposits}
            onAddDeposit={handleAddDeposit}
            customerName={customer.name}
            customerId={customer.customerId}
          />
        )}

        {activeView === 'loans' && (
          <LoansSection
            loans={loans}
            onApplyLoan={handleApplyLoan}
            customerName={customer.name}
            customerId={customer.customerId}
          />
        )}

        {activeView === 'latechart' && <LatePaymentChart />}

        {activeView === 'kyc' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Customer KYC Documents & Address Verification</span>
              </h3>
              <p className="text-xs text-slate-500">
                Official documents submitted during registration and verified by Society Audit
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PAN Card Details & Image */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">PAN Card</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Verified
                  </span>
                </div>
                <p className="font-mono text-base font-extrabold text-slate-900">
                  {customer.panNumber || 'ABCDE1234F'}
                </p>

                {customer.panImage ? (
                  <div
                    onClick={() =>
                      setSelectedDocImg({
                        title: 'PAN Card Document',
                        url: customer.panImage || '',
                      })
                    }
                    className="h-44 rounded-xl overflow-hidden border border-slate-200 bg-white relative cursor-pointer group"
                  >
                    <img
                      src={customer.panImage}
                      alt="PAN Card"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold text-xs gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>Click to View Large</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    No PAN image attached
                  </div>
                )}
              </div>

              {/* Aadhaar Card Details & Image */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">Aadhaar Card</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Verified
                  </span>
                </div>
                <p className="font-mono text-base font-extrabold text-slate-900">
                  {customer.adhaarNumber || '2456 7890 1234'}
                </p>

                {customer.adhaarImage ? (
                  <div
                    onClick={() =>
                      setSelectedDocImg({
                        title: 'Aadhaar Card Document',
                        url: customer.adhaarImage || '',
                      })
                    }
                    className="h-44 rounded-xl overflow-hidden border border-slate-200 bg-white relative cursor-pointer group"
                  >
                    <img
                      src={customer.adhaarImage}
                      alt="Aadhaar Card"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold text-xs gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>Click to View Large</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    No Aadhaar image attached
                  </div>
                )}
              </div>
            </div>

            {/* Address & Pincode Card */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs">
              <span className="font-bold text-slate-800 block mb-1">Registered Residential Address</span>
              <p className="text-slate-700">
                {customer.address || '14/B Park Circus, Kolkata, West Bengal'}
              </p>
              <p className="font-semibold text-slate-600 mt-1">
                Pincode: {customer.pincode || '700017'}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-base font-bold text-slate-900">Add Funds to Savings</h4>
              <button
                type="button"
                onClick={() => setIsDepositModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSavings} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deposit Amount (₹)</label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-[11px]">
                Instant credit to account {customer.accountNumber || `MC360-${customer.mobile}`}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {selectedDocImg && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h4 className="text-sm font-bold text-slate-900">{selectedDocImg.title}</h4>
              <button
                type="button"
                onClick={() => setSelectedDocImg(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-[70vh] flex items-center justify-center">
              <img src={selectedDocImg.url} alt="Document" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
