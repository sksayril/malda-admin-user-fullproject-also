'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import LogoutModal from '@/components/admin/modals/LogoutModal';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    currentUser,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    logout,
    searchQuery,
    setSearchQuery,
  } = useAdmin();

  const isAuthPage = pathname.includes('/login') || pathname.includes('/signup');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-800 flex">
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* Main container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {currentUser && (
          <AdminHeader
            user={currentUser}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onSelectView={() => {}}
            onOpenLogout={() => setIsLogoutModalOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
      />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
