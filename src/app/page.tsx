'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import PlatformScreensSection from '../components/landing/PlatformScreensSection';
import BenefitsSection from '../components/landing/BenefitsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import SecuritySection from '../components/landing/SecuritySection';
import EnterpriseSecuritySection from '../components/landing/EnterpriseSecuritySection';
import IntegrationsSection from '../components/landing/IntegrationsSection';
import ApiArchitectureSection from '../components/landing/ApiArchitectureSection';
import CtaSection from '../components/landing/CtaSection';
import FooterSection from '../components/landing/FooterSection';
import LoginSection from '../components/landing/LoginSection';
import LoginModal from '../components/auth/LoginModal';
import AdminAuthModal from '../components/auth/AdminAuthModal';
import { useAdminAuth } from '../hooks/custom/useAdminAuth';
import HomePage from '../components/patient/HomePage';
import AdminDashboard from '../components/admin/AdminDashboard';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import StaffDashboard from '../components/staff/StaffDashboard';

interface RootState {
  auth: {
    user: any;
    isAuthenticated: boolean;
  };
}

export default function Home() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { loading: adminLoading } = useAdminAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const [loginModal, setLoginModal] = useState<{
    visible: boolean;
    userType: 'patient' | 'doctor' | 'staff' | 'admin';
  }>({ visible: false, userType: 'patient' });
  const [adminAuthModal, setAdminAuthModal] = useState(false);

  // Show loading while checking authentication or mounting
  if (adminLoading || !mounted) {
    return (
      <div className="min-h-screen flex align-items-center justify-content-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const openLoginModal = (userType: 'patient' | 'doctor' | 'staff' | 'admin') => {
    if (userType === 'admin') {
      setAdminAuthModal(true);
    } else {
      setLoginModal({ visible: true, userType });
    }
  };

  const closeLoginModal = () => {
    setLoginModal({ visible: false, userType: 'patient' });
  };

  if (!isAuthenticated) {
    return (
      <div style={{ 
        width: '100vw', 
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        position: 'relative'
      }}>
        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
          }
        `}</style>
        <HeroSection onOpenLoginModal={openLoginModal} />
        <FeaturesSection onOpenLoginModal={openLoginModal} />
        <PlatformScreensSection />
        <BenefitsSection />
        <TestimonialsSection />
        <PricingSection />
        <SecuritySection />
        <EnterpriseSecuritySection />
        <IntegrationsSection />
        <ApiArchitectureSection />
        <CtaSection />
        <FooterSection />
        <LoginSection onOpenLoginModal={openLoginModal} />
        
        <LoginModal
          visible={loginModal.visible}
          onHide={closeLoginModal}
          userType={loginModal.userType}
        />
        
        <AdminAuthModal
          visible={adminAuthModal}
          onHide={() => setAdminAuthModal(false)}
        />
      </div>
    );
  }

  // Render dashboard based on user role
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'patient':
    default:
      return <HomePage />;
  }
}