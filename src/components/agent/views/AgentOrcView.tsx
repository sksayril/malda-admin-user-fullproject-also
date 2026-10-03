'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Users,
  Calendar,
  Search,
  Download,
  Share2,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import { Agent } from '@/types';

interface AgentOrcViewProps {
  agent: Agent;
}

export default function AgentOrcView({ agent }: AgentOrcViewProps) {
  const [activeTab, setActiveTab] = useState<'ownOrc' | 'downAgentOrc'>('ownOrc');
  const [selectedMonth, setSelectedMonth] = useState('AUG 2026');
  const [collectorCode, setCollectorCode] = useState(agent.agentId || 'KNM00006282');
  const [showOwnTable, setShowOwnTable] = useState(true);
  const [showDownTable, setShowDownTable] = useState(true);

  const monthsList = [
    'OCT 2026',
    'SEP 2026',
    'AUG 2026',
    'JULY 2026',
    'JUNE 2026',
    'MAY 2026',
    'APRIL 2026',
    'MARCH 2026',
    'FEB 2026',
    'JAN 2026',
    'DEC 2025',
    'NOV 2025',
  ];

  // Downline ORC exact data matches video!
  const downlineOrcData = [
    { code: 'KNM00000090', name: 'KRISHNA DAS', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 180, tInc: 15.75, netPayment: 15.75 },
    { code: 'KNM00006304', name: 'KESHAB MANDAL', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 4441820, tInc: 18875.59, netPayment: 18875.59 },
    { code: 'KNM00006368', name: 'RINA BISWAS', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 14900, tInc: 52.15, netPayment: 52.15 },
    { code: 'KNM00006605', name: 'JAYANTA CHOWDHURY', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 2315160, tInc: 23330.49, netPayment: 23330.49 },
    { code: 'KNM00006753', name: 'ALPANA DAS', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 32650, tInc: 286.4, netPayment: 286.4 },
    { code: 'KNM00006784', name: 'JAHAR LAL CHOWDHURY', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 1065750, tInc: 5762.57, netPayment: 5762.57 },
    { code: 'KNM00006821', name: 'BISWA BARAI', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 40070, tInc: 1713.25, netPayment: 1713.25 },
    { code: 'KNM00006822', name: 'SANJIB CHOWDHURY', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 1971190, tInc: 14160.82, netPayment: 14160.82 },
    { code: 'KNM00007096', name: 'ANJALI SARDAR', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 1818040, tInc: 63865.39, netPayment: 63865.39 },
    { code: 'KNM00007167', name: 'SOMEN BALA', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 10800, tInc: 54, netPayment: 54 },
    { code: 'KNM00007532', name: 'CHINMAY ROY', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 254650, tInc: 10544.45, netPayment: 10544.45 },
    { code: 'KNM00007591', name: 'SUKUMAR SINGHA', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 30400, tInc: 106.4, netPayment: 106.4 },
    { code: 'KNM00007614', name: 'HOROPRASAD MAHATO', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 1315940, tInc: 8657.33, netPayment: 8657.33 },
    { code: 'KNM00007742', name: 'BIBEKANANDA MAJUMDAR', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 380720, tInc: 3275.22, netPayment: 3275.22 },
    { code: 'KNM00007743', name: 'BANKIM MANDAL', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 123120, tInc: 715.43, netPayment: 715.43 },
    { code: 'KNM00007899', name: 'PINKU PRAMANIK', fDate: '01/08/2026', tDate: '31/08/2026', tBiz: 901240, tInc: 8727.15, netPayment: 8727.15 },
  ];

  return (
    <div className="space-y-6">
      {/* 2 Main Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('ownOrc')}
          className={`p-5 rounded-3xl border text-left transition flex items-center justify-between cursor-pointer ${
            activeTab === 'ownOrc'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25'
              : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <span
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                activeTab === 'ownOrc' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              <TrendingUp className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">Personal Incentive</span>
              <h4 className="text-base font-extrabold">View Own ORC</h4>
              <p className={`text-xs mt-0.5 ${activeTab === 'ownOrc' ? 'text-indigo-100' : 'text-slate-500'}`}>
                Monthly Self & Chain Business Incentive
              </p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${activeTab === 'ownOrc' ? 'text-white' : 'text-slate-400'}`} />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('downAgentOrc')}
          className={`p-5 rounded-3xl border text-left transition flex items-center justify-between cursor-pointer ${
            activeTab === 'downAgentOrc'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 shadow-lg shadow-purple-500/25'
              : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <span
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                activeTab === 'downAgentOrc' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'
              }`}
            >
              <Users className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">Team Override</span>
              <h4 className="text-base font-extrabold">View Down Agent ORC</h4>
              <p className={`text-xs mt-0.5 ${activeTab === 'downAgentOrc' ? 'text-purple-100' : 'text-slate-500'}`}>
                Downline Team Incentive & Net Payouts
              </p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${activeTab === 'downAgentOrc' ? 'text-white' : 'text-slate-400'}`} />
        </button>
      </div>

      {/* 1. View Own ORC */}
      {activeTab === 'ownOrc' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span>Over-Riding Commission (ORC) - Self Statement</span>
              </h3>
              <p className="text-xs text-slate-500">Calculate month-wise turnover and earned overrides</p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">V-Month *</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-indigo-700"
              >
                {monthsList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Collector Code</label>
              <input
                type="text"
                readOnly
                value={collectorCode}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-700"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setShowOwnTable(true)}
                className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-pink-500/25 cursor-pointer"
              >
                SHOW ORC STATEMENT
              </button>
            </div>
          </div>

          {/* Result Table from Video */}
          {showOwnTable && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-pink-600 text-white uppercase font-bold text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">From Date</th>
                      <th className="py-3 px-4">To Date</th>
                      <th className="py-3 px-4 text-right">Total Biz (₹)</th>
                      <th className="py-3 px-4 text-right">Self Biz (₹)</th>
                      <th className="py-3 px-4 text-right">Chain Biz (₹)</th>
                      <th className="py-3 px-4 text-right">Total Inc. (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium bg-white">
                    <tr>
                      <td className="py-4 px-4 font-mono">01/08/2026</td>
                      <td className="py-4 px-4 font-mono">31/08/2026</td>
                      <td className="py-4 px-4 text-right font-mono font-extrabold text-slate-900 text-sm">
                        57,75,030.00
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-500">0.00</td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-indigo-700">
                        57,750.50
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-extrabold text-emerald-600 text-base">
                        ₹ 23,649.23
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Commission Breakdown Highlight */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-indigo-200 block">Total Net Incentive for {selectedMonth}</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">₹ 23,649.23</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print ORC Slip</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. View Down Agent ORC */}
      {activeTab === 'downAgentOrc' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Downline Sub-Agent ORC & Team Volume Ledger</span>
              </h3>
              <p className="text-xs text-slate-500">Track incentives generated by subordinate field collectors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">V-Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-purple-700"
              >
                {monthsList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Collector Code</label>
              <input
                type="text"
                readOnly
                value={collectorCode}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-700"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setShowDownTable(true)}
                className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-pink-500/25 cursor-pointer"
              >
                SHOW DOWNLINE ORC
              </button>
            </div>
          </div>

          {showDownTable && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-pink-600 text-white uppercase font-bold text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Collector Code</th>
                      <th className="py-3 px-4">Collector Name</th>
                      <th className="py-3 px-4">FDate</th>
                      <th className="py-3 px-4">TDate</th>
                      <th className="py-3 px-4 text-right">TBusiness</th>
                      <th className="py-3 px-4 text-right">TInc</th>
                      <th className="py-3 px-4 text-right">Net Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {downlineOrcData.map((row) => (
                      <tr key={row.code} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-extrabold text-indigo-700">{row.code}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{row.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{row.fDate}</td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{row.tDate}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                          {row.tBiz.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-indigo-700">
                          {row.tInc.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-600">
                          ₹ {row.netPayment.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
