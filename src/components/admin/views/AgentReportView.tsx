'use client';

import React from 'react';
import { ArrowLeft, Users, TrendingUp, Calendar, Download } from 'lucide-react';
import { Agent } from '@/types';

interface AgentReportViewProps {
  agents: Agent[];
  onBack: () => void;
}

export default function AgentReportView({ agents, onBack }: AgentReportViewProps) {
  return (
    <div className="space-y-6">
      {/* Header & Date Range (Matching Screen 12) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Agent Wise Collection
            </h1>
            <p className="text-xs text-slate-500">
              Field recovery targets, collected volumes, and performance quotas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>01 Sep 2026 - 18 Sep 2026</span>
          </div>
          <button
            onClick={() => alert('Agent performance report downloaded as CSV')}
            className="px-3.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table (Matching Screen 12) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Agent</th>
                <th className="py-3.5 px-4">Total Collection</th>
                <th className="py-3.5 px-4 text-center">Transactions</th>
                <th className="py-3.5 px-4">Target</th>
                <th className="py-3.5 px-4 text-center">Achievement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-[11px]">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <span>{agent.name}</span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {agent.branch}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{agent.totalCollection}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-blue-600">
                    {agent.transactions}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{agent.target}</td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-2 w-28">
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            (agent.achievementRate || 0) >= 80
                              ? 'bg-emerald-500'
                              : (agent.achievementRate || 0) >= 60
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${agent.achievementRate || 0}%` }}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-bold ${
                          (agent.achievementRate || 0) >= 80
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {agent.achievementRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
