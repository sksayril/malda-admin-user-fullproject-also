'use client';

import React from 'react';
import ProfileView from '@/components/admin/views/ProfileView';
import { useAdmin } from '@/context/AdminContext';

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useAdmin();

  if (!currentUser) return null;

  return <ProfileView user={currentUser} onUpdateUser={setCurrentUser} />;
}
