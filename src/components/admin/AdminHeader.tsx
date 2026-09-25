'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, Menu, ShieldCheck, User, LogOut } from 'lucide-react';
import { UserSession } from '@/types';
import { AdminViewId } from './AdminSidebar';

interface AdminHeaderProps {
  user: UserSession;
  onOpenMobileSidebar: () => void;
  onSelectView?: (view: AdminViewId) => void;
  onOpenLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function AdminHeader({
  user,
  onOpenMobileSidebar,
  onOpenLogout,
  searchQuery,
  onSearchChange,
}: AdminHeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Left side: Hamburger + Search */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search anything (customer, agent, loan, deposit)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Right side: Portal Switcher + Notifications + User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Portal Switcher */}
        <div className="hidden md:flex items-center gap-1.5 text-xs">
          <a
            href="/agent/login"
            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition flex items-center gap-1"
          >
            <span>Agent Portal ↗</span>
          </a>
          <a
            href="/customer/login"
            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition flex items-center gap-1"
          >
            <span>Customer Portal ↗</span>
          </a>
        </div>

        {/* Notification bell */}
        <button
          onClick={() => alert('All systems operational. No unread critical alerts.')}
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* User profile dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider block">
                {user.role}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 shadow-sm">
              SA
            </div>
          </button>

          {/* Profile Dropdown */}
          {showUserMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 text-xs animate-in fade-in zoom-in-95"
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <div className="px-3.5 py-2 border-b border-slate-100 mb-1">
                <p className="font-semibold text-slate-800">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  router.push('/admin/profile');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  router.push('/admin/settings');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Security & Settings</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenLogout();
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
