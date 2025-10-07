'use client';

import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { adminAuthService } from '../../services/api/adminAuthService';

interface AdminAuthModalProps {
  visible: boolean;
  onHide: () => void;
}

const AdminAuthModal = ({ visible, onHide }: AdminAuthModalProps) => {
  const dispatch = useDispatch();
  const toast = useRef<Toast>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Email and password are required' });
      return false;
    }

    if (isSignUp) {
      if (!formData.name) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Name is required for signup' });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Passwords do not match' });
        return false;
      }
      if (formData.password.length < 6) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Password must be at least 6 characters' });
        return false;
      }
    }

    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    dispatch(loginStart());
    setLoading(true);

    try {
      const response = await adminAuthService.signIn({
        email: formData.email,
        password: formData.password
      });

      dispatch(loginSuccess({
        user: response.user,
        token: response.token
      }));

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: `Welcome back, ${response.user.name}!` 
      });

      onHide();
      resetForm();
    } catch (error: any) {
      dispatch(loginFailure());
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Login Failed', 
        detail: error.response?.data?.message || 'Invalid credentials' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await adminAuthService.signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Admin account created successfully! Please sign in.' 
      });

      setIsSignUp(false);
      setFormData(prev => ({ ...prev, name: '', confirmPassword: '' }));
    } catch (error: any) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Signup Failed', 
        detail: error.response?.data?.message || 'Failed to create account' 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setIsSignUp(false);
  };

  const passwordHeader = <div className="font-bold mb-3">Pick a password</div>;
  const passwordFooter = (
    <>
      <Divider />
      <p className="mt-2">Suggestions:</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 6 characters</li>
      </ul>
    </>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={
          <div className="flex align-items-center gap-2">
            <i className="pi pi-shield text-red-500"></i>
            <span>{isSignUp ? 'Admin Registration' : 'Admin Login'}</span>
          </div>
        }
        visible={visible}
        onHide={() => {
          onHide();
          resetForm();
        }}
        style={{ width: '450px' }}
        modal
      >
        <div className="p-4">
          {/* Development Notice */}
          <div className="bg-blue-50 border-left-3 border-blue-500 p-3 mb-4">
            <div className="flex align-items-center gap-2 mb-2">
              <i className="pi pi-info-circle text-blue-500"></i>
              <span className="font-medium text-blue-900">Development Mode</span>
            </div>
            <p className="text-sm text-blue-700 m-0">
              Use <strong>admin@test.com</strong> / <strong>admin123</strong> to sign in
            </p>
          </div>
          
          <div className="flex flex-column gap-4">
            {isSignUp && (
              <div className="field">
                <label className="block text-900 font-medium mb-2">Full Name *</label>
                <InputText
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </div>
            )}

            <div className="field">
              <label className="block text-900 font-medium mb-2">Email *</label>
              <InputText
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="admin@test.com"
                className="w-full"
                type="email"
              />
            </div>

            <div className="field">
              <label className="block text-900 font-medium mb-2">Password *</label>
              <Password
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
                className="w-full"
                toggleMask
                header={isSignUp ? passwordHeader : undefined}
                footer={isSignUp ? passwordFooter : undefined}
              />
            </div>

            {isSignUp && (
              <>
                <div className="field">
                  <label className="block text-900 font-medium mb-2">Confirm Password *</label>
                  <Password
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm password"
                    className="w-full"
                    toggleMask
                    feedback={false}
                  />
                </div>


              </>
            )}

            <Button
              label={isSignUp ? 'Create Admin Account' : 'Sign In'}
              onClick={isSignUp ? handleSignUp : handleSignIn}
              loading={loading}
              className="w-full p-3"
              severity="danger"
            />

            <Divider />

            <div className="text-center">
              <span className="text-600">
                {isSignUp ? 'Already have an account?' : "Don't have an admin account?"}
              </span>
              <Button
                label={isSignUp ? 'Sign In' : 'Create Account'}
                link
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AdminAuthModal;