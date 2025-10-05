'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Translation data
const translations = {
  en: {
    // Common
    staffDashboard: 'Staff Dashboard',
    welcomeBack: 'Welcome back',
    today: 'Today is',
    cashCollected: 'Cash Collected',
    onlinePayments: 'Online Payments',
    patientsServed: 'Patients Served',
    avgWaitTime: 'Avg Wait Time',
    addWalkIn: 'Add Walk-in',
    searchPatient: 'Search Patient',
    voiceSymptoms: 'Voice Symptoms',
    queueView: 'Queue View',
    generateReport: 'Generate Report',
    appointments: 'Appointments',
    queueManagement: 'Queue Management',
    drawerCounter: 'Drawer/Counter',
    transactionHistory: 'Transaction History',
    analytics: 'Analytics',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    saveSettings: 'Save Settings',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    
    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    patients: 'Patients',
    doctors: 'Doctors',
    staff: 'Staff',
    reports: 'Reports',
    profile: 'Profile',
    logout: 'Logout',
    
    // Patient related
    patientName: 'Patient Name',
    patientPhone: 'Patient Phone',
    patientEmail: 'Patient Email',
    patientAddress: 'Patient Address',
    patientAge: 'Patient Age',
    patientGender: 'Patient Gender',
    symptoms: 'Symptoms',
    diagnosis: 'Diagnosis',
    treatment: 'Treatment',
    prescription: 'Prescription',
    
    // Appointment related
    appointmentTime: 'Appointment Time',
    appointmentDate: 'Appointment Date',
    appointmentStatus: 'Appointment Status',
    bookAppointment: 'Book Appointment',
    rescheduleAppointment: 'Reschedule Appointment',
    cancelAppointment: 'Cancel Appointment',
    
    // Payment related
    paymentAmount: 'Payment Amount',
    paymentMethod: 'Payment Method',
    paymentStatus: 'Payment Status',
    paymentDate: 'Payment Date',
    recordPayment: 'Record Payment',
    
    // Status values
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    inProgress: 'In Progress',
    paid: 'Paid',
    unpaid: 'Unpaid',
    
    // Healthcare branding
    healthcare: 'HealthCare'
  },
  te: {
    // Common
    staffDashboard: 'స్టాఫ్ డాష్బోర్డ్',
    welcomeBack: 'తిరిగి స్వాగతం',
    today: 'ఈరోజు',
    cashCollected: 'నగదు సేకరణ',
    onlinePayments: 'ఆన్లైన్ చెల్లింపులు',
    patientsServed: 'రోగుల సేవ',
    avgWaitTime: 'సగటు వేచి ఉండే సమయం',
    addWalkIn: 'వాక్-ఇన్ జోడించు',
    searchPatient: 'రోగిని వెతకండి',
    voiceSymptoms: 'వాయిస్ లక్షణాలు',
    queueView: 'క్యూ వీక్షణ',
    generateReport: 'నివేదిక రూపొందించు',
    appointments: 'అపాయింట్మెంట్లు',
    queueManagement: 'క్యూ నిర్వహణ',
    drawerCounter: 'డ్రాయర్/కౌంటర్',
    transactionHistory: 'లావాదేవీ చరిత్ర',
    analytics: 'విశ్లేషణలు',
    settings: 'సెట్టింగులు',
    language: 'భాష',
    theme: 'థీమ్',
    saveSettings: 'సెట్టింగులు సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    save: 'సేవ్ చేయండి',
    close: 'మూసివేయండి',
    edit: 'సవరించండి',
    delete: 'తొలగించండి',
    add: 'జోడించండి',
    view: 'చూడండి',
    search: 'వెతకండి',
    filter: 'ఫిల్టర్',
    export: 'ఎగుమతి',
    import: 'దిగుమతి',
    refresh: 'రిఫ్రెష్',
    loading: 'లోడ్ అవుతోంది...',
    error: 'లోపం',
    success: 'విజయం',
    warning: 'హెచ్చరిక',
    info: 'సమాచారం',
    
    // Navigation
    home: 'హోమ్',
    dashboard: 'డాష్బోర్డ్',
    patients: 'రోగులు',
    doctors: 'వైద్యులు',
    staff: 'సిబ్బంది',
    reports: 'నివేదికలు',
    profile: 'ప్రొఫైల్',
    logout: 'లాగ్అవుట్',
    
    // Patient related
    patientName: 'రోగి పేరు',
    patientPhone: 'రోగి ఫోన్',
    patientEmail: 'రోగి ఇమెయిల్',
    patientAddress: 'రోగి చిరునామా',
    patientAge: 'రోగి వయస్సు',
    patientGender: 'రోగి లింగం',
    symptoms: 'లక్షణాలు',
    diagnosis: 'రోగ నిర్ధారణ',
    treatment: 'చికిత్స',
    prescription: 'ప్రిస్క్రిప్షన్',
    
    // Appointment related
    appointmentTime: 'అపాయింట్మెంట్ సమయం',
    appointmentDate: 'అపాయింట్మెంట్ తేదీ',
    appointmentStatus: 'అపాయింట్మెంట్ స్థితి',
    bookAppointment: 'అపాయింట్మెంట్ బుక్ చేయండి',
    rescheduleAppointment: 'అపాయింట్మెంట్ మార్చండి',
    cancelAppointment: 'అపాయింట్మెంట్ రద్దు చేయండి',
    
    // Payment related
    paymentAmount: 'చెల్లింపు మొత్తం',
    paymentMethod: 'చెల్లింపు పద్ధతి',
    paymentStatus: 'చెల్లింపు స్థితి',
    paymentDate: 'చెల్లింపు తేదీ',
    recordPayment: 'చెల్లింపు రికార్డ్ చేయండి',
    
    // Status values
    pending: 'పెండింగ్',
    confirmed: 'ధృవీకరించబడింది',
    completed: 'పూర్తయింది',
    cancelled: 'రద్దు చేయబడింది',
    inProgress: 'ప్రగతిలో',
    paid: 'చెల్లించబడింది',
    unpaid: 'చెల్లించబడలేదు',
    
    // Healthcare branding
    healthcare: 'ఆరోగ్య సంరక్షణ'
  },
  hi: {
    // Common
    staffDashboard: 'स्टाफ डैशबोर्ड',
    welcomeBack: 'वापसी पर स्वागत है',
    today: 'आज है',
    cashCollected: 'नकद संग्रह',
    onlinePayments: 'ऑनलाइन भुगतान',
    patientsServed: 'मरीजों की सेवा',
    avgWaitTime: 'औसत प्रतीक्षा समय',
    addWalkIn: 'वॉक-इन जोड़ें',
    searchPatient: 'मरीज खोजें',
    voiceSymptoms: 'आवाज लक्षण',
    queueView: 'कतार दृश्य',
    generateReport: 'रिपोर्ट बनाएं',
    appointments: 'अपॉइंटमेंट्स',
    queueManagement: 'कतार प्रबंधन',
    drawerCounter: 'ड्रॉअर/काउंटर',
    transactionHistory: 'लेनदेन इतिहास',
    analytics: 'विश्लेषण',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    theme: 'थीम',
    saveSettings: 'सेटिंग्स सेव करें',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    close: 'बंद करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    add: 'जोड़ें',
    view: 'देखें',
    search: 'खोजें',
    filter: 'फिल्टर',
    export: 'निर्यात',
    import: 'आयात',
    refresh: 'रिफ्रेश',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    warning: 'चेतावनी',
    info: 'जानकारी',
    
    // Navigation
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    patients: 'मरीज',
    doctors: 'डॉक्टर',
    staff: 'स्टाफ',
    reports: 'रिपोर्ट्स',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    
    // Patient related
    patientName: 'मरीज का नाम',
    patientPhone: 'मरीज का फोन',
    patientEmail: 'मरीज का ईमेल',
    patientAddress: 'मरीज का पता',
    patientAge: 'मरीज की उम्र',
    patientGender: 'मरीज का लिंग',
    symptoms: 'लक्षण',
    diagnosis: 'निदान',
    treatment: 'उपचार',
    prescription: 'नुस्खा',
    
    // Appointment related
    appointmentTime: 'अपॉइंटमेंट समय',
    appointmentDate: 'अपॉइंटमेंट तारीख',
    appointmentStatus: 'अपॉइंटमेंट स्थिति',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    rescheduleAppointment: 'अपॉइंटमेंट रीशेड्यूल करें',
    cancelAppointment: 'अपॉइंटमेंट रद्द करें',
    
    // Payment related
    paymentAmount: 'भुगतान राशि',
    paymentMethod: 'भुगतान विधि',
    paymentStatus: 'भुगतान स्थिति',
    paymentDate: 'भुगतान तारीख',
    recordPayment: 'भुगतान रिकॉर्ड करें',
    
    // Status values
    pending: 'लंबित',
    confirmed: 'पुष्ट',
    completed: 'पूर्ण',
    cancelled: 'रद्द',
    inProgress: 'प्रगति में',
    paid: 'भुगतान किया गया',
    unpaid: 'भुगतान नहीं किया गया',
    
    // Healthcare branding
    healthcare: 'स्वास्थ्य सेवा'
  }
};

type Language = 'en' | 'te' | 'hi';
type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  availableLanguages: { code: Language; name: string; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const availableLanguages = [
    { code: 'en' as Language, name: 'English', nativeName: 'English' },
    { code: 'te' as Language, name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी' }
  ];

  // Load language from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('staffSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.language && ['en', 'te', 'hi'].includes(settings.language)) {
          setLanguageState(settings.language);
          document.documentElement.lang = settings.language;
        }
      } catch (error) {
        console.error('Error loading language settings:', error);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    
    // Update localStorage
    const savedSettings = localStorage.getItem('staffSettings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    settings.language = lang;
    localStorage.setItem('staffSettings', JSON.stringify(settings));
  };

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    availableLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;