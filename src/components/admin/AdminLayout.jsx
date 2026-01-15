import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { getAdminAuth } from '../../api/exchangeApi';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = getAdminAuth();

  // 로그인하지 않은 경우 로그인 페이지로 리디렉션
  if (!auth) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 min-h-[calc(100vh-65px)] sm:min-h-[calc(100vh-73px)] w-full lg:w-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
