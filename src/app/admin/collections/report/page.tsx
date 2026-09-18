'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AgentReportView from '@/components/admin/views/AgentReportView';
import { useAdmin } from '@/context/AdminContext';

export default function AgentCollectionReportPage() {
  const router = useRouter();
  const { agents } = useAdmin();

  return (
    <AgentReportView
      agents={agents}
      onBack={() => router.push('/admin/collections')}
    />
  );
}
