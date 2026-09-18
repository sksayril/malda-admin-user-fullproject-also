'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Mail,
  ShieldAlert,
  FileCheck,
  Bell,
  Database,
  CheckCircle2,
  Lock,
  Smartphone,
  Key,
} from 'lucide-react';

export default function SettingsView() {
  const [saved, setSaved] = useState(false);

  const settingsCards = [
    {
      id: 'general',
      title: 'General Settings',
      desc: 'System timezone, currency symbol (₹), fiscal calendar & multi-language defaults',
      icon: Sliders,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'sms-email',
      title: 'SMS & Email Settings',
      desc: 'Twilio / Fast2SMS API gateway and SendGrid SMTP server credentials',
      icon: Mail,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      id: 'roles',
      title: 'Role & Permissions',
      desc: 'Granular RBAC matrix for Society Admin, Branch Managers, Cashiers & Field Agents',
      icon: ShieldAlert,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'documents',
      title: 'Document Settings',
      desc: 'Amazon S3 bucket credentials, signed URL expiry & automated watermarking',
      icon: FileCheck,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      desc: 'Automated EMI reminders, payment receipt alerts, and FD maturity broadcasts',
      icon: Bell,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'backup',
      title: 'Backup & Security',
      desc: 'Automated MongoDB daily snapshots, 2FA enforcement, IP whitelisting & audit logs',
      icon: Database,
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header (Matching Screen 18) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            System Settings
          </h1>
          <p className="text-xs text-slate-500">
            Configure integrations, financial governance policies, gateways and access controls
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <span>Save Preferences</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration parameters saved and active across all nodes!</span>
        </div>
      )}

      {/* Grid of Settings Modules (Matching Screen 18) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {settingsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={handleSave}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {card.title}
                  </h3>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Configure
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
