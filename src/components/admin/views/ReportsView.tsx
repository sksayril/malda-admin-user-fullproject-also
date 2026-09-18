'use client';

import React from 'react';
import {
  Receipt,
  CreditCard,
  PiggyBank,
  Clock,
  TrendingUp,
  Award,
  GitFork,
  Calendar,
  Share2,
  FileText,
  Download,
  Printer,
  ChevronRight,
} from 'lucide-react';

export default function ReportsView() {
  const reportsList = [
    { id: '1', title: 'Collection Report', desc: 'Daily, weekly and monthly field collection logs', icon: Receipt, color: 'text-blue-600 bg-blue-50' },
    { id: '2', title: 'Loan Report', desc: 'Active portfolios, overdue EMIs, recovery status', icon: CreditCard, color: 'text-amber-600 bg-amber-50' },
    { id: '3', title: 'FD Report', desc: 'Fixed deposit maturity schedule & interest liability', icon: PiggyBank, color: 'text-purple-600 bg-purple-50' },
    { id: '4', title: 'RD Report', desc: 'Recurring deposit collections & missed installments', icon: Clock, color: 'text-emerald-600 bg-emerald-50' },
    { id: '5', title: 'MIS Report', desc: 'Monthly income scheme payouts and schedule', icon: TrendingUp, color: 'text-sky-600 bg-sky-50' },
    { id: '6', title: 'Agent Performance', desc: 'Quotas, business targets, and collection rates', icon: Award, color: 'text-indigo-600 bg-indigo-50' },
    { id: '7', title: 'Branch Wise Report', desc: 'Branch-level revenue, expenses & profit metrics', icon: GitFork, color: 'text-cyan-600 bg-cyan-50' },
    { id: '8', title: 'Maturity Report', desc: 'Upcoming 30/60/90-day maturity settlements', icon: Calendar, color: 'text-rose-600 bg-rose-50' },
    { id: '9', title: 'Commission Report', desc: '14-tier affiliate commission payout breakdown', icon: Share2, color: 'text-orange-600 bg-orange-50' },
    { id: '10', title: 'Customer Statement', desc: 'Consolidated customer passbook & ledger history', icon: FileText, color: 'text-blue-600 bg-blue-50' },
  ];

  const handleDownload = (name: string) => {
    alert(`Generating ${name} PDF & CSV export from Amazon S3 repository...`);
  };

  return (
    <div className="space-y-6">
      {/* Header (Matching Screen 16) */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Reports
        </h1>
        <p className="text-xs text-slate-500">
          Financial audits, statutory compliance returns, account statements and analytical exports
        </p>
      </div>

      {/* Grid of 10 Report Cards (Matching Screen 16) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {reportsList.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <button
                  onClick={() => handleDownload(item.title)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition cursor-pointer"
                  title="Download CSV/PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
