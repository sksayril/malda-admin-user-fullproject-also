'use client';

import React from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  CreditCard,
  PiggyBank,
  Receipt,
  FileText,
  Plus,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import { Customer } from '@/types';
import { AdminViewId } from '../AdminSidebar';

interface CustomerDetailsViewProps {
  customer: Customer;
  onBack: () => void;
  onNavigate: (view: AdminViewId) => void;
  onQuickAction: (action: string) => void;
}

export default function CustomerDetailsView({
  customer,
  onBack,
  onNavigate,
  onQuickAction,
}: CustomerDetailsViewProps) {
  return (
    <div className="space-y-6">
      {/* Back Button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Customer Profile
          </h1>
          <p className="text-xs text-slate-500">
            Account overview, KYC verification status, and financial product linkages
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout (Matching Screen 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-blue-500/20">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{customer.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {customer.status}
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-600">ID: {customer.customerId}</span>
            </div>
          </div>

          {/* Profile Details List */}
          <div className="space-y-3.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> Mobile
              </span>
              <span className="font-semibold text-slate-800">{customer.mobile}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Email
              </span>
              <span className="font-semibold text-slate-800">{customer.email}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Address
              </span>
              <span className="font-semibold text-slate-800 text-right">{customer.address}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Date of Birth
              </span>
              <span className="font-semibold text-slate-800">{customer.dob}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> KYC Status
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {customer.kycStatus}
              </span>
            </div>
          </div>

          {/* Quick Actions (Matching Screen 7 bottom of profile card) */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-700 mb-2.5">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onQuickAction('loan')}
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Loan</span>
              </button>
              <button
                onClick={() => onQuickAction('fd')}
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New FD</span>
              </button>
              <button
                onClick={() => onQuickAction('rd')}
                className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New RD</span>
              </button>
              <button
                onClick={() => onQuickAction('collect')}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Collect Payment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Stat Cards (Matching Screen 7 right side) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Accounts */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Accounts</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{customer.accountsCount}</div>
              <span className="text-[10px] text-slate-400">Linked Portfolios</span>
            </div>

            {/* Loans */}
            <div
              onClick={() => onNavigate('loans')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-300 transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Loans</span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{customer.loansCount}</div>
              <span className="text-[10px] text-sky-600 font-medium flex items-center gap-1">
                View Loan <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Deposits */}
            <div
              onClick={() => onNavigate('deposits')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-purple-300 transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Deposits</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <PiggyBank className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{customer.depositsCount}</div>
              <span className="text-[10px] text-purple-600 font-medium flex items-center gap-1">
                View Deposits <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Collections */}
            <div
              onClick={() => onNavigate('collections')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Collections</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{customer.collectionsCount}</div>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                Transaction History <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Documents */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Documents</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{customer.documentsCount}</div>
              <span className="text-[10px] text-slate-400">Aadhaar, PAN & Form 60</span>
            </div>
          </div>

          {/* Customer Activity Feed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Account Activity</h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div>
                    <span className="font-semibold text-slate-800">EMI Payment Received</span>
                    <p className="text-[11px] text-slate-400">Receipt #RC001 via UPI (₹ 2,350)</p>
                  </div>
                </div>
                <span className="text-slate-400">Today, 10:30 AM</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <span className="font-semibold text-slate-800">KYC Verification Completed</span>
                    <p className="text-[11px] text-slate-400">Verified by Super Admin</p>
                  </div>
                </div>
                <span className="text-slate-400">18 Sep 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
