'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../../store';
import { loginSuccess } from '../../store/slices/authSlice';
import StaffDashboard from '../../components/staff/StaffDashboard';

export default function StaffDashboardPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing auth data
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role === 'STAFF' || parsedUser.role === 'staff') {
          // Update Redux store with localStorage data
          dispatch(loginSuccess({ user: parsedUser, token }));
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    // If no valid staff auth found, redirect to home
    if (!isAuthenticated || (user?.role !== 'STAFF' && user?.role !== 'staff')) {
      router.push('/');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role, router, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex align-items-center justify-content-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== 'STAFF' && user?.role !== 'staff')) {
    return (
      <div className="min-h-screen flex align-items-center justify-content-center">
        <div className="text-center">
          <i className="pi pi-exclamation-triangle text-4xl text-orange-500 mb-3"></i>
          <p>Access denied. Please login as staff.</p>
        </div>
      </div>
    );
  }

  return <StaffDashboard />;
}