'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Clock, Calendar, Info, Calculator, CheckCircle2 } from 'lucide-react';

export default function LatePaymentChart() {
  const [testDaysLate, setTestDaysLate] = useState<number>(0);
  const [testEmiAmount, setTestEmiAmount] = useState<number>(3000);

  // Late penalty tiers
  const penaltyTiers = [
    {
      range: '1 - 3 Days',
      title: 'Grace Period',
      penalty: '₹0 (No Penalty)',
      rate: '0.0%',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: 'SMS Reminder & Email alert',
      status: 'Clean Track Record',
    },
    {
      range: '4 - 10 Days',
      title: 'Minor Overdue',
      penalty: '₹150 Flat Fine',
      rate: '1.5% per month',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      action: 'Field Agent automated alert',
      status: 'Warning Notice',
    },
    {
      range: '11 - 30 Days',
      title: 'Moderate Default',
      penalty: '₹350 Fine + 2.0% Interest',
      rate: '2.0% per month',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      action: 'Agent home visit & Score impact (-25 pts)',
      status: 'Moderate Penalty',
    },
    {
      range: '31+ Days',
      title: 'Severe Default / NPA',
      penalty: '₹750 Fine + 3.5% Overdue',
      rate: '3.5% per month',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      action: 'Legal Demand Notice & Score drop (-65 pts)',
      status: 'Critical Alert',
    },
  ];

  // Dynamic calculator computation
  const calculateFee = () => {
    if (testDaysLate <= 0) return { fee: 0, interest: 0, total: 0, tier: 'On Time' };
    if (testDaysLate <= 3) return { fee: 0, interest: 0, total: 0, tier: 'Grace Period (0-3 days)' };
    if (testDaysLate <= 10) {
      const fee = 150;
      const interest = Math.round((testEmiAmount * 0.015 * testDaysLate) / 30);
      return { fee, interest, total: fee + interest, tier: 'Minor Overdue' };
    }
    if (testDaysLate <= 30) {
      const fee = 350;
      const interest = Math.round((testEmiAmount * 0.02 * testDaysLate) / 30);
      return { fee, interest, total: fee + interest, tier: 'Moderate Default' };
    }
    const fee = 750;
    const interest = Math.round((testEmiAmount * 0.035 * testDaysLate) / 30);
    return { fee, interest, total: fee + interest, tier: 'Severe Default / NPA' };
  };

  const penaltyResult = calculateFee();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Late Payment Penalty & Schedule Chart
            </h3>
            <p className="text-xs text-slate-500">
              Clear society rules regarding overdue installments, grace windows & penalty fees
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Transparent Bylaws</span>
        </div>
      </div>

      {/* Slabs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {penaltyTiers.map((tier, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-blue-300 hover:bg-blue-50/20 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-900">{tier.range}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${tier.badgeColor}`}>
                  {tier.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">{tier.title}</h4>
              <p className="text-xs font-extrabold text-blue-700 mt-1">{tier.penalty}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Interest: {tier.rate}</p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[11px] text-slate-600 leading-tight">
              {tier.action}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Late Fee Calculator */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-4 h-4 text-sky-400" />
          <h4 className="text-xs sm:text-sm font-bold tracking-tight">
            Live Late Penalty Fee Calculator
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">EMI Amount (₹)</label>
            <input
              type="number"
              value={testEmiAmount}
              onChange={(e) => setTestEmiAmount(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Days Overdue (Late)</label>
            <input
              type="number"
              min="0"
              max="90"
              value={testDaysLate}
              onChange={(e) => setTestDaysLate(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/15 flex flex-col justify-center">
            <span className="text-[11px] text-slate-300">Estimated Total Penalty</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-extrabold text-amber-300">
                ₹ {penaltyResult.total.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-300">({penaltyResult.tier})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
