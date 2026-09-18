'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CollectionsView from '@/components/admin/views/CollectionsView';
import { useAdmin } from '@/context/AdminContext';

export default function CollectionsPage() {
  const router = useRouter();
  const { collections, addCollection } = useAdmin();

  return (
    <CollectionsView
      collections={collections}
      onAddCollection={addCollection}
      onNavigate={(view) => {
        if (view === 'agent-collection') {
          router.push('/admin/collections/report');
        } else {
          router.push(`/admin/${view}`);
        }
      }}
    />
  );
}
