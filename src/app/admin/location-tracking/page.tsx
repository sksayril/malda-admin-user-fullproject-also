'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LocationTrackingView from '@/components/admin/views/LocationTrackingView';
import { useAdmin } from '@/context/AdminContext';

function LocationTrackingContent() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agentId') || 'AGT001';
  const { agents } = useAdmin();

  return <LocationTrackingView agents={agents} selectedAgentId={agentId} />;
}

export default function LocationTrackingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading GPS Live Map...</div>}>
      <LocationTrackingContent />
    </Suspense>
  );
}
