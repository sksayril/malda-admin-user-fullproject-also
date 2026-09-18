'use client';

import React from 'react';
import WhiteLabelView from '@/components/admin/views/WhiteLabelView';
import { useAdmin } from '@/context/AdminContext';

export default function WhiteLabelPage() {
  const { partners, addPartner, togglePartnerStatus } = useAdmin();

  return (
    <WhiteLabelView
      partners={partners}
      onAddPartner={addPartner}
      onToggleStatus={togglePartnerStatus}
    />
  );
}
