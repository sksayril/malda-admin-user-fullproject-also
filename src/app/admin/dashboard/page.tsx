'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardView from '@/components/admin/views/DashboardView';

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleNavigate = (view: string) => {
    router.push(`/admin/${view}`);
  };

  return <DashboardView onNavigate={handleNavigate} />;
}
