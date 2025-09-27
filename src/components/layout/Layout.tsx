import React from 'react';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      url: '/dashboard'
    },
    {
      label: 'Patients',
      icon: 'pi pi-users',
      url: '/patients'
    },
    {
      label: 'Appointments',
      icon: 'pi pi-calendar',
      url: '/appointments'
    },
    {
      label: 'Doctors',
      icon: 'pi pi-user-plus',
      url: '/doctors'
    },
    {
      label: 'Staff',
      icon: 'pi pi-id-card',
      url: '/staff'
    }
  ];

  return (
    <div className="layout-wrapper">
      <Menubar model={menuItems} />
      <main className="layout-main p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;