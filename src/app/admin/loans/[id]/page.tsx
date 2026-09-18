'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import LoanDetailsView from '@/components/admin/views/LoanDetailsView';
import { useAdmin } from '@/context/AdminContext';

export default function LoanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { loans, updateLoanStatus } = useAdmin();

  const loan = loans.find((l) => l.loanId === id || l.id === id) || loans[0];

  return (
    <LoanDetailsView
      loan={loan}
      onBack={() => router.push('/admin/loans')}
      onUpdateStatus={updateLoanStatus}
    />
  );
}
