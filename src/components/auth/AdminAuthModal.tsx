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
import { authService } from '../../services/api/authService';
import { useRouter } from 'next/navigation';

interface AdminAuthModalProps {
  visible: boolean;
  onHide: () => void;
}

const AdminAuthModal = ({ visible, onHide }: AdminAuthModalProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
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
      const credentials = {
        email: formData.email.trim(),
        password: formData.password.trim()
      };
      console.log('Admin login attempt:', credentials);
      const response = await authService.login(credentials);
      console.log('Admin login response:', response);

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
      router.push('/admin');
    } catch (error: any) {
      console.error('Admin login error:', error);
      dispatch(loginFailure());
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Login Failed', 
        detail: error.response?.data?.message || error.message || 'Invalid credentials' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'admin'
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 0'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dc2626',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="pi pi-shield" style={{ color: 'white', fontSize: '18px' }}></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>
                {isSignUp ? 'Admin Registration' : 'Admin Login'}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'white' }}>
                {isSignUp ? 'Create your admin account' : 'Welcome back! Please sign in to continue'}
              </p>
            </div>
          </div>
        }
        visible={visible}
        onHide={() => {
          onHide();
          resetForm();
        }}
        style={{ 
          width: '500px',
          borderRadius: '16px'
        }}
        contentStyle={{
          borderRadius: '0 0 16px 16px',
          padding: '0'
        }}
        headerStyle={{
          borderRadius: '16px 16px 0 0',
          backgroundColor: '#f8fafc',
          border: 'none',
          padding: '24px',
          borderBottom: '1px solid #e2e8f0'
        }}
        modal
        draggable={false}
        resizable={false}
      >
        <div style={{ padding: '24px' }}>
          {/* Development Notice */}
          <div className="bg-blue-50 border-left-3 border-blue-500 p-3 mb-4">
            <div className="flex align-items-center gap-2 mb-2">
              <i className="pi pi-info-circle text-blue-500"></i>
              <span className="font-medium text-blue-900">Development Mode</span>
            </div>
            <p className="text-sm text-blue-700 m-0">
              Use <strong>admin@hospital.com</strong> / <strong>admin123</strong> to sign in
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {isSignUp && (
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Full Name *</label>
                <InputText
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Email Address *</label>
              <InputText
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="admin@hospital.com"
                className="w-full"
                type="email"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Password *</label>
              <Password
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
                toggleMask
                header={isSignUp ? passwordHeader : undefined}
                footer={isSignUp ? passwordFooter : undefined}
                style={{ width: '100%' }}
                inputStyle={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }}
              />
            </div>

            {isSignUp && (
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Confirm Password *</label>
                <Password
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  toggleMask
                  feedback={false}
                  style={{ width: '100%' }}
                  inputStyle={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }}
                />
              </div>
            )}

            <Button
              label={isSignUp ? 'Create Admin Account' : 'Sign In'}
              onClick={isSignUp ? handleSignUp : handleSignIn}
              loading={loading}
              className="w-full p-3"
              severity="danger"
            />
            
            {!isSignUp && (
              <Button
                label="Test Mock Login"
                onClick={async () => {
                  try {
                    const response = await authService.login({ email: 'admin@hospital.com', password: 'admin123' });
                    console.log('Direct mock test success:', response);
                    toast.current?.show({ severity: 'success', summary: 'Test Success', detail: 'Mock service works!' });
                  } catch (error) {
                    console.error('Direct mock test failed:', error);
                    toast.current?.show({ severity: 'error', summary: 'Test Failed', detail: 'Mock service failed' });
                  }
                }}
                className="w-full"
                outlined
                size="small"
              />
            )}

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