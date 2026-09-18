'use client';

import React from 'react';
import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200">
        {/* Logout Icon (Matching image 20) */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4 shadow-inner">
          <LogOut className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1.5">
          Are you sure want to logout?
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          You will need to login again to access the system and manage financial operations.
        </p>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-500/25 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
