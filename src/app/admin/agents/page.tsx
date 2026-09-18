'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AgentsView from '@/components/admin/views/AgentsView';
import { useAdmin } from '@/context/AdminContext';

export default function AgentsPage() {
  const router = useRouter();
  const { agents, addAgent, toggleAgentStatus } = useAdmin();

  return (
    <AgentsView
      agents={agents}
      onAddAgent={addAgent}
      onToggleStatus={toggleAgentStatus}
      onViewLocation={(agentId) => {
        router.push(`/admin/location-tracking?agentId=${agentId}`);
      }}
    />
  );
}
