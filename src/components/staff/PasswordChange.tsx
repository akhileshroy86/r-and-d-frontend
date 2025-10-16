'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { staffAuthService } from '../../services/api/staffAuthService';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

const PasswordChange: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentStaffEmail, setCurrentStaffEmail] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  
  // Password requirements
  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    { label: 'At least 6 characters', test: (pwd) => pwd.length >= 6, met: false },
    { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd), met: false },
    { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd), met: false },
    { label: 'Contains number', test: (pwd) => /[0-9]/.test(pwd), met: false },
    { label: 'Contains special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), met: false }
  ]);
  
  useEffect(() => {
    // Get logged-in staff email from localStorage
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.email) {
          setCurrentStaffEmail(user.email);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  
  // Update password requirements when new password changes
  useEffect(() => {
    const updatedRequirements = requirements.map(req => ({
      ...req,
      met: req.test(passwordData.newPassword)
    }));
    setRequirements(updatedRequirements);
  }, [passwordData.newPassword]);

  const validatePassword = () => {
    const errors = [];
    
    if (!currentStaffEmail) {
      errors.push('No staff email found. Please login again.');
    }
    
    if (!passwordData.currentPassword) {
      errors.push('Current password is required');
    }
    
    if (!passwordData.newPassword) {
      errors.push('New password is required');
    }
    
    if (!passwordData.confirmPassword) {
      errors.push('Password confirmation is required');
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.push('New password and confirmation do not match');
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.push('New password must be different from current password');
    }
    
    const unmetRequirements = requirements.filter(req => !req.met);
    if (unmetRequirements.length > 0) {
      errors.push(`Password requirements not met: ${unmetRequirements.map(req => req.label).join(', ')}`);
    }
    
    return errors;
  };
  
  const handlePasswordChange = async () => {
    const validationErrors = validatePassword();
    
    if (validationErrors.length > 0) {
      toast.current?.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: validationErrors[0],
        life: 4000
      });
      return;
    }

    setLoading(true);
    try {
      const result = await staffAuthService.changePassword({
        email: currentStaffEmail,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (result.success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Password Changed Successfully',
          detail: 'Your password has been updated. Please use your new password for future logins.',
          life: 5000
        });

        // Clear form
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowRequirements(false);
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Password Change Failed',
          detail: result.message || 'Failed to update password. Please check your current password.',
          life: 4000
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Backend Connection Error',
        detail: 'Cannot connect to backend server at localhost:3002. Please ensure the backend is running.',
        life: 5000
      });
    } finally {
      setLoading(false);
    }
  };
  
  const isFormValid = () => {
    return currentStaffEmail && 
           passwordData.currentPassword && 
           passwordData.newPassword && 
           passwordData.confirmPassword && 
           passwordData.newPassword === passwordData.confirmPassword &&
           passwordData.currentPassword !== passwordData.newPassword &&
           requirements.every(req => req.met);
  };

  return (
    <div className="password-change p-4">
      <Toast ref={toast} />
      
      <Card title="🔐 Change Password" className="max-w-2xl mx-auto">
        <div className="flex flex-column gap-4">
          {/* Current User Info */}
          {currentStaffEmail ? (
            <div className="p-3 border-round bg-blue-50 border-blue-200">
              <div className="flex align-items-center gap-2">
                <i className="pi pi-user text-blue-600"></i>
                <div>
                  <h4 className="mt-0 mb-1 text-blue-900">Logged in as:</h4>
                  <p className="m-0 text-blue-700 font-medium">{currentStaffEmail}</p>
                </div>
              </div>
            </div>
          ) : (
            <Message severity="warn" text="No user session found. Please login again." />
          )}

          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block mb-2 font-medium text-900">
              Current Password *
            </label>
            <Password
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full"
              placeholder="Enter your current password"
              toggleMask
              feedback={false}
            />
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block mb-2 font-medium text-900">
              New Password *
            </label>
            <Password
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => {
                setPasswordData({ ...passwordData, newPassword: e.target.value });
                setShowRequirements(true);
              }}
              className="w-full"
              placeholder="Enter new password"
              toggleMask
              feedback={false}
            />
          </div>

          {/* Password Requirements */}
          {showRequirements && passwordData.newPassword && (
            <div className="p-3 border-round surface-100">
              <h4 className="mt-0 mb-3 text-900">Password Requirements:</h4>
              <div className="grid">
                {requirements.map((req, index) => (
                  <div key={index} className="col-12 md:col-6">
                    <div className={`flex align-items-center gap-2 mb-2 ${req.met ? 'text-green-600' : 'text-600'}`}>
                      <i className={`pi ${req.met ? 'pi-check-circle' : 'pi-circle'} ${req.met ? 'text-green-500' : 'text-300'}`}></i>
                      <span className="text-sm">{req.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block mb-2 font-medium text-900">
              Confirm New Password *
            </label>
            <Password
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full"
              placeholder="Confirm your new password"
              toggleMask
              feedback={false}
            />
            {passwordData.confirmPassword && (
              <div className="mt-2">
                {passwordData.newPassword === passwordData.confirmPassword ? (
                  <small className="text-green-600 flex align-items-center gap-1">
                    <i className="pi pi-check"></i>
                    Passwords match
                  </small>
                ) : (
                  <small className="text-red-500 flex align-items-center gap-1">
                    <i className="pi pi-times"></i>
                    Passwords do not match
                  </small>
                )}
              </div>
            )}
          </div>

          {/* Same Password Warning */}
          {passwordData.currentPassword && passwordData.newPassword && passwordData.currentPassword === passwordData.newPassword && (
            <Message 
              severity="warn" 
              text="New password must be different from your current password" 
            />
          )}

          <Divider />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              label="Clear Form"
              icon="pi pi-refresh"
              outlined
              onClick={() => {
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setShowRequirements(false);
              }}
              disabled={loading}
              className="flex-1"
            />
            <Button
              label="Change Password"
              icon="pi pi-key"
              onClick={handlePasswordChange}
              loading={loading}
              disabled={!isFormValid()}
              className="flex-1"
            />
          </div>

          {/* Backend Connection Info */}
          <div className="p-3 border-round bg-blue-50 border-blue-200">
            <h4 className="mt-0 mb-2 text-blue-900">🔗 Backend Connection:</h4>
            <p className="text-blue-800 text-sm mb-2">
              Password changes are processed by the backend server at <code>localhost:3002</code>
            </p>
            <p className="text-blue-800 text-sm mb-0">
              Make sure the backend server is running before changing passwords.
            </p>
          </div>

          {/* Security Tips */}
          <div className="p-3 border-round bg-yellow-50 border-yellow-200">
            <h4 className="mt-0 mb-2 text-yellow-900">🛡️ Security Tips:</h4>
            <ul className="text-yellow-800 text-sm pl-3 mb-0">
              <li>Use a unique password that you don't use elsewhere</li>
              <li>Consider using a password manager</li>
              <li>Don't share your password with anyone</li>
              <li>Change your password regularly</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PasswordChange;