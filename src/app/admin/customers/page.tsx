'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CustomersView from '@/components/admin/views/CustomersView';
import { useAdmin } from '@/context/AdminContext';

export default function CustomersPage() {
  const router = useRouter();
  const { customers, addCustomer, toggleCustomerStatus } = useAdmin();

  return (
    <CustomersView
      customers={customers}
      onSelectCustomer={(cust) => {
        router.push(`/admin/customers/${cust.customerId}`);
      }}
      onAddCustomer={addCustomer}
      onToggleStatus={toggleCustomerStatus}
    />
  );
}
