'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('mc360_customer_session');
    if (saved) {
      router.replace('/customer/dashboard');
    } else {
      router.replace('/customer/login');
    }
  }, [router]);

  return null;
}
