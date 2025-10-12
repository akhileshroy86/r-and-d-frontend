'use client';

import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { authService } from '../../services/api/authService';

interface LoginModalProps {
  visible: boolean;
  onHide: () => void;
  userType: 'patient' | 'doctor' | 'staff' | 'admin';
}

const LoginModal = ({ visible, onHide, userType }: LoginModalProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);



  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  const handleSubmit = async () => {
    dispatch(loginStart());
    setLoading(true);

    try {
      let response;
      
      if (userType === 'patient') {
        if (isSignup) {
          // Patient signup validation
          if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'All fields are required' });
            setLoading(false);
            return;
          }
          if (formData.password !== formData.confirmPassword) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Passwords do not match' });
            setLoading(false);
            return;
          }
          response = await authService.registerPatient({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword
          });
        } else {
          // Patient login
          if (!formData.email || !formData.password) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Email and password required' });
            setLoading(false);
            return;
          }
          response = await authService.login({ email: formData.email, password: formData.password });
        }
      } else {
        // Staff/Doctor/Admin login
        if (!formData.email || !formData.password) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Email and password required' });
          setLoading(false);
          return;
        }
        response = await authService.login({ email: formData.email, password: formData.password });
      }

      // Debug: Log the response
      console.log('Login response:', response);
      console.log('User role:', response.user.role);
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      dispatch(loginSuccess({
        user: response.user,
        token: response.token
      }));
      
      onHide();
      resetForm();
      
      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Don't navigate - let the main page handle routing based on user role
      // The main page will automatically show the correct dashboard
      
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: `Welcome ${response.user.name}!` 
      });
    } catch (error: any) {
      dispatch(loginFailure());
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.response?.data?.message || 'Authentication failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
    setIsSignup(false);
  };

  const renderPatientAuth = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {isSignup && (
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Full Name</label>
          <InputText
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
          />
        </div>
      )}
      
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Email Address</label>
        <InputText
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email"
          type="email"
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Password</label>
        <Password
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="Enter your password"
          feedback={isSignup}
          toggleMask
          style={{ width: '100%' }}
          inputStyle={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }}
        />
      </div>
      
      {isSignup && (
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Confirm Password</label>
          <Password
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            feedback={false}
            toggleMask
            style={{ width: '100%' }}
            inputStyle={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }}
          />
        </div>
      )}
      
      <Button
        label={isSignup ? "Create Account" : "Sign In"}
        onClick={handleSubmit}
        loading={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#3b82f6',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          marginTop: '8px'
        }}
      />
      
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
        </span>
        <Button
          label={isSignup ? " Sign In" : " Sign Up"}
          link
          onClick={() => setIsSignup(!isSignup)}
          style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6', padding: '0 4px' }}
        />
      </div>
    </div>
  );

  const renderStaffLogin = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Email Address</label>
        <InputText
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email"
          type="email"
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Password</label>
        <Password
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="Enter your password"
          feedback={false}
          toggleMask
          style={{ width: '100%' }}
          inputStyle={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }}
        />
      </div>
      
      <Button
        label="Sign In"
        onClick={handleSubmit}
        loading={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#3b82f6',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          marginTop: '8px'
        }}
      />
      
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <a href="#" style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none' }}>
          Forgot your password?
        </a>
      </div>
    </div>
  );

  const getLoginContent = () => {
    switch (userType) {
      case 'patient':
        return renderPatientAuth();
      case 'staff':
      case 'doctor':
      case 'admin':
        return renderStaffLogin();
      default:
        return null;
    }
  };

  const getTitle = () => {
    const titles = {
      patient: 'Patient Login',
      doctor: 'Doctor Login',
      staff: 'Staff Login',
      admin: 'Admin Login'
    };
    return titles[userType];
  };

  const getIcon = () => {
    const icons = {
      patient: 'pi pi-user',
      doctor: 'pi pi-user-edit',
      staff: 'pi pi-users',
      admin: 'pi pi-cog'
    };
    return icons[userType];
  };

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
              backgroundColor: '#3b82f6',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className={getIcon()} style={{ color: 'white', fontSize: '18px' }}></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>
                {getTitle()}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'white' }}>
                Welcome back! Please sign in to continue
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
          width: '450px',
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
          {getLoginContent()}
        </div>
      </Dialog>
    </>
  );
};

export default LoginModal;