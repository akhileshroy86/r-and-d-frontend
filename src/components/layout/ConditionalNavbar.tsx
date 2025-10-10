'use client';

import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { RootState } from '../../store';
import Navbar from './Navbar';

const ConditionalNavbar = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [localUser, setLocalUser] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        setLocalUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // Hide navbar for admin users
  if ((isAuthenticated && user?.role === 'admin') || localUser?.role === 'admin') {
    return null;
  }

  // Show navbar for all other users
  return <Navbar />;
};

export default ConditionalNavbar;