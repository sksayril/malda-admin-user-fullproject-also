'use client';

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Building,
  GitFork,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  PiggyBank,
  TrendingUp,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  FileCheck,
} from 'lucide-react';
import { AdminViewId } from '../AdminSidebar';

interface DashboardViewProps {
  onNavigate: (view: AdminViewId) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const [timeRange, setTimeRange] = useState('01 Sep 2026 - 30 Sep 2026');

  return (
    <div className="space-y-6">
      {/* Top Title & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Real-time cooperative credit and financial overview
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeRange}</span>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1"
          >
            <span>Export</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 1 KPI Cards (Total Customers, Active Customers, Total Agents, Branches) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div
          onClick={() => onNavigate('customers')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Total Customers</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">12,458</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+8.4% from last month</span>
          </div>
        </div>

        {/* Active Customers */}
        <div
          onClick={() => onNavigate('customers')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Active Customers</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">8,970</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <span>72% active portfolio</span>
          </div>
        </div>

        {/* Total Agents */}
        <div
          onClick={() => onNavigate('agents')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Total Agents</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">1,250</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-purple-600 font-medium">
            <span>890 on field today</span>
          </div>
        </div>

        {/* Branches */}
        <div
          onClick={() => onNavigate('branches')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Branches</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition">
              <GitFork className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">26</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-sky-600 font-medium">
            <span>5 Regional Hubs</span>
          </div>
        </div>
      </div>

      {/* Row 2 KPI Cards (Loan Applications, Approved Loans, Disbursed, Total Collection) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Loan Applications */}
        <div
          onClick={() => onNavigate('loans')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Loan Applications</span>
            <FileCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">1,245</div>
          <span className="text-[10px] text-indigo-600 font-medium">+15 new today</span>
        </div>

        {/* Approved Loans */}
        <div
          onClick={() => onNavigate('loans')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Approved Loans</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">990</div>
          <span className="text-[10px] text-emerald-600 font-medium">79.5% approval rate</span>
        </div>

        {/* Disbursed Loans */}
        <div
          onClick={() => onNavigate('loans')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Disbursed Loans</span>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">950</div>
          <span className="text-[10px] text-amber-600 font-medium">Direct Bank Transfer</span>
        </div>

        {/* Total Collection */}
        <div
          onClick={() => onNavigate('collections')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Collection</span>
            <ArrowDownRight className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">₹ 12.5 Cr</div>
          <span className="text-[10px] text-blue-600 font-medium">Monthly volume</span>
        </div>
      </div>

      {/* Row 3 Financial Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-2xl text-white shadow-sm">
          <div className="flex items-center justify-between mb-1 text-slate-300 text-xs">
            <span>Outstanding</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-lg font-bold text-white">₹ 5.8 Cr</div>
          <span className="text-[10px] text-slate-400">Total active credit</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-1 text-slate-500 text-xs">
            <span>FD Total</span>
            <PiggyBank className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-lg font-bold text-slate-900">₹ 3.2 Cr</div>
          <span className="text-[10px] text-purple-600">8.5% avg returns</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-1 text-slate-500 text-xs">
            <span>RD Total</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-lg font-bold text-slate-900">₹ 1.8 Cr</div>
          <span className="text-[10px] text-sky-600">Monthly recurring</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-1 text-slate-500 text-xs">
            <span>MIS Total</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-slate-900">₹ 85.0 L</div>
          <span className="text-[10px] text-emerald-600">Monthly income plan</span>
        </div>
      </div>

      {/* Row 4 Charts (Collection Overview & Customer Type - Matching Screen 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Overview Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Collection Overview</h2>
              <p className="text-xs text-slate-400">Monthly cash vs digital collections</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
              FY 2026-27
            </span>
          </div>

          {/* SVG Area/Bar Graph */}
          <div className="h-56 w-full pt-4">
            <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" />

              {/* Area */}
              <path
                d="M 20 140 Q 60 120 100 95 T 180 70 T 260 50 T 340 85 T 420 40 T 480 30 L 480 150 L 20 150 Z"
                fill="url(#areaGradient)"
              />

              {/* Line */}
              <path
                d="M 20 140 Q 60 120 100 95 T 180 70 T 260 50 T 340 85 T 420 40 T 480 30"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data points */}
              {[
                { x: 20, y: 140, m: 'Jan' },
                { x: 100, y: 95, m: 'Mar' },
                { x: 180, y: 70, m: 'May' },
                { x: 260, y: 50, m: 'Jul' },
                { x: 340, y: 85, m: 'Sep' },
                { x: 420, y: 40, m: 'Nov' },
                { x: 480, y: 30, m: 'Dec' },
              ].map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                  <text x={pt.x} y="170" textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="500">
                    {pt.m}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Customer Type Donut Chart (1 col - Matching Screen 2) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Customer Type</h2>
            <p className="text-xs text-slate-400">Account category distribution</p>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            {/* Donut graphic */}
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="14" />
              {/* Main Active 70% segment */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#2563eb"
                strokeWidth="14"
                strokeDasharray="238.7"
                strokeDashoffset="71.6"
                strokeLinecap="round"
              />
              {/* Secondary segment */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#10b981"
                strokeWidth="14"
                strokeDasharray="238.7"
                strokeDashoffset="190"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">70%</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Active
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-slate-600">Loan (45%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600">FD (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-slate-600">RD (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-slate-600">MIS (10%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
