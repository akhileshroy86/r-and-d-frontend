'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import ClientOnly from '../components/common/ClientOnly';
import LoadingSpinner from '../components/common/LoadingSpinner';
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

import LoginModal from '../components/auth/LoginModal';
import AdminAuthModal from '../components/auth/AdminAuthModal';
import { useAdminAuth } from '../hooks/custom/useAdminAuth';
import PatientDashboard from '../components/patient/PatientDashboard';
import AdminDashboard from '../components/admin/AdminDashboard';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import StaffDashboard from '../components/staff/StaffDashboard';

interface RootState {
  auth: {
    user: any;
    isAuthenticated: boolean;
  };
}

function HomeContent() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { loading: adminLoading } = useAdminAuth();
  
  const [loginModal, setLoginModal] = useState<{
    visible: boolean;
    userType: 'patient' | 'doctor' | 'staff' | 'admin';
  }>({ visible: false, userType: 'patient' });
  const [adminAuthModal, setAdminAuthModal] = useState(false);

  // Show loading while checking admin authentication
  if (adminLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  const openLoginModal = (userType: 'patient' | 'doctor' | 'staff' | 'admin') => {
    if (userType === 'admin') {
      setAdminAuthModal(true);
    } else {
      setLoginModal({ visible: true, userType });
    }
  };

  const closeLoginModal = () => {
    setLoginModal(prev => ({ ...prev, visible: false }));
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
        <div id="features"><FeaturesSection onOpenLoginModal={openLoginModal} /></div>
        <div id="screens"><PlatformScreensSection /></div>
        <BenefitsSection />
        <TestimonialsSection />
        <div id="pricing"><PricingSection /></div>
        <SecuritySection />
        <EnterpriseSecuritySection />
        <IntegrationsSection />
        <ApiArchitectureSection />
        <CtaSection />
        <div id="contact"><FooterSection /></div>
        
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

  // Render appropriate dashboard based on user role
  switch (user?.role?.toLowerCase()) {
    case 'admin':
      return <AdminDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'patient':
    default:
      return <PatientDashboard />;
  }
}

export default function Home() {
  return (
    <ClientOnly
      fallback={<LoadingSpinner />}
    >
      <HomeContent />
    </ClientOnly>
  );
}