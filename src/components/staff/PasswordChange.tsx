'use client';

import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { staffAuthService } from '../../services/api/staffAuthService';

const PasswordChange: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.current?.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all password fields',
        life: 3000
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.current?.show({
        severity: 'error',
        summary: 'Password Mismatch',
        detail: 'New password and confirm password do not match',
        life: 3000
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.current?.show({
        severity: 'error',
        summary: 'Weak Password',
        detail: 'Password must be at least 6 characters long',
        life: 3000
      });
      return;
    }

    setLoading(true);
    try {
      const result = await staffAuthService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (result.success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Password Changed',
          detail: 'Your password has been updated successfully',
          life: 4000
        });

        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Password Change Failed',
          detail: result.message || 'Failed to update password',
          life: 3000
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'An error occurred while changing password',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-change p-4">
      <Toast ref={toast} />
      
      <Card title="Change Password" className="max-w-md mx-auto">
        <div className="flex flex-column gap-3">
          <div>
            <label htmlFor="currentPassword" className="block mb-2 font-medium">Current Password *</label>
            <Password
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full"
              placeholder="Enter current password"
              toggleMask
              feedback={false}
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block mb-2 font-medium">New Password *</label>
            <Password
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full"
              placeholder="Enter new password"
              toggleMask
              promptLabel="Choose a password"
              weakLabel="Too simple"
              mediumLabel="Average complexity"
              strongLabel="Complex password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 font-medium">Confirm New Password *</label>
            <Password
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full"
              placeholder="Confirm new password"
              toggleMask
              feedback={false}
            />
            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <small className="text-red-500">Passwords do not match</small>
            )}
          </div>

          <div className="p-3 border-round surface-100">
            <h4 className="mt-0 mb-2">Password Requirements:</h4>
            <ul className="list-none p-0 m-0">
              <li className={`flex align-items-center gap-2 mb-1 ${passwordData.newPassword.length >= 6 ? 'text-green-600' : 'text-600'}`}>
                <i className={`pi ${passwordData.newPassword.length >= 6 ? 'pi-check' : 'pi-circle'}`}></i>
                At least 6 characters
              </li>
              <li className={`flex align-items-center gap-2 mb-1 ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-600'}`}>
                <i className={`pi ${/[A-Z]/.test(passwordData.newPassword) ? 'pi-check' : 'pi-circle'}`}></i>
                One uppercase letter
              </li>
              <li className={`flex align-items-center gap-2 mb-1 ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-600'}`}>
                <i className={`pi ${/[a-z]/.test(passwordData.newPassword) ? 'pi-check' : 'pi-circle'}`}></i>
                One lowercase letter
              </li>
              <li className={`flex align-items-center gap-2 mb-1 ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-600'}`}>
                <i className={`pi ${/[0-9]/.test(passwordData.newPassword) ? 'pi-check' : 'pi-circle'}`}></i>
                One number
              </li>
            </ul>
          </div>

          <Button
            label="Change Password"
            icon="pi pi-key"
            onClick={handlePasswordChange}
            loading={loading}
            className="w-full"
            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || passwordData.newPassword !== passwordData.confirmPassword}
          />
        </div>
      </Card>
    </div>
  );
};

export default PasswordChange;