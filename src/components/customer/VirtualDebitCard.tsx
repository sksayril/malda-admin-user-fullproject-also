'use client';

import React, { useState } from 'react';
import { CreditCard, Eye, EyeOff, Copy, Check, ShieldCheck, Wifi, Sparkles } from 'lucide-react';
import { Customer } from '@/types';

interface VirtualDebitCardProps {
  customer: Customer;
  balance?: number;
}

export default function VirtualDebitCard({ customer, balance = 25400 }: VirtualDebitCardProps) {
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);

  const cardNumber = customer.debitCardNumber || `5421 8812 ${customer.mobile?.slice(-4) || '9876'} 2026`;
  const maskedCardNumber = `5421 •••• •••• ${customer.mobile?.slice(-4) || '2026'}`;
  const accountNumber = customer.accountNumber || `MC360-${customer.mobile || '9876543210'}`;
  const expiry = customer.debitCardExpiry || '09/31';
  const cvv = customer.debitCardCvv || '834';

  const copyToClipboard = (text: string, isAcc: boolean) => {
    navigator.clipboard.writeText(text);
    if (isAcc) {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } else {
      setCopiedCard(true);
      setTimeout(() => setCopiedCard(false), 2000);
    }
  };

  return (
    <div className="w-full">
      {/* Card Visual with Realistic Metallic / Holographic Styling */}
      <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/25 bg-gradient-to-tr from-[#0a1128] via-[#1c2e63] to-[#0f4c81] border border-white/20">
        {/* Holographic background glows */}
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-blue-500/30 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent pointer-events-none" />

        {/* Card Header: Brand & Contactless Icon */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center font-extrabold text-sm shadow-md border border-white/30">
              MC
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block leading-none">
                MultiCredit <span className="text-sky-400">360</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-300 font-semibold">
                Platinum Debit Card
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-sky-300/80 rotate-90" />
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Card Chip & Hologram */}
        <div className="relative z-10 my-4 flex items-center justify-between">
          <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-1 border border-amber-300/60 shadow-inner flex flex-col justify-between">
            <div className="border-b border-amber-600/40 h-1/3" />
            <div className="border-b border-amber-600/40 h-1/3" />
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-300 block font-medium">Available Balance</span>
            <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight drop-shadow-md">
              ₹ {balance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Card Number */}
        <div className="relative z-10 my-2">
          <div className="flex items-center justify-between">
            <p className="font-mono text-base sm:text-lg tracking-widest text-white/95 font-bold drop-shadow">
              {showCardNumber ? cardNumber : maskedCardNumber}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowCardNumber(!showCardNumber)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition text-slate-200"
                title={showCardNumber ? 'Hide Card Number' : 'Show Card Number'}
              >
                {showCardNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(cardNumber.replace(/\s/g, ''), false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition text-slate-200"
                title="Copy Card Number"
              >
                {copiedCard ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer: Card Holder, Expiry & CVV */}
        <div className="relative z-10 mt-3 pt-2 border-t border-white/10 flex items-end justify-between text-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
              Card Holder
            </span>
            <span className="font-bold text-slate-100 tracking-wide uppercase text-xs sm:text-sm">
              {customer.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
                Valid Thru
              </span>
              <span className="font-mono font-bold text-slate-100">{expiry}</span>
            </div>

            <div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
                CVV
              </span>
              <button
                type="button"
                onClick={() => setShowCvv(!showCvv)}
                className="font-mono font-bold text-amber-300 hover:underline flex items-center gap-1"
              >
                {showCvv ? cvv : '•••'}
              </button>
            </div>

            {/* Master/Rupay Logo */}
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-rose-500/80" />
              <div className="w-6 h-6 rounded-full bg-amber-400/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Account Number & Quick Action Strip */}
      <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Primary Account Number</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                UNIQUE
              </span>
            </div>
            <p className="font-mono font-bold text-sm text-slate-900 tracking-tight">{accountNumber}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => copyToClipboard(accountNumber, true)}
          className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {copiedAcc ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Account No</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
