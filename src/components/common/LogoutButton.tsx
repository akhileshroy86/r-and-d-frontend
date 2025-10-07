'use client';

import { useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { logout } from '../../store/slices/authSlice';

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton = ({ className }: LogoutButtonProps) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Button
      label="Logout"
      icon="pi pi-sign-out"
      onClick={handleLogout}
      className={className}
      severity="secondary"
      outlined
    />
  );
};

export default LogoutButton;