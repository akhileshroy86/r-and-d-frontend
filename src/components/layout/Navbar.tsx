'use client';

import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const getMenuItems = () => {
    if (!isAuthenticated || !user) return [];

    const commonItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => window.location.href = '/'
      }
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...commonItems,
          {
            label: 'Doctors',
            icon: 'pi pi-users',
            items: [
              { label: 'Manage Doctors', icon: 'pi pi-user-plus' },
              { label: 'Doctor Schedules', icon: 'pi pi-calendar' }
            ]
          },
          {
            label: 'Staff',
            icon: 'pi pi-id-card',
            items: [
              { label: 'Manage Staff', icon: 'pi pi-user-plus' },
              { label: 'Staff Reports', icon: 'pi pi-chart-bar' }
            ]
          },
          {
            label: 'Analytics',
            icon: 'pi pi-chart-line',
            items: [
              { label: 'Revenue Reports', icon: 'pi pi-dollar' },
              { label: 'Patient Analytics', icon: 'pi pi-users' }
            ]
          },
          {
            label: 'Settings',
            icon: 'pi pi-cog'
          }
        ];

      case 'doctor':
        return [
          ...commonItems,
          {
            label: 'Appointments',
            icon: 'pi pi-calendar',
            badge: '5'
          },
          {
            label: 'Patients',
            icon: 'pi pi-users'
          },
          {
            label: 'Reviews',
            icon: 'pi pi-star'
          }
        ];

      case 'staff':
        return [
          ...commonItems,
          {
            label: 'Queue',
            icon: 'pi pi-list',
            badge: '12'
          },
          {
            label: 'Appointments',
            icon: 'pi pi-calendar'
          },
          {
            label: 'Payments',
            icon: 'pi pi-dollar'
          }
        ];

      case 'patient':
        return [
          ...commonItems,
          {
            label: 'Book Appointment',
            icon: 'pi pi-plus'
          },
          {
            label: 'My Appointments',
            icon: 'pi pi-calendar'
          },
          {
            label: 'Medical History',
            icon: 'pi pi-file-medical'
          }
        ];

      default:
        return commonItems;
    }
  };

  const start = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi-heart-fill text-primary text-2xl"></i>
      <span className="font-bold text-primary">HealthCare</span>
    </div>
  );

  const end = isAuthenticated ? (
    <div className="flex align-items-center gap-3">
      <i className="pi pi-bell p-overlay-badge cursor-pointer">
        <Badge value="3" severity="danger"></Badge>
      </i>
      <div className="flex align-items-center gap-2">
        <Avatar 
          label={user?.name?.charAt(0)} 
          className="bg-primary text-white"
          shape="circle" 
        />
        <div className="hidden md:block">
          <div className="font-medium">{user?.name}</div>
          <div className="text-sm text-600 capitalize">{user?.role}</div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <Menubar 
      model={getMenuItems()} 
      start={start} 
      end={end}
      className="border-none shadow-2"
    />
  );
};

export default Navbar;