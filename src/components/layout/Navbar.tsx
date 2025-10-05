'use client';

import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useLanguage } from '../../contexts/LanguageContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { t } = useLanguage();

  const getMenuItems = () => {
    if (!isAuthenticated || !user) return [];

    const commonItems = [
      {
        label: t('home'),
        icon: 'pi pi-home',
        command: () => window.location.href = '/'
      }
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...commonItems,
          {
            label: t('doctors'),
            icon: 'pi pi-users',
            items: [
              { label: 'Manage Doctors', icon: 'pi pi-user-plus' },
              { label: 'Doctor Schedules', icon: 'pi pi-calendar' }
            ]
          },
          {
            label: t('staff'),
            icon: 'pi pi-id-card',
            items: [
              { label: 'Manage Staff', icon: 'pi pi-user-plus' },
              { label: 'Staff Reports', icon: 'pi pi-chart-bar' }
            ]
          },
          {
            label: t('analytics'),
            icon: 'pi pi-chart-line',
            items: [
              { label: 'Revenue Reports', icon: 'pi pi-dollar' },
              { label: 'Patient Analytics', icon: 'pi pi-users' }
            ]
          },
          {
            label: t('settings'),
            icon: 'pi pi-cog'
          }
        ];

      case 'doctor':
        return [
          ...commonItems,
          {
            label: t('appointments'),
            icon: 'pi pi-calendar',
            badge: '5'
          },
          {
            label: t('patients'),
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
            label: t('appointments'),
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
            label: t('bookAppointment'),
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
    <div className="flex align-items-center gap-2 px-3 py-2 border-round" style={{ backgroundColor: '#f8f9fa' }}>
      <i className="pi pi-heart-fill text-2xl" style={{ color: '#dc3545' }}></i>
      <span className="font-bold" style={{ color: '#2c3e50' }}>{t('healthcare')}</span>
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