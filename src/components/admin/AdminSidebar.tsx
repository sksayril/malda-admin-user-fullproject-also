'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  GitFork,
  Users,
  UserCheck,
  CreditCard,
  PiggyBank,
  Receipt,
  MapPin,
  Share2,
  Globe,
  FileText,
  ShieldAlert,
  Settings,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export type AdminViewId =
  | 'dashboard'
  | 'society'
  | 'branches'
  | 'agents'
  | 'customers'
  | 'customer-details'
  | 'loans'
  | 'loan-details'
  | 'deposits'
  | 'collections'
  | 'agent-collection'
  | 'location-tracking'
  | 'mlm'
  | 'white-label'
  | 'reports'
  | 'users'
  | 'settings'
  | 'profile';

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenLogout?: () => void;
}

export default function AdminSidebar({
  isMobileOpen = false,
  onCloseMobile = () => {},
  onOpenLogout = () => {},
}: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/society', label: 'Society Management', icon: Building },
    { href: '/admin/branches', label: 'Branch Management', icon: GitFork },
    { href: '/admin/agents', label: 'Agent Management', icon: Users },
    { href: '/admin/customers', label: 'Customer Management', icon: UserCheck },
    { href: '/admin/loans', label: 'Loan Management', icon: CreditCard },
    { href: '/admin/deposits', label: 'Deposit Management', icon: PiggyBank },
    { href: '/admin/collections', label: 'Collection Management', icon: Receipt },
    { href: '/admin/location-tracking', label: 'Location Tracking', icon: MapPin },
    { href: '/admin/mlm', label: 'MLM / Commission', icon: Share2 },
    { href: '/admin/white-label', label: 'White Label', icon: Globe },
    { href: '/admin/reports', label: 'Reports', icon: FileText },
    { href: '/admin/users', label: 'User Management', icon: ShieldAlert },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/admin/profile', label: 'My Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0a1226] text-slate-300 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand Logo */}
        <div>
          <Link
            href="/admin/dashboard"
            className="p-5 border-b border-slate-800/80 flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/30 text-base">
              MC
            </div>
            <div>
              <h2 className="font-bold text-white tracking-tight text-base flex items-center gap-1">
                MultiCredit <span className="text-blue-400">360</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-medium block">
                FinTech SaaS Suite
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="py-4 px-3 space-y-1 max-h-[calc(100vh-170px)] overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Logout Button */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={onOpenLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
