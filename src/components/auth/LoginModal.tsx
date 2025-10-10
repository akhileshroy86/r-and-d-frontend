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
      
      // Navigate to appropriate dashboard
      const roleRoutes = {
        admin: '/admin',
        doctor: '/doctor',
        staff: '/staff',
        patient: '/'
      };
      
      const targetRoute = roleRoutes[response.user.role as keyof typeof roleRoutes] || '/';
      router.push(targetRoute);
      
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
    <div className="flex flex-column gap-4">
      {isSignup && (
        <div className="field">
          <label className="block text-900 font-medium mb-2">Full Name</label>
          <InputText
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your name"
            className="w-full"
          />
        </div>
      )}
      
      <div className="field">
        <label className="block text-900 font-medium mb-2">Email</label>
        <InputText
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter email"
          className="w-full"
          type="email"
        />
      </div>
      
      <div className="field">
        <label className="block text-900 font-medium mb-2">Password</label>
        <Password
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="Enter password"
          className="w-full"
          feedback={isSignup}
          toggleMask
        />
      </div>
      
      {isSignup && (
        <div className="field">
          <label className="block text-900 font-medium mb-2">Confirm Password</label>
          <Password
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm password"
            className="w-full"
            feedback={false}
            toggleMask
          />
        </div>
      )}
      
      <Button
        label={isSignup ? "Sign Up" : "Login"}
        onClick={handleSubmit}
        loading={loading}
        className="w-full"
      />
      
      <div className="text-center">
        <Button
          label={isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          link
          onClick={() => setIsSignup(!isSignup)}
        />
      </div>
    </div>
  );

  const renderStaffLogin = () => (
    <div className="flex flex-column gap-4">
      <div className="field">
        <label className="block text-900 font-medium mb-2">Email</label>
        <InputText
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter email"
          className="w-full"
        />
      </div>
      
      <div className="field">
        <label className="block text-900 font-medium mb-2">Password</label>
        <Password
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="Enter password"
          className="w-full"
          feedback={false}
          toggleMask
        />
      </div>
      
      <Button
        label="Login"
        onClick={handleSubmit}
        loading={loading}
        className="w-full"
      />
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
          <div className="flex align-items-center gap-2">
            <i className={getIcon()}></i>
            <span>{getTitle()}</span>
          </div>
        }
        visible={visible}
        onHide={() => {
          onHide();
          resetForm();
        }}
        style={{ width: '400px' }}
        modal
      >
        <div className="p-4">
          {getLoginContent()}
        </div>
      </Dialog>
    </>
  );
};

export default LoginModal;