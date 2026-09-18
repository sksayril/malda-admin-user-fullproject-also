'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import CustomerDetailsView from '@/components/admin/views/CustomerDetailsView';
import { useAdmin } from '@/context/AdminContext';

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { customers } = useAdmin();

  const customer =
    customers.find((c) => c.customerId === id || c.id === id) || customers[0];

  return (
    <CustomerDetailsView
      customer={customer}
      onBack={() => router.push('/admin/customers')}
      onNavigate={(view) => router.push(`/admin/${view}`)}
      onQuickAction={(action) => {
        if (action === 'loan') router.push('/admin/loans');
        else if (action === 'fd' || action === 'rd') router.push('/admin/deposits');
        else if (action === 'collect') router.push('/admin/collections');
      }}
    />
  );
}
