'use client';

import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { useAdminAuth } from '../../hooks/custom/useAdminAuth';
import { useRouter } from 'next/navigation';

const AdminProfile = () => {
  const { user, updateProfile, changePassword, signOut, loading } = useAdminAuth();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  
  const [editMode, setEditMode] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData);
      setEditMode(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Profile updated successfully'
      });
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match'
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Password must be at least 6 characters'
      });
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Password changed successfully'
      });
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.current?.show({
        severity: 'info',
        summary: 'Signed Out',
        detail: 'You have been signed out successfully'
      });
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error signing out'
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      
      <div className="grid">
        <div className="col-12 md:col-8 lg:col-6">
          <Card title="Admin Profile" className="shadow-2">
            <div className="flex flex-column gap-4">
              <div className="flex align-items-center gap-3 mb-3">
                <i className="pi pi-user-edit text-3xl text-primary"></i>
                <div>
                  <h3 className="m-0">{user?.name}</h3>
                  <p className="text-600 m-0">{user?.email}</p>
                  <small className="text-500">Administrator</small>
                </div>
              </div>

              <Divider />

              {editMode ? (
                <>
                  <div className="field">
                    <label className="block text-900 font-medium mb-2">Name</label>
                    <InputText
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full"
                    />
                  </div>

                  <div className="field">
                    <label className="block text-900 font-medium mb-2">Email</label>
                    <InputText
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full"
                      type="email"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      label="Save Changes"
                      onClick={handleProfileUpdate}
                      loading={loading}
                      className="flex-1"
                    />
                    <Button
                      label="Cancel"
                      outlined
                      onClick={() => {
                        setEditMode(false);
                        setProfileData({ name: user?.name || '', email: user?.email || '' });
                      }}
                      className="flex-1"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-column gap-3">
                    <div>
                      <label className="block text-600 font-medium mb-1">Name</label>
                      <p className="text-900 m-0">{user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-600 font-medium mb-1">Email</label>
                      <p className="text-900 m-0">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-600 font-medium mb-1">Role</label>
                      <p className="text-900 m-0">System Administrator</p>
                    </div>
                    {user?.createdAt && (
                      <div>
                        <label className="block text-600 font-medium mb-1">Member Since</label>
                        <p className="text-900 m-0">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-column gap-2 mt-4">
                    <Button
                      label="Edit Profile"
                      icon="pi pi-pencil"
                      onClick={() => setEditMode(true)}
                      className="w-full"
                    />
                    <Button
                      label="Change Password"
                      icon="pi pi-key"
                      outlined
                      onClick={() => setPasswordDialog(true)}
                      className="w-full"
                    />
                    <Button
                      label="Back to Dashboard"
                      icon="pi pi-arrow-left"
                      outlined
                      onClick={() => router.push('/')}
                      className="w-full"
                    />
                    <Button
                      label="Sign Out"
                      icon="pi pi-sign-out"
                      severity="danger"
                      outlined
                      onClick={handleSignOut}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Dialog
        header="Change Password"
        visible={passwordDialog}
        onHide={() => setPasswordDialog(false)}
        style={{ width: '400px' }}
        modal
      >
        <div className="flex flex-column gap-4">
          <div className="field">
            <label className="block text-900 font-medium mb-2">Current Password</label>
            <Password
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full"
              feedback={false}
              toggleMask
            />
          </div>

          <div className="field">
            <label className="block text-900 font-medium mb-2">New Password</label>
            <Password
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full"
              toggleMask
            />
          </div>

          <div className="field">
            <label className="block text-900 font-medium mb-2">Confirm New Password</label>
            <Password
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full"
              feedback={false}
              toggleMask
            />
          </div>

          <div className="flex gap-2">
            <Button
              label="Change Password"
              onClick={handlePasswordChange}
              loading={loading}
              className="flex-1"
            />
            <Button
              label="Cancel"
              outlined
              onClick={() => {
                setPasswordDialog(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              className="flex-1"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AdminProfile;