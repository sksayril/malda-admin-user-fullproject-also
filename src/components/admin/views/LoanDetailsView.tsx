'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  CreditCard,
  Building,
  Calendar,
  Percent,
  FileText,
  X,
  Printer,
  Download,
} from 'lucide-react';
import { LoanApplication } from '@/types';

interface LoanDetailsViewProps {
  loan: LoanApplication;
  onBack: () => void;
  onUpdateStatus: (id: string, newStatus: LoanApplication['status'], step: LoanApplication['step']) => void;
}

export default function LoanDetailsView({
  loan,
  onBack,
  onUpdateStatus,
}: LoanDetailsViewProps) {
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);

  const steps: LoanApplication['step'][] = [
    'Application',
    'Documents',
    'Verification',
    'Approval',
    'Disbursement',
  ];

  const currentStepIndex = steps.indexOf(loan.step);

  return (
    <div className="space-y-6">
      {/* Back & Title Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Loan Application Details
          </h1>
          <p className="text-xs text-slate-500">
            Review applicant financials, KYC validation, sanction approval and disbursement
          </p>
        </div>
      </div>

      {/* Stepper (Matching Screen 9) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between overflow-x-auto py-2">
          {steps.map((step, idx) => {
            const isDone = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step} className="flex items-center gap-2 shrink-0 px-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    isDone
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? 'text-blue-600'
                      : isDone
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step}
                </span>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 hidden sm:block ${
                      idx < currentStepIndex ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Details & Actions (Matching Screen 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Loan Details Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Sanctioned Proposal
              </span>
              <h2 className="text-xl font-bold text-slate-900">{loan.loanId}</h2>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                {loan.status}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Applied: {loan.appliedDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-1">Customer</span>
              <span className="font-bold text-slate-900 text-sm">{loan.customerName}</span>
              <span className="text-[11px] text-slate-500 block">ID: {loan.customerId}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-1">Loan Type</span>
              <span className="font-bold text-slate-900 text-sm">{loan.loanType}</span>
              <span className="text-[11px] text-slate-500 block">Personal Credit</span>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-blue-600 block mb-1 font-semibold">Loan Amount</span>
              <span className="font-bold text-blue-900 text-base">
                ₹ {loan.amount.toLocaleString()}
              </span>
              <span className="text-[11px] text-blue-600/70 block">Principal</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-1">Tenure</span>
              <span className="font-bold text-slate-900 text-sm">{loan.tenureMonths} Months</span>
              <span className="text-[11px] text-slate-500 block">Reducing Rate</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-1">Interest Rate</span>
              <span className="font-bold text-slate-900 text-sm">{loan.interestRate}% p.a.</span>
              <span className="text-[11px] text-slate-500 block">Fixed Cooperative</span>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 block mb-1 font-semibold">Monthly EMI</span>
              <span className="font-bold text-emerald-900 text-base">
                ₹ {loan.monthlyEmi.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-700/70 block">Due on 5th</span>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-900 mb-3">Compliance & Document Checks</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-700">Aadhaar Card & PAN Card Verification</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-700">Society Membership & Share Capital</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Member
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-700">Credit Committee Sanction Signature</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Actions Panel (Matching Screen 9 right side) */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Actions
            </h3>

            <button
              onClick={() => onUpdateStatus(loan.id, 'Approved', 'Verification')}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Verify Documents</span>
            </button>

            <button
              onClick={() => onUpdateStatus(loan.id, 'Approved', 'Approval')}
              className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Approve Loan</span>
            </button>

            <button
              onClick={() => onUpdateStatus(loan.id, 'Disbursed', 'Disbursement')}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Disburse Loan</span>
            </button>

            <button
              onClick={() => setIsAgreementOpen(true)}
              className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>View Agreement</span>
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-[#0b1736] p-5 rounded-2xl text-white text-xs space-y-2">
            <h4 className="font-bold text-sky-400">Next EMI Schedule</h4>
            <p className="text-slate-300">
              First installment of <span className="font-bold text-white">₹ {loan.monthlyEmi.toLocaleString()}</span> is due on the 5th of next month.
            </p>
          </div>
        </div>
      </div>

      {/* Loan Agreement Modal */}
      {isAgreementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Loan Agreement & Sanction Letter
                </h3>
              </div>
              <button
                onClick={() => setIsAgreementOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Letterhead */}
            <div className="border border-slate-200 rounded-2xl p-6 space-y-4 text-xs text-slate-700 bg-slate-50/50">
              <div className="text-center border-b border-slate-200 pb-3">
                <h4 className="text-base font-extrabold text-slate-900 uppercase">
                  Multi Credit Society Ltd.
                </h4>
                <p className="text-[11px] text-slate-500">
                  Reg No: MSCS/2024/101 • Kolkata, West Bengal
                </p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">
                  LOAN SANCTION ADVICE #{loan.loanId}
                </div>
              </div>

              <div className="space-y-2">
                <p>
                  <strong>Borrower:</strong> {loan.customerName} ({loan.customerId})
                </p>
                <p>
                  <strong>Sanctioned Amount:</strong> ₹ {loan.amount.toLocaleString()} (Rupees Fifty Thousand Only)
                </p>
                <p>
                  <strong>Tenure:</strong> {loan.tenureMonths} Months • <strong>Interest Rate:</strong> {loan.interestRate}% p.a.
                </p>
                <p>
                  <strong>Monthly EMI:</strong> ₹ {loan.monthlyEmi.toLocaleString()}
                </p>
              </div>

              <p className="text-slate-500 leading-relaxed text-[11px]">
                The borrower agrees to repay the loan amount in equal monthly installments without default. In case of delay, a 2% monthly penalty applies as per cooperative society norms.
              </p>

              <div className="pt-6 flex items-center justify-between border-t border-slate-200 text-slate-500 text-[11px]">
                <div>
                  <div className="font-bold text-slate-800">Borrower Signature</div>
                  <p>Digitally Signed via OTP</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">Authorized Officer</div>
                  <p>Multi Credit Society</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => {
                  alert('Agreement PDF downloaded (generated from Amazon S3)');
                  setIsAgreementOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Signed PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
