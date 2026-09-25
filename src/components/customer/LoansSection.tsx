'use client';

import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Store,
  Sparkles,
  CreditCard,
  ShieldCheck,
  X,
} from 'lucide-react';
import { LoanApplication, ProductScheme } from '@/types';
import { INITIAL_SCHEMES } from '@/data/mockData';

interface LoansSectionProps {
  loans: LoanApplication[];
  onApplyLoan?: (loan: LoanApplication) => void;
  customerName: string;
  customerId: string;
}

export default function LoansSection({
  loans,
  onApplyLoan,
  customerName,
  customerId,
}: LoansSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminSchemes, setAdminSchemes] = useState<ProductScheme[]>(INITIAL_SCHEMES);
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>('SCH-LN-01');
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [payViaRazorpay, setPayViaRazorpay] = useState<boolean>(true);
  const [isPayingDaily, setIsPayingDaily] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/schemes?active=true&category=LOAN')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setAdminSchemes(res.data);
      })
      .catch((err) => console.warn('Error loading loan schemes:', err));
  }, []);

  const loanSchemes = adminSchemes.filter((s) => s.category === 'LOAN' && s.status === 'Active');
  const selectedScheme = loanSchemes.find((s) => s.code === selectedSchemeCode) || loanSchemes[0];

  const interestRate = selectedScheme ? selectedScheme.interestRate : 12.0;
  const tenureMonths = selectedScheme ? selectedScheme.tenureMonths : 12;
  const isDaily = selectedScheme?.isDailyLoan || false;

  // Daily loans vs regular loans
  const regularLoans = loans.filter((l) => l.loanType !== 'Daily Loan');
  const dailyLoans = loans.filter((l) => l.loanType === 'Daily Loan');

  const calculateEmi = (daily: boolean, amount: number, tenure: number, rate: number) => {
    if (daily) {
      return Math.round((amount * 1.1) / 100);
    }
    const r = rate / 1200;
    const emi = (amount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1);
    return Math.round(emi);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const emi = calculateEmi(isDaily, loanAmount, tenureMonths, interestRate);

    const newLoan: LoanApplication = {
      id: String(Date.now()),
      loanId: `LN${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      customerId,
      loanType: isDaily ? 'Daily Loan' : (selectedScheme?.name as any) || 'Personal Loan',
      amount: loanAmount,
      tenureMonths: isDaily ? 3 : tenureMonths,
      interestRate,
      monthlyEmi: isDaily ? emi * 30 : emi,
      appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Approved',
      step: 'Disbursement',
      paidEmis: 0,
      totalEmis: isDaily ? 0 : tenureMonths,
      lateFee: 0,
      isDailyLoan: isDaily,
      dailyInstallment: isDaily ? emi : 0,
      daysTotal: isDaily ? 100 : 0,
      daysPaid: 0,
    };

    if (onApplyLoan) {
      onApplyLoan(newLoan);
    }
    setIsModalOpen(false);
  };

  // Pay daily loan installment via Razorpay
  const handlePayDailyInstallment = async (dLoan: LoanApplication) => {
    const dailyEmi = dLoan.dailyInstallment || Math.round((dLoan.amount * 1.1) / 100);
    setIsPayingDaily(dLoan.loanId);

    try {
      const verifyRes = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: `pay_rzp_daily_${Date.now()}`,
          orderId: `order_daily_${Date.now()}`,
          customerId,
          customerName,
          amount: dailyEmi,
          type: 'DAILY_LOAN',
          schemeCode: 'SCH-LN-DAILY',
          loanId: dLoan.loanId,
        }),
      });
      const data = await verifyRes.json();
      if (data.success) {
        alert(`✓ Razorpay Payment Verified! Receipt #${data.data.receiptNo} generated for ₹${dailyEmi}. Agent commission credited automatically!`);
        dLoan.daysPaid = (dLoan.daysPaid || 0) + 1;
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsPayingDaily(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily Market Loan Highlight Card */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50/40 rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Daily Market & Vendor Loan (দৈনিক ঋণ)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                  Micro-Finance
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Admin approved 100-day doorstep daily collection scheme with Razorpay auto-pay
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const dailySch = loanSchemes.find((s) => s.isDailyLoan);
              if (dailySch) setSelectedSchemeCode(dailySch.code);
              setLoanAmount(20000);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Daily Loan</span>
          </button>
        </div>

        {dailyLoans.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-amber-200/60 text-center">
            <p className="text-xs text-slate-600 font-medium">
              No active Daily Loan registered. Choose an admin offer (₹10,000 to ₹50,000) with daily ₹100 - ₹500 collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyLoans.map((dLoan) => {
              const daysPaid = dLoan.daysPaid || 28;
              const daysTotal = dLoan.daysTotal || 100;
              const percentage = Math.min(100, Math.round((daysPaid / daysTotal) * 100));
              const dailyEmi = dLoan.dailyInstallment || Math.round((dLoan.amount * 1.1) / 100);
              const balanceRemaining = Math.max(0, (daysTotal - daysPaid) * dailyEmi);

              return (
                <div
                  key={dLoan.id}
                  className="bg-white p-5 rounded-2xl border border-amber-200/90 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                        {dLoan.loanId}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {dLoan.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-slate-500 text-[11px] block">Daily Installment</span>
                        <span className="text-base font-extrabold text-slate-900">₹ {dailyEmi} / day</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Balance Remaining</span>
                        <span className="text-base font-extrabold text-amber-700">
                          ₹ {balanceRemaining.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mt-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span>Repayment Progress</span>
                        <span>{daysPaid} / {daysTotal} Days ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Collected Daily by Agent / Razorpay</span>
                    <button
                      type="button"
                      disabled={isPayingDaily === dLoan.loanId}
                      onClick={() => handlePayDailyInstallment(dLoan)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{isPayingDaily === dLoan.loanId ? 'Processing...' : `Pay Today ₹${dailyEmi}`}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Standard Loans (Personal, Business, Emergency) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-600" />
              <span>Standard Term Loans (Admin Active Offers)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Personal, Business & Emergency credit facilities with transparent monthly EMI schedule
            </p>
          </div>

          <button
            onClick={() => {
              if (loanSchemes.length > 0) setSelectedSchemeCode(loanSchemes[0].code);
              setLoanAmount(50000);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Apply New Loan</span>
          </button>
        </div>

        {/* Live Admin Loan Offers Preview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {loanSchemes.map((sch) => (
            <div
              key={sch.code}
              onClick={() => {
                setSelectedSchemeCode(sch.code);
                setIsModalOpen(true);
              }}
              className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 hover:border-blue-400 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">{sch.name}</span>
                  <span className="font-extrabold text-blue-700 text-xs">{sch.interestRate}%</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{sch.description}</p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-blue-200/50 flex items-center justify-between text-[10px]">
                <span className="text-slate-600">Tenure: {sch.isDailyLoan ? '100 Days' : `${sch.tenureMonths} Mo`}</span>
                <span className="font-bold text-blue-600">Apply Now →</span>
              </div>
            </div>
          ))}
        </div>

        {regularLoans.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <p className="text-xs text-slate-500 mb-2">No active standard loans found.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Apply for a Personal or Business loan today
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regularLoans.map((loan) => {
              const paid = loan.paidEmis || 3;
              const total = loan.totalEmis || loan.tenureMonths || 12;
              const emiPercentage = Math.round((paid / total) * 100);

              return (
                <div
                  key={loan.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
                          {loan.loanId}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{loan.loanType}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {loan.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-slate-500 text-[11px] block">Loan Amount</span>
                        <span className="text-sm font-extrabold text-slate-900">
                          ₹ {loan.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Monthly EMI</span>
                        <span className="text-sm font-extrabold text-blue-700">
                          ₹ {loan.monthlyEmi.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Interest Rate</span>
                        <span className="text-sm font-extrabold text-slate-800">{loan.interestRate}% p.a.</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                        <span>EMIs Paid: {paid} of {total}</span>
                        <span>{emiPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${emiPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Applied: {loan.appliedDate}</span>
                    <button
                      type="button"
                      onClick={() => alert(`Receipt downloaded for Loan ${loan.loanId}`)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Download Schedule
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Applying Loan with Admin Schemes */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-base font-bold text-slate-900">Apply for Credit / Loan</h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Admin-Approved Loan Scheme *
                </label>
                <select
                  value={selectedSchemeCode}
                  onChange={(e) => setSelectedSchemeCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  {loanSchemes.map((sch) => (
                    <option key={sch.code} value={sch.code}>
                      {sch.name} ({sch.interestRate}% p.a. • {sch.isDailyLoan ? '100 Days Daily' : `${sch.tenureMonths} Months`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loan Amount (₹)</label>
                <input
                  type="number"
                  required
                  min={selectedScheme?.minAmount || 5000}
                  max={selectedScheme?.maxAmount || 1000000}
                  step="1000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Allowed: ₹{(selectedScheme?.minAmount || 5000).toLocaleString('en-IN')} to ₹
                  {(selectedScheme?.maxAmount || 1000000).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
                <span className="text-[11px] text-blue-700 font-semibold block">
                  {isDaily ? 'Estimated Daily Collection' : 'Estimated Monthly EMI'}
                </span>
                <span className="text-xl font-extrabold text-blue-900 mt-1 block">
                  ₹ {calculateEmi(isDaily, loanAmount, tenureMonths, interestRate).toLocaleString('en-IN')}{' '}
                  {isDaily ? '/ day' : '/ month'}
                </span>
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
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
