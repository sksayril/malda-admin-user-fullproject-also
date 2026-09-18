'use client';

import React, { useState } from 'react';
import { Share2, CheckCircle2, Clock, Award, Wallet, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { MlmLevelStat } from '@/types';

interface MlmCommissionViewProps {
  levels: MlmLevelStat[];
}

export default function MlmCommissionView({ levels }: MlmCommissionViewProps) {
  const [activeTab, setActiveTab] = useState<'LevelWise' | 'AgentWise'>('LevelWise');

  const fullLevels: MlmLevelStat[] = [
    { level: 1, members: 25, commission: 120000, status: 'Paid' },
    { level: 2, members: 50, commission: 160000, status: 'Paid' },
    { level: 3, members: 120, commission: 90000, status: 'Pending' },
    { level: 4, members: 200, commission: 80000, status: 'Pending' },
    { level: 5, members: 350, commission: 50000, status: 'Pending' },
    { level: 6, members: 480, commission: 35000, status: 'Pending' },
    { level: 7, members: 620, commission: 25000, status: 'Pending' },
    { level: 8, members: 810, commission: 18000, status: 'Pending' },
    { level: 9, members: 950, commission: 12000, status: 'Pending' },
    { level: 10, members: 1100, commission: 8000, status: 'Pending' },
    { level: 11, members: 1350, commission: 5000, status: 'Pending' },
    { level: 12, members: 1500, commission: 3000, status: 'Pending' },
    { level: 13, members: 1800, commission: 2000, status: 'Pending' },
    { level: 14, members: 2100, commission: 1500, status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Title Bar (Matching Screen 14) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Commission Summary
          </h1>
          <p className="text-xs text-slate-500">
            14-Level cooperative multi-tier affiliate compensation and wallet disbursement
          </p>
        </div>

        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold self-start sm:self-auto flex items-center gap-1.5 border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>L1-L14 MLM Engine Active</span>
        </span>
      </div>

      {/* Summary KPI Cards (Matching Screen 14 top cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Commission */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Total Commission</span>
          <div className="text-2xl font-bold text-blue-600">₹ 5,00,000</div>
          <span className="text-[11px] text-slate-400">Total Accrued</span>
        </div>

        {/* Paid */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Paid</span>
          <div className="text-2xl font-bold text-emerald-600">₹ 4,50,000</div>
          <span className="text-[11px] text-emerald-600 font-medium">90% Successfully Settled</span>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Pending</span>
          <div className="text-2xl font-bold text-rose-500">₹ 50,000</div>
          <span className="text-[11px] text-rose-500 font-medium">Awaiting Monthly Cycle</span>
        </div>
      </div>

      {/* Tabs (Level Wise / Agent Wise - Matching Screen 14) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('LevelWise')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'LevelWise'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Level Wise
        </button>
        <button
          onClick={() => setActiveTab('AgentWise')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'AgentWise'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Agent Wise
        </button>
      </div>

      {/* Table (Matching Screen 14) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4 text-center">Members</th>
                <th className="py-3.5 px-4">Commission</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Access Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {fullLevels.slice(0, 8).map((row) => (
                <tr key={row.level} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Level {row.level}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-blue-600">
                    {row.members}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₹ {row.commission.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        row.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}
                    >
                      {row.status === 'Paid' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[11px] text-slate-400 font-normal">
                      {row.level <= 12 ? 'Member & Admin (L1-L12)' : 'Super Admin Only (L13-L14)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Displaying 8 of 14 MLM Hierarchy Levels</span>
          <button
            onClick={() => alert('Full 14 levels calculation processed.')}
            className="text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            Calculate Instant Payout
          </button>
        </div>
      </div>
    </div>
  );
}
