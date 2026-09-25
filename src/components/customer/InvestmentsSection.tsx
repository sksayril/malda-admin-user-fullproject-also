'use client';

import React, { useState, useEffect } from 'react';
import {
  PiggyBank,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  CheckCircle2,
  X,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DepositAccount, ProductScheme } from '@/types';
import { INITIAL_SCHEMES } from '@/data/mockData';

interface InvestmentsSectionProps {
  deposits: DepositAccount[];
  onAddDeposit?: (deposit: DepositAccount) => void;
  customerName: string;
  customerId?: string;
}

export default function InvestmentsSection({
  deposits,
  onAddDeposit,
  customerName,
  customerId = 'CUS001',
}: InvestmentsSectionProps) {
  const [activeTab, setActiveTab] = useState<'FD' | 'RD' | 'MIS'>('FD');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminSchemes, setAdminSchemes] = useState<ProductScheme[]>(INITIAL_SCHEMES);

  // New investment form state
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>('');
  const [invAmount, setInvAmount] = useState<number>(50000);
  const [payViaRazorpay, setPayViaRazorpay] = useState<boolean>(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/schemes?active=true')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setAdminSchemes(res.data);
      })
      .catch((err) => console.warn('Error loading schemes:', err));
  }, []);

  // Filter schemes created by admin for this active category
  const activeCategorySchemes = adminSchemes.filter(
    (s) => s.category.toUpperCase() === activeTab && s.status === 'Active'
  );

  const currentSelectedScheme =
    activeCategorySchemes.find((s) => s.code === selectedSchemeCode) || activeCategorySchemes[0];

  const interestRate = currentSelectedScheme ? currentSelectedScheme.interestRate : 8.5;
  const tenureMonths = currentSelectedScheme ? currentSelectedScheme.tenureMonths : 12;

  const calculateMaturity = (type: 'FD' | 'RD' | 'MIS', amount: number, months: number, rate: number) => {
    const rDecimal = rate / 100;
    const years = months / 12;
    if (type === 'FD') {
      return Math.round(amount * Math.pow(1 + rDecimal / 4, 4 * years));
    }
    if (type === 'RD') {
      const n = months;
      const r = rDecimal / 12;
      return Math.round(amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    }
    // MIS monthly payout
    return Math.round((amount * rDecimal) / 12);
  };

  const filteredDeposits = deposits.filter((d) => d.type === activeTab);

  const handleCreateInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    const maturityVal = calculateMaturity(activeTab, invAmount, tenureMonths, interestRate);
    const newAccountId = `${activeTab}${Math.floor(100 + Math.random() * 900)}`;

    const newDep: DepositAccount = {
      id: String(Date.now()),
      accountId: newAccountId,
      customerName,
      customerId,
      type: activeTab,
      amount: invAmount,
      interestRate,
      tenureMonths,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      maturityDate: new Date(Date.now() + tenureMonths * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      maturityAmount: activeTab === 'MIS' ? invAmount : maturityVal,
      monthlyPayout: activeTab === 'MIS' ? maturityVal : 0,
      status: 'Active',
    };

    if (payViaRazorpay) {
      // Simulate Razorpay Gateway Verification & Auto Agent Commission Credit
      try {
        const verifyRes = await fetch('/api/payments/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: `pay_rzp_${Date.now()}`,
            orderId: `order_rzp_${Date.now()}`,
            customerId,
            customerName,
            amount: invAmount,
            type: activeTab,
            schemeCode: currentSelectedScheme?.code,
            accountId: newAccountId,
          }),
        });
        const verifyData = await verifyRes.json();
        setPaymentSuccessData(verifyData.data || { receiptNo: `RC${Math.floor(100 + Math.random() * 900)}` });
      } catch (err) {
        console.warn('Payment verify err:', err);
      }
    }

    if (onAddDeposit) {
      onAddDeposit(newDep);
    }

    setIsProcessingPayment(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setPaymentSuccessData(null);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header & New Investment Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-indigo-600" />
            <span>Savings & Investments (Admin Approved Schemes)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Fixed Deposits (FD), Recurring Deposits (RD) & Monthly Income Scheme (MIS) with Razorpay Auto Collection
          </p>
        </div>

        <button
          onClick={() => {
            if (activeCategorySchemes.length > 0) {
              setSelectedSchemeCode(activeCategorySchemes[0].code);
            }
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Open New {activeTab}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
        {(['FD', 'RD', 'MIS'] as const).map((tab) => {
          const schemeCount = adminSchemes.filter((s) => s.category === tab && s.status === 'Active').length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>
                {tab === 'FD'
                  ? `Fixed Deposit (${schemeCount} Offers)`
                  : tab === 'RD'
                  ? `Recurring Deposit (${schemeCount} Offers)`
                  : `Monthly Income MIS (${schemeCount} Offers)`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Admin Live Schemes Preview Strip */}
      <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
        <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
          Current Admin-Approved {activeTab} Offers:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {activeCategorySchemes.map((sch) => (
            <div
              key={sch.code}
              onClick={() => {
                setSelectedSchemeCode(sch.code);
                setIsModalOpen(true);
              }}
              className="p-3 bg-white rounded-xl border border-indigo-200/80 hover:border-indigo-500 transition cursor-pointer shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">{sch.name}</span>
                  <span className="font-extrabold text-indigo-700 text-xs">{sch.interestRate}%</span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">{sch.description}</p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                <span>Tenure: {sch.tenureMonths} Mo</span>
                <span className="text-indigo-600 font-bold">Invest Now →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposits List */}
      <div className="space-y-3">
        {filteredDeposits.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <p className="text-xs text-slate-500 mb-2">No active {activeTab} accounts registered yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Click here to choose an offer and start investing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDeposits.map((dep) => (
              <div
                key={dep.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded-md">
                      {dep.accountId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {dep.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        {dep.type === 'RD' ? 'Monthly Installment' : 'Principal Amount'}
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        ₹ {dep.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        {dep.type === 'MIS' ? 'Monthly Payout' : 'Maturity Amount'}
                      </span>
                      <span className="text-base font-extrabold text-indigo-600">
                        ₹{' '}
                        {(dep.type === 'MIS'
                          ? dep.monthlyPayout || Math.round((dep.amount * (dep.interestRate || 9)) / 1200)
                          : dep.maturityAmount || Math.round(dep.amount * 1.25)
                        ).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Rate: {dep.interestRate || 8.5}% p.a.</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Maturity: {dep.maturityDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal to Open New Investment with Admin Scheme & Razorpay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-base font-bold text-slate-900">Open New {activeTab} Account</h4>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setPaymentSuccessData(null);
                }}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentSuccessData ? (
              <div className="p-5 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h5 className="font-extrabold text-slate-900 text-sm">Payment Successful!</h5>
                <p className="text-xs text-slate-600">
                  Receipt #{paymentSuccessData.receiptNo} generated. Agent commission credited automatically.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateInvestment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Admin Scheme / Offer *
                  </label>
                  <select
                    value={selectedSchemeCode}
                    onChange={(e) => setSelectedSchemeCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  >
                    {activeCategorySchemes.map((sch) => (
                      <option key={sch.code} value={sch.code}>
                        {sch.name} ({sch.interestRate}% p.a. • {sch.tenureMonths} Months)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {activeTab === 'RD' ? 'Monthly Deposit Amount (₹)' : 'Investment Principal (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={currentSelectedScheme?.minAmount || 500}
                    max={currentSelectedScheme?.maxAmount || 5000000}
                    step="500"
                    value={invAmount}
                    onChange={(e) => setInvAmount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-extrabold text-sm"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Allowed: ₹{(currentSelectedScheme?.minAmount || 500).toLocaleString('en-IN')} to ₹
                    {(currentSelectedScheme?.maxAmount || 5000000).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-indigo-700 font-semibold">Interest Rate:</span>
                    <span className="font-extrabold text-indigo-900">{interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-indigo-700 font-semibold">Tenure:</span>
                    <span className="font-extrabold text-indigo-900">{tenureMonths} Months</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-indigo-200/60">
                    <span className="text-[11px] text-indigo-800 font-bold">
                      {activeTab === 'MIS' ? 'Monthly Interest Payout:' : 'Estimated Maturity Value:'}
                    </span>
                    <span className="text-lg font-extrabold text-indigo-950">
                      ₹ {calculateMaturity(activeTab, invAmount, tenureMonths, interestRate).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Razorpay Option */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">Pay via Razorpay Gateway</span>
                      <span className="text-[10px] text-slate-500">Instant online receipt & auto collection</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={payViaRazorpay}
                    onChange={(e) => setPayViaRazorpay(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 disabled:opacity-60"
                  >
                    {isProcessingPayment ? 'Processing...' : 'Pay & Confirm Investment'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
