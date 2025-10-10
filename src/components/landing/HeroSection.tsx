'use client';

import { useLanguage } from '../../contexts/LanguageContext';

interface HeroSectionProps {
  onOpenLoginModal: (userType: 'patient' | 'doctor' | 'staff' | 'admin') => void;
}

export default function HeroSection({ onOpenLoginModal }: HeroSectionProps) {
  const { language, setLanguage, t } = useLanguage();
  
  const getLanguageDisplay = (lang: string) => {
    switch(lang) {
      case 'en': return 'English';
      case 'hi': return 'हिंदी';
      case 'te': return 'తెలుగు';
      default: return 'English';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Navbar */}
      <nav style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>🏥</span>
              </div>
              <span style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '24px' }}>HealthcareMS</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ display: 'flex', gap: '30px' }}>
              <a href="#" style={{ color: '#1f2937', textDecoration: 'none', fontWeight: '600' }}>Features</a>
              <a href="#" style={{ color: '#1f2937', textDecoration: 'none', fontWeight: '600' }}>How it works</a>
              <a href="#" style={{ color: '#1f2937', textDecoration: 'none', fontWeight: '600' }}>Screens</a>
              <a href="#" style={{ color: '#1f2937', textDecoration: 'none', fontWeight: '600' }}>Pricing</a>
              <a href="#" style={{ color: '#1f2937', textDecoration: 'none', fontWeight: '600' }}>Contact</a>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="te">తెలుగు</option>
              </select>
              
              <button 
                onClick={() => onOpenLoginModal('patient')}
                style={{
                  color: '#1f2937',
                  background: 'none',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {t('login')}
              </button>
              
              <button style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease'
              }}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
        minHeight: 'calc(100vh - 70px)'
      }}>
        {/* Left Content */}
        <div style={{ color: 'white' }}>
          <h1 style={{
            fontSize: '56px',
            fontWeight: 'bold',
            lineHeight: '1.1',
            marginBottom: '24px',
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            {t('hero_title')}
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: '#ffffff',
            marginBottom: '40px',
            lineHeight: '1.6',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
          }}>
            {t('hero_description')}
          </p>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onOpenLoginModal('admin')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '18px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              {t('get_started_hospitals')}
            </button>
            
            <button 
              onClick={() => onOpenLoginModal('patient')}
              style={{
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '16px 32px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {t('book_appointment_patients')}
            </button>
          </div>
        </div>
        
        {/* Right Dashboard Mockup */}
        <div style={{ position: 'relative' }}>
          <img 
            src="/040a99ed1e-8392ad04c30f224d5d62.png" 
            alt="Healthcare Dashboard" 
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '20px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>
      </div>
    </div>
  );
}