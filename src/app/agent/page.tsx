'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('mc360_agent_session');
    if (saved) {
      router.replace('/agent/dashboard');
    } else {
      router.replace('/agent/login');
    }
  }, [router]);

  return null;
}
