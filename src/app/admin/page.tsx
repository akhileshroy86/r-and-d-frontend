'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../../store';
import AdminDashboard from '../../components/admin/AdminDashboard';

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user?.role, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex align-items-center justify-content-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}