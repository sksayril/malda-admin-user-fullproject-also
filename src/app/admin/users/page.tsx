'use client';

import React from 'react';
import UsersView from '@/components/admin/views/UsersView';
import { useAdmin } from '@/context/AdminContext';

export default function UsersPage() {
  const { users, addUser, toggleUserStatus } = useAdmin();

  return (
    <UsersView
      users={users}
      onAddUser={addUser}
      onToggleStatus={toggleUserStatus}
    />
  );
}
