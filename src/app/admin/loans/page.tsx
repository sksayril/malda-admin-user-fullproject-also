'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoansView from '@/components/admin/views/LoansView';
import { useAdmin } from '@/context/AdminContext';

export default function LoansPage() {
  const router = useRouter();
  const { loans, addLoan } = useAdmin();

  return (
    <LoansView
      loans={loans}
      onSelectLoan={(loan) => {
        router.push(`/admin/loans/${loan.loanId}`);
      }}
      onAddLoan={addLoan}
    />
  );
}
