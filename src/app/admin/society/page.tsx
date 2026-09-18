'use client';

import React from 'react';
import SocietyView from '@/components/admin/views/SocietyView';
import { useAdmin } from '@/context/AdminContext';

export default function SocietyPage() {
  const { society, setSociety } = useAdmin();

  return <SocietyView society={society} onUpdate={setSociety} />;
}
