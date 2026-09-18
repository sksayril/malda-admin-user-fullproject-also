'use client';

import React from 'react';
import DepositsView from '@/components/admin/views/DepositsView';
import { useAdmin } from '@/context/AdminContext';

export default function DepositsPage() {
  const { deposits, addDeposit } = useAdmin();

  return <DepositsView deposits={deposits} onAddDeposit={addDeposit} />;
}
