'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AdminAuthPage from '@/components/auth/AdminAuthPage';
import { useAdmin } from '@/context/AdminContext';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useAdmin();

  return (
    <AdminAuthPage
      onLoginSuccess={(user) => {
        setCurrentUser(user);
        router.push('/admin/dashboard');
      }}
    />
  );
}
