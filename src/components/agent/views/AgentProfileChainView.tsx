'use client';

import React, { useState } from 'react';
import {
  User,
  Users,
  GitFork,
  Search,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Edit,
  ShieldCheck,
  Building,
  CheckCircle,
  X,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';
import { Agent } from '@/types';

interface ChainMember {
  name: string;
  code: string;
  rank: number;
  amount: number;
  hasChildren?: boolean;
  children?: ChainMember[];
}

interface AgentProfileChainViewProps {
  agent: Agent;
}

export default function AgentProfileChainView({ agent }: AgentProfileChainViewProps) {
  const [subModule, setSubModule] = useState<'ownProfile' | 'memberProfile' | 'chainView'>('ownProfile');

  // Edit Profile Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'
  );
  const [profileName, setProfileName] = useState(agent.name || 'KESHAB CH MAHATO');
  const [profileEmail, setProfileEmail] = useState(agent.email || 'keshabmahato@gmail.com');
  const [profilePhone, setProfilePhone] = useState(agent.mobile || '8759598798');
  const [profileAadhaar, setProfileAadhaar] = useState('458274315828');
  const [profilePan, setProfilePan] = useState('BWPPM1428J');
  const [profileDob, setProfileDob] = useState('1992-03-15');
  const [profileAddress, setProfileAddress] = useState('PAKUAHAT MALDA');

  // Member Profile Search
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [searchedMember, setSearchedMember] = useState<any>(null);

  // Chain View Hierarchy Navigation
  const [fromDate, setFromDate] = useState('2026-09-01');
  const [toDate, setToDate] = useState('2026-09-30');
  const [chainPath, setChainPath] = useState<{ name: string; code: string }[]>([
    { name: agent.name || 'KESHAB CH MAHATO', code: agent.agentId || 'KNM00006282' },
  ]);

  // Root Chain Hierarchy Data from Video
  const chainDataRoot: ChainMember[] = [
    {
      name: 'JAYANTA CHOWDHURY',
      code: 'KNM00006605',
      rank: 9,
      amount: 357660,
      hasChildren: true,
      children: [
        { name: 'KRISHNA SARKAR', code: 'KNM00006843', rank: 8, amount: 0 },
        { name: 'SOMEN BALA', code: 'KNM00007167', rank: 8, amount: 0 },
        { name: 'SOUMALYA SAHA', code: 'KNM00007184', rank: 8, amount: 0 },
        { name: 'KRISHNA KARMAKAR', code: 'KNM00007488', rank: 8, amount: 0 },
        { name: 'CHINMAY ROY', code: 'KNM00007532', rank: 8, amount: 305050, hasChildren: true },
        { name: 'HOROPRASAD MAHATO', code: 'KNM00007614', rank: 8, amount: 34300 },
        { name: 'BIBEKANANDA MAJUMDAR', code: 'KNM00007742', rank: 8, amount: 50300 },
      ],
    },
    {
      name: 'CHINMAY ROY',
      code: 'KNM00007532',
      rank: 8,
      amount: 305050,
      hasChildren: true,
      children: [
        { name: 'BHAJAN SARKAR', code: 'KNM00008014', rank: 7, amount: 0 },
        { name: 'BISWAJIT SARKAR', code: 'KNM00009701', rank: 7, amount: 0 },
        { name: 'NISHA BIN', code: 'KNM00008117', rank: 8, amount: 0 },
        { name: 'RINKU BIN', code: 'KNM00008133', rank: 8, amount: 0 },
        { name: 'SUDHANGSHU SHIL', code: 'KNM00008389', rank: 8, amount: 0 },
      ],
    },
    {
      name: 'SANJIB CHOWDHURY',
      code: 'KNM00006822',
      rank: 9,
      amount: 102150,
      hasChildren: true,
      children: [
        { name: 'ALOKA MANDAL', code: 'KNM00007374', rank: 9, amount: 0 },
        { name: 'BANKIM MANDAL', code: 'KNM00007743', rank: 9, amount: 20400 },
      ],
    },
    { name: 'KESHAB MANDAL', code: 'KNM00006304', rank: 10, amount: 0 },
    { name: 'RINA BISWAS', code: 'KNM00006368', rank: 10, amount: 0 },
    { name: 'MAHESWAR MAHATO', code: 'KNM00006378', rank: 10, amount: 0 },
    { name: 'BIKRAM SHIL', code: 'KNM00006606', rank: 10, amount: 0 },
    { name: 'GOUR CHANDRA MANDAL', code: 'KNM00006752', rank: 10, amount: 0 },
    { name: 'JAHAR LAL CHOWDHURY', code: 'KNM00006784', rank: 10, amount: 0 },
    { name: 'KRISHNA DAS', code: 'KNM00000090', rank: 10, amount: 180 },
    { name: 'RINKU BISWAS', code: 'KNM00008273', rank: 10, amount: 0 },
    { name: 'BISWA BARAI', code: 'KNM00006821', rank: 8, amount: 21870 },
    { name: 'ALPANA DAS', code: 'KNM00006753', rank: 9, amount: 0 },
    { name: 'PUJA MANDAL', code: 'KNM00008610', rank: 9, amount: 1710 },
    { name: 'SAHADEB MANDAL', code: 'KNM00009176', rank: 9, amount: 0 },
    { name: 'DHIBALA MANDAL', code: 'KNM00006353', rank: 4, amount: 0 },
    { name: 'HARA KUMAR BARAI', code: 'KNM00006512', rank: 6, amount: 0 },
    { name: 'NARATTAM MAHATO', code: 'KNM00006515', rank: 6, amount: 0 },
  ];

  // Current active list based on navigation depth
  const getCurrentChainList = () => {
    if (chainPath.length === 1) return chainDataRoot;
    const lastNode = chainPath[chainPath.length - 1];
    const found = chainDataRoot.find((m) => m.code === lastNode.code);
    return found?.children || chainDataRoot;
  };

  const handleDrillDown = (member: ChainMember) => {
    if (member.hasChildren && member.children) {
      setChainPath((prev) => [...prev, { name: member.name, code: member.code }]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setChainPath((prev) => prev.slice(0, index + 1));
  };

  return (
    <div className="space-y-6">
      {/* 3 Sub-Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setSubModule('ownProfile')}
          className={`p-5 rounded-3xl border text-left transition flex items-center justify-between cursor-pointer ${
            subModule === 'ownProfile'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25'
              : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <span
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                subModule === 'ownProfile' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              <User className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">KYC & Dossier</span>
              <h4 className="text-base font-extrabold">Own Profile</h4>
              <p className={`text-xs mt-0.5 ${subModule === 'ownProfile' ? 'text-indigo-100' : 'text-slate-500'}`}>
                Personal & Financial Identity
              </p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${subModule === 'ownProfile' ? 'text-white' : 'text-slate-400'}`} />
        </button>

        <button
          type="button"
          onClick={() => setSubModule('memberProfile')}
          className={`p-5 rounded-3xl border text-left transition flex items-center justify-between cursor-pointer ${
            subModule === 'memberProfile'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 shadow-lg shadow-purple-500/25'
              : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <span
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                subModule === 'memberProfile' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'
              }`}
            >
              <Users className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">Search Directory</span>
              <h4 className="text-base font-extrabold">Member Profile</h4>
              <p className={`text-xs mt-0.5 ${subModule === 'memberProfile' ? 'text-purple-100' : 'text-slate-500'}`}>
                Lookup Customers & Agents
              </p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${subModule === 'memberProfile' ? 'text-white' : 'text-slate-400'}`} />
        </button>

        <button
          type="button"
          onClick={() => setSubModule('chainView')}
          className={`p-5 rounded-3xl border text-left transition flex items-center justify-between cursor-pointer ${
            subModule === 'chainView'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg shadow-blue-500/25'
              : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <span
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                subModule === 'chainView' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
              }`}
            >
              <GitFork className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">Multi-Level Tree</span>
              <h4 className="text-base font-extrabold">Chain View</h4>
              <p className={`text-xs mt-0.5 ${subModule === 'chainView' ? 'text-blue-100' : 'text-slate-500'}`}>
                Hierarchical Downline Team
              </p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${subModule === 'chainView' ? 'text-white' : 'text-slate-400'}`} />
        </button>
      </div>

      {/* 1. Own Profile View (Matching Video Design & Fields) */}
      {subModule === 'ownProfile' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-pink-500 p-0.5 shadow-md overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img src={profilePhoto} alt={profileName} className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{profileName}</h3>
                <span className="text-xs font-mono font-bold text-indigo-600 block mt-0.5">
                  Collector Code: {agent.agentId || 'KNM00006282'}
                </span>
                <span className="text-[11px] text-slate-500 block">Branch: {agent.branch || 'MALDA HQ'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-pink-500/25 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Profile Details List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium block">Name</span>
              <span className="text-sm font-extrabold text-slate-900 block">{profileName}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium block">Email ID</span>
              <span className="text-sm font-bold text-slate-800 block">{profileEmail}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium block">Aadhaar Number</span>
              <span className="text-sm font-mono font-bold text-slate-900 block">{profileAadhaar}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium block">Date of Birth</span>
              <span className="text-sm font-medium text-slate-800 block">
                {new Date(profileDob).toLocaleDateString('en-GB')}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium block">Communication Address</span>
              <span className="text-sm font-bold text-slate-900 block uppercase">{profileAddress}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium block">Phone No</span>
              <span className="text-sm font-bold text-slate-900 block">{profilePhone}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 sm:col-span-2">
              <span className="text-[11px] text-slate-400 font-medium block">PAN No</span>
              <span className="text-sm font-mono font-extrabold text-indigo-700 block uppercase">{profilePan}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Member Profile Search */}
      {subModule === 'memberProfile' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Search Member & Customer Profile</span>
            </h3>
            <p className="text-xs text-slate-500">Lookup complete dossiers by Name or Member/Account Number</p>
          </div>

          <div className="relative max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={memberSearchQuery}
              onChange={(e) => {
                setMemberSearchQuery(e.target.value);
                if (e.target.value.toLowerCase().includes('keshab')) {
                  setSearchedMember({
                    name: 'KESHAB MANDAL',
                    memberNo: 'MBR-984210',
                    phone: '9876543210',
                    accountNo: 'KISALY511421473',
                    savingsBalance: 18875.59,
                    status: 'Active Member',
                    branch: 'MALDA HQ',
                  });
                }
              }}
              placeholder="Search by Name / Member No..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white"
            />
          </div>

          {searchedMember ? (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Member Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{searchedMember.name}</span>
                <span className="text-[10px] text-indigo-600 font-mono">{searchedMember.memberNo}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Savings Account</span>
                <span className="font-mono font-bold text-slate-800">{searchedMember.accountNo}</span>
                <span className="text-[10px] text-emerald-600 font-bold block">
                  Bal: ₹ {searchedMember.savingsBalance.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {searchedMember.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Type member name to inspect profile and account portfolio.
            </div>
          )}
        </div>
      )}

      {/* 3. Chain View (Hierarchical Downline Team View with Interactive Drilldown) */}
      {subModule === 'chainView' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GitFork className="w-5 h-5 text-blue-600" />
                <span>Hierarchical Chain & Downline Network View</span>
              </h3>
              <p className="text-xs text-slate-500">
                Drilldown into sub-agent branches to view ranks and active business volume
              </p>
            </div>
          </div>

          {/* Form Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Collector Code</label>
              <input
                type="text"
                readOnly
                value={chainPath[chainPath.length - 1].code}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-pink-500/25 cursor-pointer"
              >
                SHOW CHAIN
              </button>
            </div>
          </div>

          {/* Breadcrumb Path for Drilldown */}
          <div className="flex items-center gap-2 text-xs font-semibold bg-slate-50 p-3 rounded-2xl border border-slate-200 overflow-x-auto">
            <span className="text-slate-400 shrink-0">Chain Path:</span>
            {chainPath.map((item, idx) => (
              <React.Fragment key={item.code}>
                <button
                  type="button"
                  onClick={() => handleBreadcrumbClick(idx)}
                  className={`font-bold transition cursor-pointer hover:underline shrink-0 ${
                    idx === chainPath.length - 1 ? 'text-indigo-700 font-extrabold' : 'text-slate-600'
                  }`}
                >
                  {item.name} ({item.code})
                </button>
                {idx < chainPath.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              </React.Fragment>
            ))}
          </div>

          {/* Chain Table matching video */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-pink-600 text-white uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4 text-center">Rank</th>
                  <th className="py-3 px-4 text-right">Business Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {getCurrentChainList().map((member) => (
                  <tr
                    key={member.code}
                    onClick={() => handleDrillDown(member)}
                    className={`transition ${
                      member.hasChildren ? 'hover:bg-indigo-50/70 cursor-pointer' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span>{member.name}</span>
                      {member.hasChildren && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700">
                          Branch Team
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{member.code}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-800 text-[10px]">
                        Rank {member.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900">
                      ₹ {member.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {member.hasChildren ? (
                        <button
                          type="button"
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-lg text-[11px] font-bold transition cursor-pointer"
                        >
                          View Team →
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Direct Member</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">Update Profile Details</h4>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditModalOpen(false);
                alert('Profile updated successfully!');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Communication Address</label>
                <input
                  type="text"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow-md shadow-pink-500/25 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
