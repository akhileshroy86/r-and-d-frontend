'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'welcome': 'Welcome',
    'login': 'Login',
    'logout': 'Logout',
    'dashboard': 'Dashboard',
    'appointments': 'Appointments',
    'patients': 'Patients',
    'doctors': 'Doctors',
    'staff': 'Staff',
    'admin': 'Admin',
    'profile': 'Profile',
    'settings': 'Settings',
    'search': 'Search',
    'book_appointment': 'Book Appointment',
    'view_appointments': 'View Appointments',
    'medical_history': 'Medical History',
    'reviews': 'Reviews',
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'add': 'Add',
    'update': 'Update',
    'success': 'Success',
    'error': 'Error',
    'warning': 'Warning',
    'info': 'Information',
    'hero_title': 'Revolutionizing Healthcare Appointments',
    'hero_description': 'AI symptom capture, time-range booking, real-time queues, and seamless Razorpay/UPI payments. Transform your hospital operations with India\'s most advanced appointment management system.',
    'get_started_hospitals': 'Get Started (Hospitals)',
    'book_appointment_patients': 'Book Appointment (Patients)'
  },
  hi: {
    'welcome': 'स्वागत',
    'login': 'लॉगिन',
    'logout': 'लॉगआउट',
    'dashboard': 'डैशबोर्ड',
    'appointments': 'अपॉइंटमेंट',
    'patients': 'मरीज़',
    'doctors': 'डॉक्टर',
    'staff': 'स्टाफ',
    'admin': 'एडमिन',
    'profile': 'प्रोफाइल',
    'settings': 'सेटिंग्स',
    'search': 'खोजें',
    'book_appointment': 'अपॉइंटमेंट बुक करें',
    'view_appointments': 'अपॉइंटमेंट देखें',
    'medical_history': 'मेडिकल हिस्ट्री',
    'reviews': 'समीक्षा',
    'loading': 'लोड हो रहा है...',
    'save': 'सेव करें',
    'cancel': 'रद्द करें',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',
    'add': 'जोड़ें',
    'update': 'अपडेट करें',
    'success': 'सफलता',
    'error': 'त्रुटि',
    'warning': 'चेतावनी',
    'info': 'जानकारी',
    'hero_title': 'स्वास्थ्य सेवा अपॉइंटमेंट में क्रांति',
    'hero_description': 'AI लक्षण कैप्चर, समय-सीमा बुकिंग, रियल-टाइम क्यू, और निर्बाध Razorpay/UPI भुगतान। भारत की सबसे उन्नत अपॉइंटमेंट प्रबंधन प्रणाली के साथ अपने अस्पताल के संचालन को बदलें।',
    'get_started_hospitals': 'शुरू करें (अस्पताल)',
    'book_appointment_patients': 'अपॉइंटमेंट बुक करें (मरीज़)'
  },
  te: {
    'welcome': 'స్వాగతం',
    'login': 'లాగిన్',
    'logout': 'లాగౌట్',
    'dashboard': 'డాష్‌బోర్డ్',
    'appointments': 'అపాయింట్‌మెంట్‌లు',
    'patients': 'రోగులు',
    'doctors': 'వైద్యులు',
    'staff': 'సిబ్బంది',
    'admin': 'అడ్మిన్',
    'profile': 'ప్రొఫైల్',
    'settings': 'సెట్టింగ్‌లు',
    'search': 'వెతకండి',
    'book_appointment': 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    'view_appointments': 'అపాయింట్‌మెంట్‌లు చూడండి',
    'medical_history': 'వైద్య చరిత్ర',
    'reviews': 'సమీక్షలు',
    'loading': 'లోడ్ అవుతోంది...',
    'save': 'సేవ్ చేయండి',
    'cancel': 'రద్దు చేయండి',
    'edit': 'సవరించండి',
    'delete': 'తొలగించండి',
    'add': 'జోడించండి',
    'update': 'అప్‌డేట్ చేయండి',
    'success': 'విజయం',
    'error': 'లోపం',
    'warning': 'హెచ్చరిక',
    'info': 'సమాచారం',
    'hero_title': 'ఆరోగ్య సేవా అపాయింట్‌మెంట్‌లలో విప్లవం',
    'hero_description': 'AI లక్షణ క్యాప్చర్, టైమ్-రేంజ్ బుకింగ్, రియల్-టైమ్ క్యూలు, మరియు సీమ్‌లెస్ Razorpay/UPI చెల్లింపులు. భారతదేశపు అత్యంత అధునాతన అపాయింట్‌మెంట్ మేనేజ్‌మెంట్ సిస్టమ్‌తో మీ ఆసుపత్రి కార్యకలాపాలను మార్చండి।',
    'get_started_hospitals': 'ప్రారంభించండి (ఆసుపత్రులు)',
    'book_appointment_patients': 'అపాయింట్‌మెంట్ బుక్ చేయండి (రోగులు)'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi' || savedLanguage === 'te')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language as keyof typeof translations] || translations.en;
    return currentTranslations[key as keyof typeof currentTranslations] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}