'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Signal, Battery, Eye, CheckCircle2 } from 'lucide-react';
import { Agent } from '@/types';

interface LocationTrackingViewProps {
  agents: Agent[];
  selectedAgentId?: string;
}

export default function LocationTrackingView({
  agents,
  selectedAgentId,
}: LocationTrackingViewProps) {
  const [activeAgentId, setActiveAgentId] = useState<string>(
    selectedAgentId || (agents[0]?.agentId ?? 'AGT001')
  );

  const activeAgent = agents.find((a) => a.agentId === activeAgentId) || agents[0];

  return (
    <div className="space-y-5">
      {/* Top Header (Matching Screen 13) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Agent Live Location
          </h1>
          <p className="text-xs text-slate-500">
            Real-time GPS tracking, daily routes, customer visit check-ins & field verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>3 Agents Active on Field</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Left List + Right Map (Matching Screen 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Agent Status List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Field Force Roster
          </h2>

          <div className="space-y-2">
            {agents.map((agent) => {
              const isSelected = agent.agentId === activeAgentId;
              return (
                <div
                  key={agent.id}
                  onClick={() => setActiveAgentId(agent.agentId)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-200 shadow-2xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {agent.name.charAt(0)}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                          agent.online ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{agent.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {agent.online ? 'Online' : 'Offline'} • {agent.branch}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      agent.online
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {agent.online ? 'Live' : 'Last seen'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Interactive Map Canvas (Matching Screen 13) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden h-[450px]">
          {/* Simulated Vector Map Background */}
          <div className="absolute inset-0 bg-[#e5e9f0] opacity-95">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Background fill */}
              <rect width="100%" height="100%" fill="#f1f4f9" />
              {/* River / water body */}
              <path
                d="M 50 0 Q 80 120 70 250 T 110 450 L 160 450 Q 120 250 130 120 T 100 0 Z"
                fill="#cbdcf7"
              />
              {/* Main Roads / Highways */}
              <path
                d="M 0 160 Q 250 180 500 140 T 800 170"
                stroke="#ffffff"
                strokeWidth="16"
                fill="none"
              />
              <path
                d="M 0 160 Q 250 180 500 140 T 800 170"
                stroke="#fcd34d"
                strokeWidth="4"
                fill="none"
              />

              <path
                d="M 320 0 L 320 450"
                stroke="#ffffff"
                strokeWidth="14"
                fill="none"
              />
              <path
                d="M 320 0 L 320 450"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="6,6"
                fill="none"
              />

              {/* Arterial streets */}
              <line x1="120" y1="80" x2="600" y2="80" stroke="#ffffff" strokeWidth="8" />
              <line x1="80" y1="280" x2="700" y2="280" stroke="#ffffff" strokeWidth="8" />
              <line x1="480" y1="40" x2="480" y2="400" stroke="#ffffff" strokeWidth="8" />

              {/* Park green zones */}
              <rect x="180" y="40" width="100" height="70" rx="8" fill="#dcfce7" />
              <rect x="360" y="210" width="140" height="90" rx="8" fill="#dcfce7" />
              <text x="230" y="80" fontSize="10" fill="#166534" fontWeight="600" textAnchor="middle">
                Central Park
              </text>
              <text x="430" y="260" fontSize="10" fill="#166534" fontWeight="600" textAnchor="middle">
                Botanical Garden
              </text>
            </svg>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs rounded-xl shadow-md border border-slate-200 p-1.5 flex flex-col gap-1 text-slate-700 z-10">
            <button
              onClick={() => alert('GPS auto-centered')}
              className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
              title="Locate Me"
            >
              <Navigation className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => alert('Compass calibrated')}
              className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
              title="Compass"
            >
              <Compass className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Pin Markers for All Agents */}
          {/* Agent 1 Marker (Rakesh Kumar) */}
          <div className="absolute left-[54%] top-[42%] -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative flex flex-col items-center">
              {/* Pulsing Beacon Ring */}
              <div className="w-12 h-12 rounded-full bg-blue-500/30 beacon-pulse absolute -top-2 flex items-center justify-center pointer-events-none" />

              {/* Pin Icon */}
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white">
                <MapPin className="w-4 h-4" />
              </div>

              {/* Info Popup Card (Matching Screen 13) */}
              <div className="mt-2 bg-white rounded-xl shadow-xl border border-slate-200/80 p-2.5 min-w-[150px] text-center pointer-events-auto">
                <p className="font-bold text-slate-900 text-xs">{activeAgent?.name || 'Rakesh Kumar'}</p>
                <p className="text-[10px] text-slate-500">
                  Last active: <span className="font-semibold text-blue-600">{activeAgent?.lastActive || '10:24 AM'}</span>
                </p>
                <div className="mt-1 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-0.5 text-emerald-600">
                    <Signal className="w-3 h-3" /> 4G GPS
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Battery className="w-3 h-3 text-slate-500" /> 84%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sima Das Marker */}
          <div className="absolute left-[38%] top-[28%] -translate-x-1/2 -translate-y-1/2 z-10">
            <div
              onClick={() => setActiveAgentId('AGT002')}
              className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-2 ring-white cursor-pointer"
              title="Sima Das"
            >
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pooja Sharma Marker */}
          <div className="absolute left-[70%] top-[65%] -translate-x-1/2 -translate-y-1/2 z-10">
            <div
              onClick={() => setActiveAgentId('AGT004')}
              className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md ring-2 ring-white cursor-pointer"
              title="Pooja Sharma"
            >
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bottom Overlay Summary */}
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-md flex items-center justify-between text-xs z-10">
            <div>
              <span className="font-bold text-slate-900">Current Area:</span>
              <span className="text-slate-600 ml-1.5">
                {activeAgent?.location?.address || 'Park Street Commercial Hub, Kolkata'}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-blue-600">
              Verified by Geofence Radius
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
