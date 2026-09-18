'use client';

import React from 'react';
import BranchesView from '@/components/admin/views/BranchesView';
import { useAdmin } from '@/context/AdminContext';

export default function BranchesPage() {
  const { branches, addBranch, toggleBranchStatus } = useAdmin();

  return (
    <BranchesView
      branches={branches}
      onAddBranch={addBranch}
      onToggleStatus={toggleBranchStatus}
    />
  );
}
