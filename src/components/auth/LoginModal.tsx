'use client';

import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';

interface LoginModalProps {
  visible: boolean;
  onHide: () => void;
  userType: 'patient' | 'doctor' | 'staff' | 'admin';
}

const LoginModal = ({ visible, onHide, userType }: LoginModalProps) => {
  const dispatch = useDispatch();
  const toast = useRef<Toast>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobile: '',
    otp: '',
    name: '',
    language: 'en'
  });
  const [isSignup, setIsSignup] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Telugu', value: 'te' },
    { label: 'Hindi', value: 'hi' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sendOTP = async () => {
    if (!formData.mobile || formData.mobile.length !== 10) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Enter valid mobile number' });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'OTP sent' });
    }, 1000);
  };

  const handleLogin = async () => {
    dispatch(loginStart());
    setLoading(true);

    setTimeout(() => {
      const mockUser = {
        id: '1',
        email: formData.email || formData.mobile,
        role: userType,
        name: formData.name || `${userType.charAt(0).toUpperCase() + userType.slice(1)} User`
      };
      
      dispatch(loginSuccess({
        user: mockUser,
        token: 'mock-jwt-token'
      }));
      
      setLoading(false);
      onHide();
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: `Welcome ${mockUser.name}!` 
      });
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      mobile: '',
      otp: '',
      name: '',
      language: 'en'
    });
    setIsSignup(false);
    setOtpSent(false);
  };

  const renderPatientLogin = () => (
    <div className="flex flex-column gap-4">
      <div className="field">
        <label className="block text-900 font-medium mb-2">Mobile Number</label>
        <InputText
          value={formData.mobile}
          onChange={(e) => handleInputChange('mobile', e.target.value)}
          placeholder="Enter 10-digit mobile"
          className="w-full"
          maxLength={10}
        />
      </div>
      
      {!otpSent ? (
        <Button
          label="Send OTP"
          onClick={sendOTP}
          loading={loading}
          className="w-full"
        />
      ) : (
        <>
          <div className="field">
            <label className="block text-900 font-medium mb-2">Enter OTP</label>
            <InputText
              value={formData.otp}
              onChange={(e) => handleInputChange('otp', e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full"
              maxLength={6}
            />
          </div>
          
          {isSignup && (
            <>
              <div className="field">
                <label className="block text-900 font-medium mb-2">Full Name</label>
                <InputText
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                  className="w-full"
                />
              </div>
              
              <div className="field">
                <label className="block text-900 font-medium mb-2">Language</label>
                <Dropdown
                  value={formData.language}
                  options={languages}
                  onChange={(e) => handleInputChange('language', e.value)}
                  className="w-full"
                />
              </div>
            </>
          )}
          
          <Button
            label={isSignup ? "Sign Up" : "Login"}
            onClick={handleLogin}
            loading={loading}
            className="w-full"
          />
          
          <div className="text-center">
            <Button
              label={isSignup ? "Login" : "Sign Up"}
              link
              onClick={() => setIsSignup(!isSignup)}
            />
          </div>
        </>
      )}
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
        onClick={handleLogin}
        loading={loading}
        className="w-full"
      />
    </div>
  );

  const getLoginContent = () => {
    switch (userType) {
      case 'patient':
        return renderPatientLogin();
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