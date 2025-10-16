'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Menu } from 'primereact/menu';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../hooks/custom/useAdminAuth';
import { RootState } from '../../store';

const AdminHeader: React.FC = () => {
  const router = useRouter();
  const { signOut } = useAdminAuth();
  const { user } = useSelector((state: RootState) => state.auth);
  const menuRef = useRef<Menu>(null);
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    setUserName(user?.name || 'Admin User');
  }, [user]);
  
  const campusOptions = [
    { label: 'Main Campus', value: 'main' },
    { label: 'Branch Campus', value: 'branch' }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      router.push('/');
    }
  };

  const handleAddDoctor = () => {
    router.push('/admin/add-doctor');
  };

  const handleAddStaff = () => {
    router.push('/admin/add-staff');
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="bg-white border-bottom-1 surface-border px-4 py-2">
        <div className="flex justify-content-between align-items-center">
          {/* Logo */}
          <div className="flex align-items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
            <div className="bg-blue-500 text-white p-2 border-round">
              <i className="pi pi-building text-xl"></i>
            </div>
            <span className="text-xl font-bold text-900">Health</span>
          </div>

          {/* Center - Campus Dropdown */}
          <div className="flex align-items-center">
            <Dropdown
              value="main"
              options={campusOptions}
              className="w-10rem"
              placeholder="Select Campus"
            />
          </div>

          {/* Right Side */}
          <div className="flex align-items-center gap-3">
            {/* Notification */}
            <div className="relative">
              <i className="pi pi-bell text-xl cursor-pointer text-600"></i>
              <Badge value="3" severity="danger" className="absolute" style={{ top: '-8px', right: '-8px' }}></Badge>
            </div>

            {/* Help */}
            <i className="pi pi-question-circle text-xl cursor-pointer text-600"></i>

            {/* Language */}
            <span className="text-600">English</span>

            {/* User Menu */}
            <div className="flex align-items-center gap-2">
              <span className="text-600 hidden md:inline">{userName}</span>
              <Avatar 
                label={userName?.charAt(0) || 'A'}
                shape="circle" 
                size="normal"
                className="cursor-pointer bg-blue-500 text-white"
                onClick={(e) => menuRef.current?.toggle(e)}
              />
              <Menu
                ref={menuRef}
                model={[
                  {
                    label: 'Profile',
                    icon: 'pi pi-user',
                    command: () => router.push('/admin/profile')
                  },
                  {
                    label: 'Settings',
                    icon: 'pi pi-cog'
                  },
                  {
                    separator: true
                  },
                  {
                    label: 'Sign Out',
                    icon: 'pi pi-sign-out',
                    command: handleSignOut
                  }
                ]}
                popup
              />
            </div>
            
            {/* Sign Out Button */}
            <Button
              label="Sign Out"
              icon="pi pi-sign-out"
              className="p-button-outlined p-button-sm"
              onClick={handleSignOut}
            />
          </div>
        </div>
      </div>

      {/* Blue Header Section */}
      <div className="text-white px-4 py-4" style={{ background: 'linear-gradient(to right, #1e40af, #2563eb)' }}>
        <div className="flex flex-column lg:flex-row justify-content-between align-items-start lg:align-items-center gap-3">
          {/* Left Side - Greeting */}
          <div>
            <h2 className="text-white m-0 mb-1">Good morning, {userName} 👋</h2>
            <p className="text-blue-100 m-0">Here's today's snapshot for Apollo Medical Center.</p>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <Button
              label="Add Appointment"
              icon="pi pi-plus"
              className="bg-white text-blue-500 border-white p-button-sm lg:p-button-normal flex-1 lg:flex-none"
              outlined
            />
            <Button
              label="Open Queues"
              icon="pi pi-list"
              className="bg-blue-600 text-white border-blue-600 p-button-sm lg:p-button-normal flex-1 lg:flex-none"
            />
            <Button
              label="Add Doctor"
              icon="pi pi-user-plus"
              className="bg-blue-600 text-white border-blue-600 p-button-sm lg:p-button-normal flex-1 lg:flex-none"
              onClick={handleAddDoctor}
            />
            <Button
              label="Add Staff"
              icon="pi pi-users"
              className="bg-blue-600 text-white border-blue-600 p-button-sm lg:p-button-normal flex-1 lg:flex-none"
              onClick={handleAddStaff}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;