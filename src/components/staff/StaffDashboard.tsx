'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import './StaffDashboard.css';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { TabView, TabPanel } from 'primereact/tabview';
import { Chart } from 'primereact/chart';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import { Sidebar } from 'primereact/sidebar';
import { Timeline } from 'primereact/timeline';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { InputTextarea } from 'primereact/inputtextarea';
import { Password } from 'primereact/password';
import { Chip } from 'primereact/chip';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Skeleton } from 'primereact/skeleton';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { format, addMinutes, isToday } from 'date-fns';
import { useStaffDashboard, useVoiceRecording } from '../../hooks/useStaffDashboard';
import { WalkInData, SearchFilters, ReportFilters } from '../../types/staff';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockAuthService } from '../../services/api/mockAuthService';

// Simple translations
const translations = {
  en: {
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
    cancel: 'Cancel'
  },
  te: {
    staffDashboard: 'స్టాఫ్ డాష్‌బోర్డ్',
    welcomeBack: 'తిరిగి స్వాగతం',
    today: 'ఈరోజు',
    cashCollected: 'నగదు సేకరణ',
    onlinePayments: 'ఆన్‌లైన్ చెల్లింపులు',
    patientsServed: 'రోగుల సేవ',
    avgWaitTime: 'సగటు వేచి ఉండే సమయం',
    addWalkIn: 'వాక్-ఇన్ జోడించు',
    searchPatient: 'రోగిని వెతకండి',
    voiceSymptoms: 'వాయిస్ లక్షణాలు',
    queueView: 'క్యూ వీక్షణ',
    generateReport: 'నివేదిక రూపొందించు',
    appointments: 'అపాయింట్‌మెంట్లు',
    queueManagement: 'క్యూ నిర్వహణ',
    drawerCounter: 'డ్రాయర్/కౌంటర్',
    transactionHistory: 'లావాదేవీ చరిత్ర',
    analytics: 'విశ్లేషణలు',
    settings: 'సెట్టింగులు',
    language: 'భాష',
    theme: 'థీమ్',
    saveSettings: 'సెట్టింగులు సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి'
  },
  hi: {
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
    cancel: 'रद्द करें'
  }
};

const StaffDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const toast = useRef<Toast>(null);
  const { t, language, setLanguage } = useLanguage();
  
  // Custom hooks
  const {
    dashboardState,
    stats,
    appointments: pendingAppointments,
    queueData,
    notifications,
    acceptAppointment,
    rejectAppointment,
    addWalkInPatient,
    searchPatients,
    generateReport: generateReportAction,
    unreadNotifications,
    totalRevenue,
    completionRate
  } = useStaffDashboard();
  
  const {
    voiceState,
    startRecording,
    stopRecording,
    clearTranscript
  } = useVoiceRecording();
  
  // State management
  const [activeTab, setActiveTab] = useState(0);
  
  // Check URL hash to set initial tab
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#queue') {
      setActiveTab(1); // Queue Management tab
    } else if (hash === '#drawer') {
      setActiveTab(2); // Drawer/Counter tab
    }
  }, []);
  const [walkInDialog, setWalkInDialog] = useState(false);
  const [patientSearchDialog, setPatientSearchDialog] = useState(false);
  const [reportDialog, setReportDialog] = useState(false);
  const [queueSidebar, setQueueSidebar] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [twoFactorDialog, setTwoFactorDialog] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [patientDetailsDialog, setPatientDetailsDialog] = useState(false);
  const [callPatientDialog, setCallPatientDialog] = useState(false);
  const [revisitDialog, setRevisitDialog] = useState(false);
  const [recordPaymentDialog, setRecordPaymentDialog] = useState(false);
  const [drawerCountDialog, setDrawerCountDialog] = useState(false);
  const [reconcileDialog, setReconcileDialog] = useState(false);
  const [notificationsDialog, setNotificationsDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [queueState, setQueueState] = useState<any[]>([]);
  const [patientQueues, setPatientQueues] = useState<{[doctorId: string]: string[]}>({});
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [twoFactorData, setTwoFactorData] = useState({
    phone: '',
    email: '',
    method: 'sms',
    verificationCode: '',
    qrCode: '',
    backupCodes: []
  });
  
  const [settings, setSettings] = useState({
    // General Settings
    language: 'en',
    theme: 'light',
    autoRefresh: true,
    refreshInterval: 30,
    soundNotifications: true,
    
    // Queue Settings
    queueAutoAdvance: true,
    maxWaitTime: 60,
    emergencyPriority: true,
    queueDisplayCount: 5,
    
    // Voice Settings
    voiceEnabled: true,
    voiceLanguage: 'en-US',
    voiceConfidenceThreshold: 0.7,
    
    // Payment Settings
    defaultPaymentMethod: 'cash',
    requirePaymentConfirmation: true,
    autoGenerateReceipts: true,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Display Settings
    compactView: false,
    showPatientPhotos: true,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    
    // Security Settings
    sessionTimeout: 30,
    requirePasswordChange: false,
    twoFactorAuth: false
  });
  
  const [walkInData, setWalkInData] = useState<WalkInData>({
    patientName: '',
    phone: '',
    doctorId: '',
    paymentMethod: 'cash',
    symptoms: '',
    emergencyLevel: 'normal'
  });
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    phone: '',
    name: '',
    doctorId: '',
    dateRange: null,
    status: []
  });
  
  const [reportFilters, setReportFilters] = useState<ReportFilters>({
    dateRange: [new Date(), new Date()],
    reportType: 'daily',
    departments: []
  });
  
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  
  const [paymentData, setPaymentData] = useState({
    patientName: '',
    phone: '',
    amount: '',
    paymentMethod: 'cash',
    description: '',
    receiptNumber: ''
  });
  
  const [drawerCountData, setDrawerCountData] = useState({
    expectedCash: 0,
    actualCash: '',
    notes: '',
    countedBy: user?.name || 'Staff',
    denominations: {
      '2000': 0,
      '500': 0,
      '200': 0,
      '100': 0,
      '50': 0,
      '20': 0,
      '10': 0,
      '5': 0,
      '2': 0,
      '1': 0
    }
  });
  
  const [reconcileData, setReconcileData] = useState({
    systemTotal: 0,
    physicalCount: 0,
    difference: 0,
    reconcileNotes: '',
    adjustmentReason: '',
    approvedBy: ''
  });
  
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Load transaction history from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactionHistory');
    if (savedTransactions) {
      try {
        setTransactionHistory(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('Error loading transaction history:', error);
      }
    }
  }, []);
  
  // Load settings and queue data from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('staffSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
        applySettings(parsedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    
    // Load patient queues
    const savedQueues = localStorage.getItem('patientQueues');
    if (savedQueues) {
      try {
        const parsedQueues = JSON.parse(savedQueues);
        setPatientQueues(parsedQueues);
      } catch (error) {
        console.error('Error loading patient queues:', error);
        // Initialize with empty queues if parsing fails
        setPatientQueues({
          'dr1': [],
          'dr2': [],
          'dr3': []
        });
      }
    } else {
      // Initialize with sample queues if no saved data
      const sampleQueues = {
        'dr1': ['John Doe', 'Jane Smith'],
        'dr2': ['Mike Johnson', 'Sarah Wilson', 'Tom Brown'],
        'dr3': ['Lisa Davis']
      };
      setPatientQueues(sampleQueues);
      localStorage.setItem('patientQueues', JSON.stringify(sampleQueues));
    }
    
    // Load queue state
    const savedQueueState = localStorage.getItem('queueState');
    if (savedQueueState) {
      try {
        const parsedQueueState = JSON.parse(savedQueueState);
        setQueueState(parsedQueueState);
      } catch (error) {
        console.error('Error loading queue state:', error);
        // Initialize with default queue data if parsing fails
        const defaultQueueData = [
          {
            doctorId: 'dr1',
            doctorName: 'Dr. Smith',
            department: 'Cardiology',
            status: 'active' as const,
            waitingCount: 0,
            completedToday: 8,
            avgWaitTime: '15 min',
            efficiency: 85
          },
          {
            doctorId: 'dr2',
            doctorName: 'Dr. Johnson',
            department: 'Orthopedics',
            status: 'active' as const,
            waitingCount: 0,
            completedToday: 12,
            avgWaitTime: '20 min',
            efficiency: 92
          },
          {
            doctorId: 'dr3',
            doctorName: 'Dr. Brown',
            department: 'General Medicine',
            status: 'break' as const,
            waitingCount: 0,
            avgWaitTime: '12 min',
            completedToday: 15,
            efficiency: 78
          }
        ];
        setQueueState(defaultQueueData);
        localStorage.setItem('queueState', JSON.stringify(defaultQueueData));
      }
    } else {
      // Initialize with default queue data if no saved data
      const defaultQueueData = [
        {
          doctorId: 'dr1',
          doctorName: 'Dr. Smith',
          department: 'Cardiology',
          status: 'active' as const,
          waitingCount: 0,
          completedToday: 8,
          avgWaitTime: '15 min',
          efficiency: 85
        },
        {
          doctorId: 'dr2',
          doctorName: 'Dr. Johnson',
          department: 'Orthopedics',
          status: 'active' as const,
          waitingCount: 0,
          completedToday: 12,
          avgWaitTime: '20 min',
          efficiency: 92
        },
        {
          doctorId: 'dr3',
          doctorName: 'Dr. Brown',
          department: 'General Medicine',
          status: 'break' as const,
          waitingCount: 0,
          completedToday: 15,
          avgWaitTime: '12 min',
          efficiency: 78
        }
      ];
      setQueueState(defaultQueueData);
      localStorage.setItem('queueState', JSON.stringify(defaultQueueData));
    }
    
    // Load appointments
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        const parsedAppointments = JSON.parse(savedAppointments);
        setAppointments(parsedAppointments);
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    }
  }, []);
  
  // Apply settings in real-time with smooth transitions
  const applySettings = (newSettings: any) => {
    // Apply theme with smooth transition
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    if (newSettings.theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else if (newSettings.theme === 'light') {
      document.body.classList.remove('dark-theme');
    } else if (newSettings.theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('dark-theme', isDark);
    }
    
    // Apply language
    document.documentElement.lang = newSettings.language;
    
    // Apply compact view with animation
    if (newSettings.compactView) {
      document.body.classList.add('compact-view');
      // Animate cards to compact size
      document.querySelectorAll('.p-card').forEach(card => {
        (card as HTMLElement).style.transition = 'all 0.3s ease';
        (card as HTMLElement).style.transform = 'scale(0.95)';
        setTimeout(() => {
          (card as HTMLElement).style.transform = 'scale(1)';
        }, 300);
      });
    } else {
      document.body.classList.remove('compact-view');
      // Animate cards to full size
      document.querySelectorAll('.p-card').forEach(card => {
        (card as HTMLElement).style.transition = 'all 0.3s ease';
        (card as HTMLElement).style.transform = 'scale(1.05)';
        setTimeout(() => {
          (card as HTMLElement).style.transform = 'scale(1)';
        }, 300);
      });
    }
    
    // Apply font size based on compact view
    if (newSettings.compactView) {
      document.documentElement.style.fontSize = '14px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
    
    // Clear transition after animation
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);
  };
  
  // Settings change handlers with real-time feedback
  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    
    // Show immediate visual feedback with specific messages
    const settingMessages = {
      language: `Language changed to ${value === 'en' ? 'English' : value === 'te' ? 'Telugu' : value === 'hi' ? 'Hindi' : value}`,
      theme: `Theme switched to ${value === 'light' ? '☀️ Light' : value === 'dark' ? '🌙 Dark' : '🌍 Auto'}`,
      autoRefresh: value ? `✅ Auto refresh enabled (${settings.refreshInterval}s)` : '❌ Auto refresh disabled',
      refreshInterval: `⏱️ Refresh interval set to ${value} seconds`,
      soundNotifications: value ? '🔊 Sound notifications enabled' : '🔇 Sound notifications disabled',
      maxWaitTime: `⏰ Max wait time set to ${value} minutes`,
      voiceLanguage: `🎤 Voice language set to ${value}`,
      voiceEnabled: value ? '🎤 Voice recording enabled' : '🚫 Voice recording disabled',
      sessionTimeout: `⏱️ Session timeout set to ${value} minutes`,
      compactView: value ? '📱 Compact view enabled' : '🖥️ Full view enabled',
      twoFactorAuth: value ? '🔒 Two-factor authentication enabled' : '🔓 Two-factor authentication disabled'
    };
    
    toast.current?.show({
      severity: 'success',
      summary: 'Setting Applied',
      detail: settingMessages[key as keyof typeof settingMessages] || `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} updated`,
      life: 3000
    });
    
    // Auto-save all settings in real-time
    localStorage.setItem('staffSettings', JSON.stringify(newSettings));
    
    // Trigger immediate effects for specific settings
    if (key === 'autoRefresh' && value) {
      // Auto refresh enabled
    }
    
    if (key === 'soundNotifications' && value) {
      playNotificationSound();
    }
  };
  
  // Language change handler
  const handleLanguageChange = (lang: string) => {
    setSettings(prev => ({ ...prev, language: lang }));
    toast.current?.show({
      severity: 'info',
      summary: 'Language Selected',
      detail: `${lang === 'en' ? 'English' : lang === 'te' ? 'Telugu' : lang === 'hi' ? 'Hindi' : lang} selected. Click Save Settings to apply.`,
      life: 3000
    });
  };
  
  // Theme change handler
  const handleThemeChange = (theme: string) => {
    handleSettingChange('theme', theme);
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('dark-theme', isDark);
    }
  };
  
  // Auto-refresh handler
  useEffect(() => {
    if (settings.autoRefresh) {
      const interval = setInterval(() => {
        // Refresh data based on interval
        if (dashboardState.realTimeEnabled) {
          // Real-time updates
        }
      }, settings.refreshInterval * 1000);
      
      return () => clearInterval(interval);
    }
  }, [settings.autoRefresh, settings.refreshInterval]);
  
  // Sound notification handler
  const playNotificationSound = () => {
    if (settings.soundNotifications) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
    }
  };
  
  // Session timeout handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (settings.sessionTimeout > 0) {
          toast.current?.show({
            severity: 'warn',
            summary: 'Session Timeout',
            detail: 'Your session will expire in 5 minutes',
            life: 5000
          });
        }
      }, (settings.sessionTimeout - 5) * 60 * 1000);
    };
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });
    
    resetTimeout();
    
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
    };
  }, [settings.sessionTimeout]);
  
  // Password change handler
  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.current?.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all password fields',
        life: 3000
      });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.current?.show({
        severity: 'error',
        summary: 'Password Mismatch',
        detail: 'New password and confirm password do not match',
        life: 3000
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.current?.show({
        severity: 'error',
        summary: 'Weak Password',
        detail: 'Password must be at least 6 characters long',
        life: 3000
      });
      return;
    }
    
    try {
      const result = await mockAuthService.changePassword(
        user?.id || '',
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      toast.current?.show({
        severity: 'success',
        summary: 'Password Changed',
        detail: 'Your password has been updated successfully',
        life: 4000
      });
      
      setPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Password Change Failed',
        detail: error.message || 'Failed to update password. Please try again.',
        life: 3000
      });
    }
  };
  
  // Two-factor authentication setup
  const handleTwoFactorSetup = async () => {
    if (twoFactorData.method === 'sms' && !twoFactorData.phone) {
      toast.current?.show({
        severity: 'error',
        summary: 'Phone Required',
        detail: 'Please enter your phone number for SMS verification',
        life: 3000
      });
      return;
    }
    
    if (twoFactorData.method === 'email' && !twoFactorData.email) {
      toast.current?.show({
        severity: 'error',
        summary: 'Email Required',
        detail: 'Please enter your email for email verification',
        life: 3000
      });
      return;
    }
    
    try {
      // Simulate API call to setup 2FA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock QR code and backup codes
      const mockQrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const mockBackupCodes = [
        '1234-5678', '2345-6789', '3456-7890', '4567-8901',
        '5678-9012', '6789-0123', '7890-1234', '8901-2345'
      ];
      
      setTwoFactorData(prev => ({
        ...prev,
        qrCode: mockQrCode,
        backupCodes: mockBackupCodes
      }));
      
      toast.current?.show({
        severity: 'success',
        summary: '2FA Setup Started',
        detail: 'Scan the QR code with your authenticator app',
        life: 4000
      });
      
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: '2FA Setup Failed',
        detail: 'Failed to setup two-factor authentication',
        life: 3000
      });
    }
  };
  
  // Verify 2FA code
  const handleTwoFactorVerify = async () => {
    if (!twoFactorData.verificationCode || twoFactorData.verificationCode.length !== 6) {
      toast.current?.show({
        severity: 'error',
        summary: 'Invalid Code',
        detail: 'Please enter a valid 6-digit verification code',
        life: 3000
      });
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      handleSettingChange('twoFactorAuth', true);
      
      toast.current?.show({
        severity: 'success',
        summary: '2FA Enabled',
        detail: 'Two-factor authentication has been successfully enabled',
        life: 4000
      });
      
      setTwoFactorDialog(false);
      setTwoFactorData({
        phone: '',
        email: '',
        method: 'sms',
        verificationCode: '',
        qrCode: '',
        backupCodes: []
      });
      
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Verification Failed',
        detail: 'Invalid verification code. Please try again.',
        life: 3000
      });
    }
  };
  
  // Logout all devices
  const handleLogoutAllDevices = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.current?.show({
        severity: 'success',
        summary: 'Devices Logged Out',
        detail: 'All devices have been logged out successfully',
        life: 4000
      });
      
      setLogoutDialog(false);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Logout Failed',
        detail: 'Failed to logout all devices. Please try again.',
        life: 3000
      });
    }
  };

  // Use real data from hooks only
  const drawerStats = stats;
  

  
  // Initialize appointments and queue state
  useEffect(() => {
    // Only use pendingAppointments if no localStorage data exists
    const savedAppointments = localStorage.getItem('appointments');
    if (!savedAppointments && pendingAppointments.length > 0) {
      setAppointments(pendingAppointments);
    }
    
    // Initialize queue data if empty
    if (queueData.length === 0) {
      const defaultQueueData = [
        {
          doctorId: 'dr1',
          doctorName: 'Dr. Smith',
          department: 'Cardiology',
          status: 'active' as const,
          waitingCount: (patientQueues['dr1'] || []).length,
          completedToday: 8,
          avgWaitTime: '15 min',
          efficiency: 85
        },
        {
          doctorId: 'dr2',
          doctorName: 'Dr. Johnson',
          department: 'Orthopedics',
          status: 'active' as const,
          waitingCount: (patientQueues['dr2'] || []).length,
          completedToday: 12,
          avgWaitTime: '20 min',
          efficiency: 92
        },
        {
          doctorId: 'dr3',
          doctorName: 'Dr. Brown',
          department: 'General Medicine',
          status: 'break' as const,
          waitingCount: (patientQueues['dr3'] || []).length,
          completedToday: 15,
          avgWaitTime: '12 min',
          efficiency: 78
        }
      ];
      setQueueState(defaultQueueData);
      localStorage.setItem('queueState', JSON.stringify(defaultQueueData));
    } else {
      setQueueState(queueData);
    }
  }, [pendingAppointments, queueData, patientQueues]);

  // Use real queue data or fallback to local state
  const displayQueueData = queueState.length > 0 ? queueState : queueData;

  const doctors = [
    { label: 'Dr. Smith - Cardiology', value: 'dr1', department: 'Cardiology' },
    { label: 'Dr. Johnson - Orthopedics', value: 'dr2', department: 'Orthopedics' },
    { label: 'Dr. Brown - General Medicine', value: 'dr3', department: 'General Medicine' }
  ];
  
  const departments = [
    { label: 'Cardiology', value: 'cardiology' },
    { label: 'Orthopedics', value: 'orthopedics' },
    { label: 'General Medicine', value: 'general' }
  ];
  
  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];
  
  // Chart data - calculated from real appointments
  const hourlyData = useMemo(() => {
    const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
    const hourlyCount = hours.map(hour => {
      return appointments.filter(apt => {
        const aptHour = new Date(`2024-01-01 ${apt.time}`).getHours();
        const targetHour = hour.includes('PM') && !hour.includes('12') ? 
          parseInt(hour) + 12 : parseInt(hour);
        return aptHour === targetHour;
      }).length;
    });
    
    return {
      labels: hours,
      datasets: [
        {
          label: 'Appointments',
          data: hourlyCount,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: true
        }
      ]
    };
  }, [appointments]);
  
  const departmentData = useMemo(() => {
    const deptCounts = appointments.reduce((acc, apt) => {
      acc[apt.department] = (acc[apt.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      labels: Object.keys(deptCounts),
      datasets: [
        {
          data: Object.values(deptCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
        }
      ]
    };
  }, [appointments]);
  
  const paymentMethodsData = useMemo(() => {
    const paymentCounts = transactionHistory.reduce((acc, txn) => {
      acc[txn.paymentMethod] = (acc[txn.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      labels: Object.keys(paymentCounts),
      datasets: [{
        data: Object.values(paymentCounts),
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#FF5722']
      }]
    };
  }, [transactionHistory]);
  
  // Timeline events from real data
  const timelineEvents = notifications.slice(0, 3).map(notif => ({
    status: notif.title,
    date: notif.timestamp.toLocaleTimeString(),
    icon: notif.type === 'appointment' ? 'pi pi-calendar' : notif.type === 'payment' ? 'pi pi-money-bill' : 'pi pi-info-circle',
    color: notif.priority === 'high' ? '#F44336' : notif.priority === 'medium' ? '#FF9800' : '#4CAF50',
    patient: notif.message
  }));

  // Utility functions
  const getSeverity = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'in-progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'normal': return 'success';
      default: return 'info';
    }
  };
  
  const formatTime = (time: string) => {
    return format(new Date(`2024-01-01 ${time}`), 'h:mm a');
  };
  
  const calculateWaitTime = (queuePosition: number, avgTime: number) => {
    return queuePosition * avgTime;
  };
  
  // Event handlers
  const handleWalkInSubmit = async () => {
    const result = await addWalkInPatient(walkInData);
    
    if (result.success) {
      // Create new appointment from walk-in data
      const newAppointment = {
        id: Date.now().toString(),
        patientName: walkInData.patientName,
        phone: walkInData.phone,
        doctorName: doctors.find(d => d.value === walkInData.doctorId)?.label.split(' - ')[0] || 'Unknown Doctor',
        department: doctors.find(d => d.value === walkInData.doctorId)?.department || 'Unknown',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'confirmed' as const,
        paymentStatus: walkInData.paymentMethod === 'cash' ? 'pending' : 'paid' as const,
        priority: walkInData.emergencyLevel as const,
        symptoms: walkInData.symptoms,
        estimatedDuration: 20,
        queuePosition: 1
      };
      
      // Add to appointments and save to localStorage
      setAppointments(prev => {
        const newAppointments = [...prev, newAppointment];
        localStorage.setItem('appointments', JSON.stringify(newAppointments));
        return newAppointments;
      });
      
      // Add patient to the queue
      setPatientQueues(prev => {
        const currentQueue = prev[walkInData.doctorId] || [];
        const newQueues = { ...prev, [walkInData.doctorId]: [...currentQueue, walkInData.patientName] };
        localStorage.setItem('patientQueues', JSON.stringify(newQueues));
        return newQueues;
      });
      
      // Update queue waiting count
      setQueueState(prev => {
        const newState = prev.map(queue => {
          if (queue.doctorId === walkInData.doctorId) {
            return { ...queue, waitingCount: (patientQueues[walkInData.doctorId] || []).length + 1 };
          }
          return queue;
        });
        localStorage.setItem('queueState', JSON.stringify(newState));
        return newState;
      });
    }
    
    toast.current?.show({
      severity: result.success ? 'success' : 'error',
      summary: result.success ? 'Success' : 'Error',
      detail: result.message,
      life: 3000
    });
    
    if (result.success) {
      setWalkInDialog(false);
      setWalkInData({ 
        patientName: '', 
        phone: '', 
        doctorId: '', 
        paymentMethod: 'cash',
        symptoms: '',
        emergencyLevel: 'normal'
      });
      clearTranscript();
    }
  };
  
  const handleAppointmentAction = async (action: 'accept' | 'reject', appointmentId: string) => {
    // Update appointment status immediately and save to localStorage
    setAppointments(prev => {
      const newAppointments = prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: action === 'accept' ? 'confirmed' : 'cancelled' }
          : apt
      );
      localStorage.setItem('appointments', JSON.stringify(newAppointments));
      return newAppointments;
    });
    
    const result = action === 'accept' 
      ? await acceptAppointment(appointmentId)
      : await rejectAppointment(appointmentId);
    
    toast.current?.show({
      severity: result.success ? 'success' : 'error',
      summary: result.success ? (action === 'accept' ? 'Accepted' : 'Rejected') : 'Error',
      detail: result.message,
      life: 3000
    });
  };
  
  const handleVoiceRecording = () => {
    if (voiceState.isRecording) {
      stopRecording();
    } else {
      startRecording();
      toast.current?.show({
        severity: 'info',
        summary: 'Recording Started',
        detail: 'Speak your symptoms...',
        life: 2000
      });
    }
  };
  
  const handleGenerateReport = async () => {
    // Generate mock report data
    const reportData = {
      reportType: reportFilters.reportType,
      dateRange: reportFilters.dateRange,
      generatedAt: new Date(),
      summary: {
        totalPatients: drawerStats.totalPatients,
        totalRevenue: drawerStats.totalCash + drawerStats.totalOnline,
        cashCollected: drawerStats.totalCash,
        onlinePayments: drawerStats.totalOnline,
        completedAppointments: drawerStats.completedAppointments,
        walkInPatients: drawerStats.walkInPatients,
        avgWaitTime: drawerStats.avgWaitTime
      },
      patientDetails: appointments.map(apt => ({
        name: apt.patientName,
        phone: apt.phone,
        doctor: apt.doctorName,
        department: apt.department,
        time: apt.time,
        status: apt.status,
        paymentStatus: apt.paymentStatus,
        symptoms: apt.symptoms
      })),
      queueAnalytics: queueState.map(queue => ({
        doctor: queue.doctorName,
        department: queue.department,
        completedToday: queue.completedToday,
        avgWaitTime: queue.avgWaitTime,
        efficiency: queue.efficiency,
        status: queue.status
      }))
    };
    
    setGeneratedReport(reportData);
    
    toast.current?.show({
      severity: 'success',
      summary: 'Report Generated',
      detail: `${reportFilters.reportType} report generated successfully`,
      life: 3000
    });
  };
  
  const exportToExcel = () => {
    if (!generatedReport) return;
    
    // Create Excel content
    const excelData = [
      ['Hospital Management Report'],
      ['Report Type:', generatedReport.reportType],
      ['Generated At:', generatedReport.generatedAt.toLocaleString()],
      [''],
      ['SUMMARY'],
      ['Total Patients', generatedReport.summary.totalPatients],
      ['Total Revenue', `₹${generatedReport.summary.totalRevenue.toLocaleString()}`],
      ['Cash Collected', `₹${generatedReport.summary.cashCollected.toLocaleString()}`],
      ['Online Payments', `₹${generatedReport.summary.onlinePayments.toLocaleString()}`],
      ['Completed Appointments', generatedReport.summary.completedAppointments],
      ['Walk-in Patients', generatedReport.summary.walkInPatients],
      ['Avg Wait Time', `${generatedReport.summary.avgWaitTime} min`],
      [''],
      ['PATIENT DETAILS'],
      ['Name', 'Phone', 'Doctor', 'Department', 'Time', 'Status', 'Payment', 'Symptoms'],
      ...generatedReport.patientDetails.map((patient: any) => [
        patient.name,
        patient.phone,
        patient.doctor,
        patient.department,
        patient.time,
        patient.status,
        patient.paymentStatus,
        patient.symptoms
      ]),
      [''],
      ['QUEUE ANALYTICS'],
      ['Doctor', 'Department', 'Completed Today', 'Avg Wait Time', 'Efficiency', 'Status'],
      ...generatedReport.queueAnalytics.map((queue: any) => [
        queue.doctor,
        queue.department,
        queue.completedToday,
        queue.avgWaitTime,
        `${queue.efficiency}%`,
        queue.status
      ])
    ];
    
    // Convert to CSV format
    const csvContent = excelData.map(row => 
      Array.isArray(row) ? row.join(',') : row
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hospital-report-${generatedReport.reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.current?.show({
      severity: 'success',
      summary: 'Excel Export Complete',
      detail: 'Report exported to Excel format',
      life: 3000
    });
  };
  
  const handlePatientSearch = async () => {
    const result = await searchPatients(searchFilters);
    
    if (result.success) {
      toast.current?.show({
        severity: 'success',
        summary: 'Search Complete',
        detail: `Found ${result.data?.length || 0} patients`,
        life: 3000
      });
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Search Failed',
        detail: result.message,
        life: 3000
      });
    }
  };
  
  // Update symptoms from voice transcript
  useEffect(() => {
    if (voiceState.transcript && walkInDialog) {
      setWalkInData(prev => ({
        ...prev,
        symptoms: voiceState.transcript
      }));
    }
  }, [voiceState.transcript, walkInDialog]);
  
  // Enhanced queue management functions
  const movePatientIn = async (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      // Update appointment status in state and save to localStorage
      setAppointments(prev => {
        const newAppointments = prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'in-progress' }
            : apt
        );
        localStorage.setItem('appointments', JSON.stringify(newAppointments));
        return newAppointments;
      });
      
      toast.current?.show({
        severity: 'info',
        summary: 'Patient Moved In',
        detail: `${appointment.patientName} moved to consultation with ${appointment.doctorName}`,
        life: 4000
      });
      playNotificationSound();
    }
  };
  
  const markPatientCompleted = async (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      // Update appointment status in state and save to localStorage
      setAppointments(prev => {
        const newAppointments = prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'completed' }
            : apt
        );
        localStorage.setItem('appointments', JSON.stringify(newAppointments));
        return newAppointments;
      });
      
      toast.current?.show({
        severity: 'success',
        summary: 'Consultation Complete',
        detail: `${appointment.patientName}'s consultation completed successfully`,
        life: 4000
      });
      playNotificationSound();
    }
  };
  
  const viewPatientDetails = (appointment: any) => {
    setSelectedPatient(appointment);
    setPatientDetailsDialog(true);
  };
  
  const callPatient = (appointment: any) => {
    setSelectedPatient(appointment);
    setCallPatientDialog(true);
  };
  
  const addRevisitAppointment = (appointment: any) => {
    setSelectedPatient(appointment);
    setRevisitDialog(true);
  };
  
  const handleCallPatient = async () => {
    if (selectedPatient) {
      toast.current?.show({
        severity: 'info',
        summary: 'Calling Patient',
        detail: `Calling ${selectedPatient.patientName} at ${selectedPatient.phone}`,
        life: 4000
      });
      // Simulate call
      setTimeout(() => {
        toast.current?.show({
          severity: 'success',
          summary: 'Call Connected',
          detail: 'Patient has been notified',
          life: 3000
        });
      }, 2000);
      setCallPatientDialog(false);
    }
  };
  
  const handleRevisitSubmit = async () => {
    if (selectedPatient) {
      toast.current?.show({
        severity: 'success',
        summary: 'Revisit Scheduled',
        detail: `Follow-up appointment scheduled for ${selectedPatient.patientName}`,
        life: 4000
      });
      setRevisitDialog(false);
    }
  };

  const markPaymentReceived = async (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, paymentStatus: 'paid' }
        : apt
    ));
    
    toast.current?.show({
      severity: 'success',
      summary: 'Payment Received',
      detail: 'Payment status updated to paid',
      life: 3000
    });
  };

  // Queue management functions
  const callNextPatient = (doctorId: string) => {
    const currentQueue = patientQueues[doctorId] || [];
    if (currentQueue.length > 0) {
      const calledPatient = currentQueue[0];
      
      // Remove the first patient from queue
      setPatientQueues(prev => {
        const newQueue = currentQueue.slice(1);
        const newQueues = { ...prev, [doctorId]: newQueue };
        localStorage.setItem('patientQueues', JSON.stringify(newQueues));
        return newQueues;
      });
      
      // Update completed count and waiting count
      setQueueState(prev => {
        const newState = prev.map(queue => {
          if (queue.doctorId === doctorId) {
            return {
              ...queue,
              completedToday: queue.completedToday + 1,
              waitingCount: Math.max(0, (patientQueues[doctorId] || []).length - 1)
            };
          }
          return queue;
        });
        localStorage.setItem('queueState', JSON.stringify(newState));
        return newState;
      });
      
      const queue = queueState.find(q => q.doctorId === doctorId);
      toast.current?.show({
        severity: 'info',
        summary: 'Next Patient Called',
        detail: `${calledPatient} called for ${queue?.doctorName}`,
        life: 3000
      });
      playNotificationSound();
    }
  };

  const toggleQueueStatus = (doctorId: string) => {
    setQueueState(prev => prev.map(queue => {
      if (queue.doctorId === doctorId) {
        const newStatus = queue.status === 'active' ? 'break' : 'active';
        return { ...queue, status: newStatus };
      }
      return queue;
    }));
    
    const queue = queueState.find(q => q.doctorId === doctorId);
    const newStatus = queue?.status === 'active' ? 'paused' : 'resumed';
    toast.current?.show({
      severity: 'info',
      summary: `Queue ${newStatus === 'paused' ? 'Paused' : 'Resumed'}`,
      detail: `${queue?.doctorName} queue ${newStatus}`,
      life: 3000
    });
  };

  const viewFullQueue = (doctorId: string) => {
    const queue = queueState.find(q => q.doctorId === doctorId);
    toast.current?.show({
      severity: 'info',
      summary: 'Queue Details',
      detail: `Viewing full queue for ${queue?.doctorName} - ${queue?.waitingCount} patients waiting`,
      life: 3000
    });
  };

  const movePatientUp = (patientIndex: number, doctorId: string) => {
    if (patientIndex > 0) {
      setPatientQueues(prev => {
        const currentQueue = prev[doctorId] || [];
        const newQueue = [...currentQueue];
        [newQueue[patientIndex], newQueue[patientIndex - 1]] = [newQueue[patientIndex - 1], newQueue[patientIndex]];
        const newQueues = { ...prev, [doctorId]: newQueue };
        localStorage.setItem('patientQueues', JSON.stringify(newQueues));
        return newQueues;
      });
      
      toast.current?.show({
        severity: 'success',
        summary: 'Patient Moved Up',
        detail: 'Patient moved up in queue',
        life: 2000
      });
    }
  };

  const removeFromQueue = (patientIndex: number, doctorId: string) => {
    setPatientQueues(prev => {
      const currentQueue = prev[doctorId] || [];
      const newQueue = currentQueue.filter((_, index) => index !== patientIndex);
      const newQueues = { ...prev, [doctorId]: newQueue };
      localStorage.setItem('patientQueues', JSON.stringify(newQueues));
      return newQueues;
    });
    
    setQueueState(prev => {
      const newState = prev.map(queue => {
        if (queue.doctorId === doctorId) {
          return { ...queue, waitingCount: Math.max(0, queue.waitingCount - 1) };
        }
        return queue;
      });
      localStorage.setItem('queueState', JSON.stringify(newState));
      return newState;
    });
    
    toast.current?.show({
      severity: 'warn',
      summary: 'Patient Removed',
      detail: 'Patient removed from queue',
      life: 3000
    });
  };

  const emergencyOverride = () => {
    toast.current?.show({
      severity: 'warn',
      summary: 'Emergency Override Activated',
      detail: 'Emergency patient will be prioritized across all queues',
      life: 4000
    });
    playNotificationSound();
  };

  const deactivateDoctor = (doctorId: string) => {
    setQueueState(prev => prev.map(queue => {
      if (queue.doctorId === doctorId) {
        return { ...queue, status: 'inactive' };
      }
      return queue;
    }));
    
    const queue = queueState.find(q => q.doctorId === doctorId);
    toast.current?.show({
      severity: 'warn',
      summary: 'Doctor Deactivated',
      detail: `${queue?.doctorName} status changed to inactive`,
      life: 3000
    });
  };

  const activateDoctor = (doctorId: string) => {
    setQueueState(prev => prev.map(queue => {
      if (queue.doctorId === doctorId) {
        return { ...queue, status: 'active' };
      }
      return queue;
    }));
    
    const queue = queueState.find(q => q.doctorId === doctorId);
    toast.current?.show({
      severity: 'success',
      summary: 'Doctor Activated',
      detail: `${queue?.doctorName} is now active and ready to see patients`,
      life: 3000
    });
  };
  
  const generateEndOfDayReport = async () => {
    const reportData = {
      date: new Date().toISOString().split('T')[0],
      totalPatients: drawerStats.totalPatients,
      totalRevenue: drawerStats.totalCash + drawerStats.totalOnline,
      cashCollected: drawerStats.totalCash,
      onlinePayments: drawerStats.totalOnline,
      completedAppointments: drawerStats.completedAppointments,
      walkInPatients: drawerStats.walkInPatients
    };
    
    // Create CSV content
    const csvContent = [
      'Date,Total Patients,Total Revenue,Cash Collected,Online Payments,Completed Appointments,Walk-in Patients',
      `${reportData.date},${reportData.totalPatients},${reportData.totalRevenue},${reportData.cashCollected},${reportData.onlinePayments},${reportData.completedAppointments},${reportData.walkInPatients}`
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `end-of-day-report-${reportData.date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.current?.show({
      severity: 'success',
      summary: 'Report Generated',
      detail: 'End-of-day report downloaded',
      life: 3000
    });
  };
  
  // Template functions
  const statusBodyTemplate = (rowData: any) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };
  
  const priorityBodyTemplate = (rowData: any) => {
    return (
      <div className="flex align-items-center gap-2">
        <Tag value={rowData.priority} severity={getPriorityColor(rowData.priority)} />
        <Badge value={rowData.queuePosition} severity="info" />
      </div>
    );
  };

  const paymentStatusBodyTemplate = (rowData: any) => {
    const getSeverity = (status: string) => {
      return status === 'paid' ? 'success' : 'danger';
    };
    return <Tag value={rowData.paymentStatus} severity={getSeverity(rowData.paymentStatus)} />;
  };
  
  const patientBodyTemplate = (rowData: any) => {
    return (
      <div className="flex align-items-center gap-2">
        <Avatar label={rowData.patientName.charAt(0)} size="normal" shape="circle" />
        <div>
          <div className="font-medium">{rowData.patientName}</div>
          <div className="text-sm text-600">{rowData.phone}</div>
        </div>
      </div>
    );
  };
  
  const symptomsBodyTemplate = (rowData: any) => {
    return (
      <div className="max-w-200px">
        <div className="text-sm text-600 white-space-nowrap overflow-hidden text-overflow-ellipsis">
          {rowData.symptoms}
        </div>
      </div>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-1">
        {rowData.status === 'pending' && (
          <>
            <Button 
              icon="pi pi-check" 
              size="small" 
              severity="success" 
              tooltip="Accept"
              loading={dashboardState.loading}
              onClick={() => handleAppointmentAction('accept', rowData.id)}
            />
            <Button 
              icon="pi pi-times" 
              size="small" 
              severity="danger" 
              tooltip="Reject"
              loading={dashboardState.loading}
              onClick={() => handleAppointmentAction('reject', rowData.id)}
            />
          </>
        )}
        {rowData.status === 'confirmed' && (
          <Button 
            icon="pi pi-arrow-right" 
            size="small" 
            severity="info" 
            tooltip="Move to Consultation"
            onClick={() => movePatientIn(rowData.id)}
          />
        )}
        {rowData.status === 'in-progress' && (
          <Button 
            icon="pi pi-check-circle" 
            size="small" 
            severity="success" 
            tooltip="Mark Complete"
            onClick={() => markPatientCompleted(rowData.id)}
          />
        )}
        {rowData.paymentStatus === 'pending' && (
          <Button 
            icon="pi pi-money-bill" 
            size="small" 
            severity="warning" 
            tooltip="Record Payment"
            onClick={() => {
              setPaymentData({
                patientName: rowData.patientName,
                phone: rowData.phone,
                amount: '500', // Default consultation fee
                paymentMethod: 'cash',
                description: 'Consultation fee',
                receiptNumber: `RCP-${Date.now().toString().slice(-6)}`
              });
              setRecordPaymentDialog(true);
            }}
          />
        )}
        <Button 
          icon="pi pi-eye" 
          size="small" 
          outlined 
          tooltip="View Details"
          onClick={() => viewPatientDetails(rowData)}
        />
        <Button 
          icon="pi pi-phone" 
          size="small" 
          outlined 
          tooltip="Call Patient"
          onClick={() => callPatient(rowData)}
        />
        <Button 
          icon="pi pi-calendar-plus" 
          size="small" 
          outlined 
          tooltip="Add Revisit"
          onClick={() => addRevisitAppointment(rowData)}
        />
      </div>
    );
  };
  
  // Real-time data updates
  useEffect(() => {
    // Load initial data from localStorage
    const loadStoredData = () => {
      try {
        const storedAppointments = localStorage.getItem('appointments');
        if (storedAppointments) {
          setAppointments(JSON.parse(storedAppointments));
        }
        
        const storedStats = localStorage.getItem('staffDashboardStats');
        if (storedStats) {
          // Update stats from stored data if available
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };
    
    loadStoredData();
    
    // Set up periodic data refresh
    const interval = setInterval(() => {
      if (settings.autoRefresh) {
        loadStoredData();
      }
    }, settings.refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [settings.autoRefresh, settings.refreshInterval]);
  
  const handleRealTimeUpdate = (data: any) => {
    // Handle real updates from actual data changes
    switch (data.type) {
      case 'NEW_APPOINTMENT':
        // Refresh appointments from localStorage
        const updatedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        setAppointments(updatedAppointments);
        
        toast.current?.show({
          severity: 'info',
          summary: 'New Appointment',
          detail: `${data.patientName} appointment updated`,
          life: 4000
        });
        break;
      case 'PAYMENT_RECEIVED':
        // Refresh transaction history
        const updatedTransactions = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
        setTransactionHistory(updatedTransactions);
        
        toast.current?.show({
          severity: 'success',
          summary: 'Payment Recorded',
          detail: `Payment recorded successfully`,
          life: 3000
        });
        break;
    }
  };
  
  // Remove simulation - use real data only
  
  // Auto-refresh real data
  useEffect(() => {
    const interval = setInterval(() => {
      if (dashboardState.realTimeEnabled && settings.autoRefresh) {
        // Refresh data from localStorage
        const storedAppointments = localStorage.getItem('appointments');
        if (storedAppointments) {
          try {
            setAppointments(JSON.parse(storedAppointments));
          } catch (error) {
            console.error('Error refreshing appointments:', error);
          }
        }
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dashboardState.realTimeEnabled, settings.autoRefresh]);

  return (
    <div className="staff-dashboard">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      {/* Header */}
      <div className="flex justify-content-between align-items-center mb-4 p-4 bg-white border-round shadow-2">
        <div>
          <h1 className="m-0 text-3xl font-bold text-900">{t('staffDashboard')}</h1>
          <p className="m-0 text-600 mt-1 text-lg">{t('welcomeBack')}, {user?.name}! {t('today')} {format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
          <div className="flex align-items-center gap-2 mt-2">
            <i className="pi pi-clock text-blue-500"></i>
            <span className="text-sm font-medium text-blue-600">
              {format(currentTime, 'HH:mm:ss')}
            </span>
            <div className="flex align-items-center gap-2 ml-4">
              <i className={`pi ${dashboardState.realTimeEnabled ? 'pi-circle-fill text-green-500' : 'pi-circle text-gray-400'}`}></i>
              <span className="text-sm text-600">
                {dashboardState.realTimeEnabled ? 'Live' : 'Offline'}
              </span>
              <span className="text-xs text-500">
                Updated: {format(dashboardState.lastUpdated, 'HH:mm:ss')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex align-items-center gap-2">
          <Button 
            icon="pi pi-bell" 
            className="p-button-rounded p-button-outlined" 
            badge={unreadNotifications > 0 ? (unreadNotifications > 99 ? '99+' : unreadNotifications.toString()) : undefined}
            badgeClassName="p-badge-danger"
            tooltip="Notifications"
            tooltipOptions={{ position: 'bottom' }}
            onClick={() => setActiveTab(5)}
          />
          <Button 
            icon="pi pi-refresh" 
            className="p-button-rounded p-button-outlined p-button-secondary" 
            tooltip="Refresh Data"
            tooltipOptions={{ position: 'bottom' }}
            loading={dashboardState.loading}
            onClick={() => window.location.reload()}
          />
          <Button 
            icon="pi pi-cog" 
            className="p-button-rounded p-button-outlined p-button-secondary" 
            tooltip="Settings"
            tooltipOptions={{ position: 'bottom' }}
            onClick={() => setSettingsDialog(true)}
          />
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid mb-4">
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white border-none">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-green-100 font-medium mb-1">{t('cashCollected')}</div>
                <div className="text-3xl font-bold mb-2">₹{drawerStats.totalCash.toLocaleString()}</div>
                <div className="text-green-100 text-sm">
                  <i className="pi pi-arrow-up mr-1"></i>
                  +12% from yesterday
                </div>
              </div>
              <div className="bg-white bg-opacity-20 p-3 border-round">
                <i className="pi pi-money-bill text-4xl"></i>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-gradient-to-r from-blue-400 to-blue-600 text-white border-none">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-blue-100 font-medium mb-1">{t('onlinePayments')}</div>
                <div className="text-3xl font-bold mb-2">₹{drawerStats.totalOnline.toLocaleString()}</div>
                <div className="text-blue-100 text-sm">
                  <i className="pi pi-arrow-up mr-1"></i>
                  +8% from yesterday
                </div>
              </div>
              <div className="bg-white bg-opacity-20 p-3 border-round">
                <i className="pi pi-credit-card text-4xl"></i>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-gradient-to-r from-orange-400 to-orange-600 text-white border-none">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-orange-100 font-medium mb-1">{t('patientsServed')}</div>
                <div className="text-3xl font-bold mb-2">{drawerStats.totalPatients}</div>
                <div className="text-orange-100 text-sm">
                  <i className="pi pi-users mr-1"></i>
                  {drawerStats.walkInPatients} walk-ins
                </div>
              </div>
              <div className="bg-white bg-opacity-20 p-3 border-round">
                <i className="pi pi-users text-4xl"></i>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white border-none">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-purple-100 font-medium mb-1">{t('avgWaitTime')}</div>
                <div className="text-3xl font-bold mb-2">{drawerStats.avgWaitTime} min</div>
                <div className="text-purple-100 text-sm">
                  <i className="pi pi-clock mr-1"></i>
                  -5 min from yesterday
                </div>
              </div>
              <div className="bg-white bg-opacity-20 p-3 border-round">
                <i className="pi pi-clock text-4xl"></i>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-4 p-3 bg-white border-round shadow-1">
        <Button 
          label={t('addWalkIn')} 
          icon="pi pi-user-plus" 
          className="p-button-success"
          onClick={() => setWalkInDialog(true)}
        />
        <Button 
          label={t('searchPatient')} 
          icon="pi pi-search" 
          className="p-button-info"
          onClick={() => setPatientSearchDialog(true)}
        />
        <Button 
          label={voiceState.isRecording ? "Stop Recording" : t('voiceSymptoms')}
          icon={voiceState.isRecording ? "pi pi-stop" : "pi pi-microphone"} 
          className={voiceState.isRecording ? "p-button-danger voice-recording" : "p-button-warning"}
          onClick={handleVoiceRecording}
          tooltip={voiceState.error || "Record patient symptoms"}
        />
        <Button 
          label={t('queueView')} 
          icon="pi pi-list" 
          outlined
          onClick={() => setQueueSidebar(true)}
        />
        <Button 
          label="Queue Management" 
          icon="pi pi-users" 
          className="p-button-info"
          onClick={() => setActiveTab(1)}
        />
        <Button 
          label={t('generateReport')} 
          icon="pi pi-file-pdf" 
          outlined
          onClick={() => setReportDialog(true)}
        />
        <Button 
          label="End-of-Day Report" 
          icon="pi pi-download" 
          className="p-button-warning"
          outlined
          onClick={generateEndOfDayReport}
        />
        <Button 
          label="Emergency Alert" 
          icon="pi pi-exclamation-triangle" 
          className="p-button-danger p-button-outlined"
          onClick={() => toast.current?.show({
            severity: 'warn',
            summary: 'Emergency Alert Sent',
            detail: 'All doctors and admin notified',
            life: 4000
          })}
        />
      </div>

      {/* Main Content with Tabs */}
      <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
        <TabPanel header={t('appointments')} leftIcon="pi pi-calendar mr-2">
          <div className="grid">
            <div className="col-12 xl:col-8">
              <Card title="Today's Appointments" className="h-full">
                <DataTable 
                  value={appointments} 
                  responsiveLayout="scroll"
                  paginator
                  rows={10}
                  className="p-datatable-sm"
                  globalFilterFields={['patientName', 'phone', 'doctorName', 'symptoms']}
                  emptyMessage="No appointments found"
                  loading={dashboardState.loading}
                >
                  <Column field="patientName" header="Patient" body={patientBodyTemplate} sortable />
                  <Column field="doctorName" header="Doctor" sortable />
                  <Column field="department" header="Department" sortable />
                  <Column field="time" header="Time" sortable />
                  <Column field="priority" header="Priority" body={priorityBodyTemplate} sortable />
                  <Column field="symptoms" header="Symptoms" body={symptomsBodyTemplate} />
                  <Column field="status" header="Status" body={statusBodyTemplate} sortable />
                  <Column field="paymentStatus" header="Payment" body={paymentStatusBodyTemplate} sortable />
                  <Column header="Actions" body={actionBodyTemplate} frozen alignFrozen="right" />
                </DataTable>
              </Card>
            </div>
            
            <div className="col-12 xl:col-4">
              <Card title="Department Distribution">
                <Chart type="doughnut" data={departmentData} className="w-full" />
              </Card>
            </div>
          </div>
        </TabPanel>
        
        <TabPanel header={t('queueManagement')} leftIcon="pi pi-users mr-2">
          <div className="grid">
            {queueState.map((queue, index) => (
              <div key={queue.doctorId} className="col-12 lg:col-6 xl:col-4">
                <Card className="h-full">
                  <div className="flex justify-content-between align-items-start mb-3">
                    <div>
                      <h3 className="m-0 text-lg font-bold">{queue.doctorName}</h3>
                      <p className="m-0 text-600 text-sm">{queue.department}</p>
                    </div>
                    <Tag 
                      value={queue.status} 
                      severity={queue.status === 'active' ? 'success' : queue.status === 'inactive' ? 'danger' : 'warning'}
                      icon={queue.status === 'active' ? 'pi pi-check' : queue.status === 'inactive' ? 'pi pi-ban' : 'pi pi-pause'}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-content-between mb-2">
                      <span className="text-sm font-medium">Current Patient:</span>
                      <span className="text-sm font-bold text-green-600">{(patientQueues[queue.doctorId] || [])[0] || 'None'}</span>
                    </div>
                    <div className="flex justify-content-between mb-2">
                      <span className="text-sm font-medium">Waiting:</span>
                      <Badge value={(patientQueues[queue.doctorId] || []).length} severity="info" />
                    </div>
                    <div className="flex justify-content-between mb-2">
                      <span className="text-sm font-medium">Avg Wait:</span>
                      <span className="text-sm">{queue.avgWaitTime}</span>
                    </div>
                    <div className="flex justify-content-between mb-3">
                      <span className="text-sm font-medium">Completed Today:</span>
                      <span className="text-sm font-bold text-green-600">{queue.completedToday}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-content-between mb-1">
                      <span className="text-sm font-medium">Efficiency</span>
                      <span className="text-sm">{queue.efficiency}%</span>
                    </div>
                    <ProgressBar value={queue.efficiency} className="h-1rem" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      label="Next Patient" 
                      icon="pi pi-arrow-right" 
                      size="small" 
                      className="flex-1"
                      disabled={(patientQueues[queue.doctorId] || []).length === 0 || queue.status === 'inactive'}
                      onClick={() => callNextPatient(queue.doctorId)}
                    />
                    <Button 
                      icon="pi pi-eye" 
                      size="small" 
                      outlined
                      tooltip="View Queue"
                      onClick={() => setQueueSidebar(true)}
                    />
                    {queue.status === 'active' && (
                      <Button 
                        icon="pi pi-pause" 
                        size="small" 
                        severity="warning"
                        tooltip="Pause Queue"
                        onClick={() => toggleQueueStatus(queue.doctorId)}
                      />
                    )}
                    {queue.status === 'break' && (
                      <Button 
                        icon="pi pi-play" 
                        size="small" 
                        severity="success"
                        tooltip="Resume Queue"
                        onClick={() => toggleQueueStatus(queue.doctorId)}
                      />
                    )}
                    {queue.status === 'active' && (
                      <Button 
                        icon="pi pi-ban" 
                        size="small" 
                        severity="danger"
                        tooltip="Deactivate Doctor"
                        onClick={() => deactivateDoctor(queue.doctorId)}
                      />
                    )}
                    {(queue.status === 'break' || queue.status === 'inactive') && (
                      <Button 
                        icon="pi pi-check" 
                        size="small" 
                        severity="success"
                        tooltip="Activate Doctor"
                        onClick={() => activateDoctor(queue.doctorId)}
                      />
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </TabPanel>
        
        <TabPanel header={t('drawerCounter')} leftIcon="pi pi-wallet mr-2">
          <div className="grid">
            <div className="col-12 lg:col-8">
              <Card title="Real-time Drawer Totals">
                <div className="grid mb-4">
                  <div className="col-12 md:col-6">
                    <div className="p-4 border-round bg-green-50 border-green-200">
                      <div className="flex justify-content-between align-items-center">
                        <div>
                          <div className="text-green-600 font-medium mb-1">Cash in Drawer</div>
                          <div className="text-3xl font-bold text-green-900">₹{drawerStats.totalCash.toLocaleString()}</div>
                          <div className="text-sm text-green-600 mt-1">+₹{Math.floor(Math.random() * 1000)} today</div>
                        </div>
                        <i className="pi pi-money-bill text-green-500 text-4xl"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 md:col-6">
                    <div className="p-4 border-round bg-blue-50 border-blue-200">
                      <div className="flex justify-content-between align-items-center">
                        <div>
                          <div className="text-blue-600 font-medium mb-1">Online Payments</div>
                          <div className="text-3xl font-bold text-blue-900">₹{drawerStats.totalOnline.toLocaleString()}</div>
                          <div className="text-sm text-blue-600 mt-1">+₹{Math.floor(Math.random() * 2000)} today</div>
                        </div>
                        <i className="pi pi-credit-card text-blue-500 text-4xl"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid mb-4">
                  <div className="col-12 md:col-4">
                    <div className="text-center p-3 border-round surface-100">
                      <div className="text-2xl font-bold text-orange-600">{drawerStats.totalPatients}</div>
                      <div className="text-sm text-600">Patients Served</div>
                    </div>
                  </div>
                  <div className="col-12 md:col-4">
                    <div className="text-center p-3 border-round surface-100">
                      <div className="text-2xl font-bold text-purple-600">{drawerStats.pendingPayments}</div>
                      <div className="text-sm text-600">Pending Payments</div>
                    </div>
                  </div>
                  <div className="col-12 md:col-4">
                    <div className="text-center p-3 border-round surface-100">
                      <div className="text-2xl font-bold text-green-600">₹{(drawerStats.totalCash + drawerStats.totalOnline).toLocaleString()}</div>
                      <div className="text-sm text-600">Total Collection</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <Button 
                    label="Record Payment" 
                    icon="pi pi-plus" 
                    className="p-button-success"
                    onClick={() => {
                      setPaymentData({
                        patientName: '',
                        phone: '',
                        amount: '',
                        paymentMethod: 'cash',
                        description: '',
                        receiptNumber: `RCP-${Date.now().toString().slice(-6)}`
                      });
                      setRecordPaymentDialog(true);
                    }}
                  />
                  <Button 
                    label="Drawer Count" 
                    icon="pi pi-calculator" 
                    outlined
                    onClick={() => {
                      setDrawerCountData(prev => ({
                        ...prev,
                        expectedCash: drawerStats.totalCash,
                        actualCash: '',
                        denominations: {
                          '2000': 0, '500': 0, '200': 0, '100': 0, '50': 0,
                          '20': 0, '10': 0, '5': 0, '2': 0, '1': 0
                        }
                      }));
                      setDrawerCountDialog(true);
                    }}
                  />
                  <Button 
                    label="Reconcile" 
                    icon="pi pi-check-square" 
                    className="p-button-warning"
                    outlined
                    onClick={() => {
                      setReconcileData(prev => ({
                        ...prev,
                        systemTotal: drawerStats.totalCash + drawerStats.totalOnline
                      }));
                      setReconcileDialog(true);
                    }}
                  />
                </div>
                
                <DataTable 
                  value={transactionHistory.filter(t => t.date === new Date().toLocaleDateString())}
                  className="p-datatable-sm"
                  header="Today's Transactions"
                  paginator
                  rows={5}
                  emptyMessage="No transactions today"
                >
                  <Column field="time" header="Time" />
                  <Column field="patientName" header="Patient" />
                  <Column field="amount" header="Amount" body={(data) => `₹${data.amount}`} />
                  <Column field="paymentMethod" header="Method" body={(data) => 
                    <Tag value={data.paymentMethod} severity={data.paymentMethod === 'cash' ? 'success' : 'info'} />
                  } />
                  <Column field="receiptNumber" header="Receipt" />
                  <Column field="staff" header="Staff" />
                </DataTable>
              </Card>
            </div>
            
            <div className="col-12 lg:col-4">
              <div className="grid">
                <div className="col-12">
                  <Card title="Quick Actions">
                    <div className="flex flex-column gap-2">
                      <Button 
                        label="Quick Cash Payment" 
                        icon="pi pi-money-bill" 
                        className="w-full p-button-success"
                        onClick={() => {
                          setPaymentData({
                            patientName: '',
                            phone: '',
                            amount: '500',
                            paymentMethod: 'cash',
                            description: 'Consultation fee',
                            receiptNumber: `RCP-${Date.now().toString().slice(-6)}`
                          });
                          setRecordPaymentDialog(true);
                        }}
                      />
                      <Button 
                        label="Physical Count" 
                        icon="pi pi-calculator" 
                        className="w-full p-button-warning"
                        outlined
                        onClick={() => {
                          setDrawerCountData(prev => ({
                            ...prev,
                            expectedCash: drawerStats.totalCash,
                            actualCash: '',
                            denominations: {
                              '2000': 0, '500': 0, '200': 0, '100': 0, '50': 0,
                              '20': 0, '10': 0, '5': 0, '2': 0, '1': 0
                            }
                          }));
                          setDrawerCountDialog(true);
                        }}
                      />
                      <Button 
                        label="Reconcile Now" 
                        icon="pi pi-check-square" 
                        className="w-full p-button-info"
                        outlined
                        onClick={() => {
                          setReconcileData(prev => ({
                            ...prev,
                            systemTotal: drawerStats.totalCash + drawerStats.totalOnline
                          }));
                          setReconcileDialog(true);
                        }}
                      />
                      <Button 
                        label="End-of-Day Report" 
                        icon="pi pi-file-pdf" 
                        className="w-full"
                        onClick={generateEndOfDayReport}
                      />
                      <Button 
                        label="Send to Admin" 
                        icon="pi pi-send" 
                        className="w-full p-button-secondary"
                        outlined
                        onClick={() => {
                          toast.current?.show({
                            severity: 'success',
                            summary: 'Report Sent',
                            detail: 'Daily report sent to admin',
                            life: 3000
                          });
                        }}
                      />
                    </div>
                  </Card>
                </div>
                
                <div className="col-12">
                  <Card title="Payment Methods">
                    <Chart 
                      type="doughnut" 
                      data={paymentMethodsData} 
                      className="w-full" 
                    />
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        
        <TabPanel header={t('transactionHistory')} leftIcon="pi pi-history mr-2">
          <Card title="All Transactions">
            <DataTable 
              value={transactionHistory}
              paginator
              rows={10}
              className="p-datatable-sm"
              globalFilterFields={['patientName', 'paymentMethod', 'receiptNumber']}
              emptyMessage="No transactions found"
              header={
                <div className="flex justify-content-between">
                  <span>Transaction History</span>
                  <Button 
                    label="Export" 
                    icon="pi pi-download" 
                    size="small"
                    onClick={() => {
                      const csv = [
                        'Date,Time,Patient,Phone,Amount,Method,Receipt,Staff,Description',
                        ...transactionHistory.map(t => 
                          `${t.date},${t.time},${t.patientName},${t.phone},${t.amount},${t.paymentMethod},${t.receiptNumber},${t.staff},${t.description}`
                        )
                      ].join('\n');
                      
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                  />
                </div>
              }
            >
              <Column field="date" header="Date" sortable />
              <Column field="time" header="Time" sortable />
              <Column field="patientName" header="Patient" sortable />
              <Column field="amount" header="Amount" body={(data) => `₹${data.amount}`} sortable />
              <Column field="paymentMethod" header="Method" body={(data) => 
                <Tag value={data.paymentMethod} severity={data.paymentMethod === 'cash' ? 'success' : 'info'} />
              } sortable />
              <Column field="receiptNumber" header="Receipt" sortable />
              <Column field="staff" header="Staff" sortable />
              <Column field="description" header="Description" />
            </DataTable>
          </Card>
        </TabPanel>
        
        <TabPanel header={t('analytics')} leftIcon="pi pi-chart-line mr-2">
          <div className="grid">
            <div className="col-12 lg:col-8">
              <Card title="Hourly Appointments">
                <Chart type="line" data={hourlyData} className="w-full" />
              </Card>
            </div>
            
            <div className="col-12 lg:col-4">
              <Card title="Today's Summary">
                <div className="flex flex-column gap-3">
                  <div className="flex justify-content-between p-2 border-round surface-100">
                    <span>Total Appointments</span>
                    <span className="font-bold">{drawerStats.totalPatients}</span>
                  </div>
                  <div className="flex justify-content-between p-2 border-round surface-100">
                    <span>Completed</span>
                    <span className="font-bold text-green-600">{drawerStats.completedAppointments}</span>
                  </div>
                  <div className="flex justify-content-between p-2 border-round surface-100">
                    <span>Cancelled</span>
                    <span className="font-bold text-red-600">{drawerStats.cancelledAppointments}</span>
                  </div>
                  <div className="flex justify-content-between p-2 border-round surface-100">
                    <span>Walk-ins</span>
                    <span className="font-bold text-blue-600">{drawerStats.walkInPatients}</span>
                  </div>
                  <div className="flex justify-content-between p-2 border-round surface-100">
                    <span>Total Revenue</span>
                    <span className="font-bold text-green-600">₹{(drawerStats.totalCash + drawerStats.totalOnline).toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>
        
        <TabPanel header="Notifications" leftIcon="pi pi-bell mr-2">
          <Card title="All Notifications">
            <div className="flex flex-column gap-3">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={index} className="p-3 border-round surface-100 border-left-3 border-blue-500">
                    <div className="flex justify-content-between align-items-start mb-2">
                      <div className="flex align-items-center gap-2">
                        <i className={`pi ${notification.type === 'appointment' ? 'pi-calendar' : notification.type === 'payment' ? 'pi-money-bill' : 'pi-info-circle'} text-blue-500`}></i>
                        <span className="font-medium">{notification.title}</span>
                      </div>
                      <small className="text-500">{notification.time}</small>
                    </div>
                    <p className="m-0 text-600 text-sm">{notification.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <i className="pi pi-bell-slash text-4xl text-400 mb-3"></i>
                  <p className="text-600 m-0">No notifications</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-content-end gap-2 mt-4">
              <Button 
                label="Mark All Read" 
                icon="pi pi-check" 
                outlined
                onClick={() => {
                  toast.current?.show({
                    severity: 'success',
                    summary: 'Notifications Cleared',
                    detail: 'All notifications marked as read',
                    life: 3000
                  });
                }}
                disabled={notifications.length === 0}
              />
            </div>
          </Card>
        </TabPanel>
      </TabView>

      {/* Enhanced Walk-in Patient Dialog */}
      <Dialog
        header="Add Walk-in Patient"
        visible={walkInDialog}
        style={{ width: '600px' }}
        onHide={() => setWalkInDialog(false)}
        className="p-fluid"
      >
        <div className="grid">
          <div className="col-12 md:col-6">
            <label htmlFor="patientName" className="block mb-2 font-medium">Patient Name *</label>
            <InputText
              id="patientName"
              value={walkInData.patientName}
              onChange={(e) => setWalkInData({ ...walkInData, patientName: e.target.value })}
              placeholder="Enter patient name"
              required
            />
          </div>
          <div className="col-12 md:col-6">
            <label htmlFor="phone" className="block mb-2 font-medium">Phone Number *</label>
            <InputText
              id="phone"
              value={walkInData.phone}
              onChange={(e) => setWalkInData({ ...walkInData, phone: e.target.value })}
              placeholder="+91 XXXXXXXXXX"
              required
            />
          </div>
          <div className="col-12 md:col-6">
            <label htmlFor="doctor" className="block mb-2 font-medium">Select Doctor *</label>
            <Dropdown
              id="doctor"
              value={walkInData.doctorId}
              options={doctors}
              onChange={(e) => setWalkInData({ ...walkInData, doctorId: e.value })}
              placeholder="Select a doctor"
              filter
              required
            />
          </div>
          <div className="col-12 md:col-6">
            <label htmlFor="emergencyLevel" className="block mb-2 font-medium">Priority Level</label>
            <Dropdown
              id="emergencyLevel"
              value={walkInData.emergencyLevel}
              options={[
                { label: 'Normal', value: 'normal' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' }
              ]}
              onChange={(e) => setWalkInData({ ...walkInData, emergencyLevel: e.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="symptoms" className="block mb-2 font-medium">Symptoms</label>
            <InputTextarea
              id="symptoms"
              value={walkInData.symptoms}
              onChange={(e) => setWalkInData({ ...walkInData, symptoms: e.target.value })}
              placeholder={voiceState.isRecording ? "Listening..." : "Describe symptoms..."}
              rows={3}
            />
            <div className="flex justify-content-between align-items-center mt-2">
              <div className="flex align-items-center gap-2">
                {voiceState.transcript && (
                  <small className="text-600">
                    Confidence: {Math.round(voiceState.confidence * 100)}%
                  </small>
                )}
                {voiceState.error && (
                  <small className="text-red-500">{voiceState.error}</small>
                )}
              </div>
              <div className="flex gap-1">
                {voiceState.transcript && (
                  <Button 
                    icon="pi pi-trash"
                    className="p-button-sm p-button-text"
                    onClick={clearTranscript}
                    tooltip="Clear transcript"
                  />
                )}
                <Button 
                  icon={voiceState.isRecording ? "pi pi-stop" : "pi pi-microphone"}
                  className={`p-button-sm ${voiceState.isRecording ? 'p-button-danger voice-recording' : 'p-button-info'}`}
                  onClick={handleVoiceRecording}
                  tooltip={voiceState.isRecording ? "Stop recording" : "Start voice input"}
                />
              </div>
            </div>
          </div>
          <div className="col-12 md:col-6">
            <label htmlFor="payment" className="block mb-2 font-medium">Payment Method</label>
            <Dropdown
              id="payment"
              value={walkInData.paymentMethod}
              options={[
                { label: 'Cash', value: 'cash', icon: 'pi pi-money-bill' },
                { label: 'UPI', value: 'upi', icon: 'pi pi-mobile' },
                { label: 'Card', value: 'card', icon: 'pi pi-credit-card' }
              ]}
              onChange={(e) => setWalkInData({ ...walkInData, paymentMethod: e.value })}
              optionLabel="label"
            />
          </div>
        </div>
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancel" 
            icon="pi pi-times"
            outlined 
            onClick={() => setWalkInDialog(false)} 
            disabled={dashboardState.loading}
          />
          <Button 
            label="Add Patient" 
            icon="pi pi-plus"
            onClick={handleWalkInSubmit} 
            loading={dashboardState.loading}
            disabled={!walkInData.patientName || !walkInData.phone || !walkInData.doctorId}
          />
        </div>
      </Dialog>

      {/* Enhanced Patient Search Dialog */}
      <Dialog
        header="Patient Search & History"
        visible={patientSearchDialog}
        style={{ width: '1200px' }}
        onHide={() => setPatientSearchDialog(false)}
        maximizable
      >
        <div className="grid mb-3">
          <div className="col-12 md:col-3">
            <label className="block mb-2 font-medium">Phone Number (Primary ID)</label>
            <InputText
              value={searchFilters.phone}
              onChange={(e) => setSearchFilters({ ...searchFilters, phone: e.target.value })}
              placeholder="+91 XXXXXXXXXX"
              className="w-full"
            />
          </div>
          <div className="col-12 md:col-3">
            <label className="block mb-2 font-medium">Patient Name</label>
            <InputText
              value={searchFilters.name}
              onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
              placeholder="Search by name"
              className="w-full"
            />
          </div>
          <div className="col-12 md:col-3">
            <label className="block mb-2 font-medium">Doctor</label>
            <Dropdown
              value={searchFilters.doctorId}
              options={[{ label: 'All Doctors', value: '' }, ...doctors]}
              onChange={(e) => setSearchFilters({ ...searchFilters, doctorId: e.value })}
              placeholder="Select doctor"
              className="w-full"
            />
          </div>
          <div className="col-12 md:col-3">
            <label className="block mb-2 font-medium">Visit Date</label>
            <Calendar
              value={searchFilters.dateRange}
              onChange={(e) => setSearchFilters({ ...searchFilters, dateRange: e.value })}
              selectionMode="range"
              readOnlyInput
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex justify-content-between align-items-center mb-3">
          <div className="flex gap-2">
            <Button 
              label="Clear" 
              icon="pi pi-refresh" 
              outlined 
              onClick={() => setSearchFilters({
                phone: '',
                name: '',
                doctorId: '',
                dateRange: null,
                status: []
              })}
            />
            <Button 
              label="Search" 
              icon="pi pi-search" 
              onClick={handlePatientSearch}
              loading={dashboardState.loading}
            />
          </div>
          <Button 
            label="Export Results" 
            icon="pi pi-download" 
            outlined
            onClick={() => {
              toast.current?.show({
                severity: 'success',
                summary: 'Export Complete',
                detail: 'Patient search results exported',
                life: 3000
              });
            }}
          />
        </div>
        
        {/* Patient Search Results */}
        <div className="grid">
          <div className="col-12 lg:col-8">
            <Card title="Search Results">
              <DataTable 
                value={appointments.filter(apt => {
                  if (searchFilters.phone && !apt.phone.includes(searchFilters.phone)) return false;
                  if (searchFilters.name && !apt.patientName.toLowerCase().includes(searchFilters.name.toLowerCase())) return false;
                  if (searchFilters.doctorId && apt.doctorId !== searchFilters.doctorId) return false;
                  return true;
                }).map(apt => ({
                  id: apt.id,
                  name: apt.patientName,
                  phone: apt.phone,
                  lastVisit: new Date().toLocaleDateString(),
                  doctor: apt.doctorName,
                  reason: apt.symptoms || 'Consultation',
                  timeTaken: `${apt.estimatedDuration || 20} min`,
                  status: apt.status
                }))}
                responsiveLayout="scroll"
                emptyMessage="No patients found. Use search filters above."
                className="p-datatable-sm"
              >
                <Column field="name" header="Patient Name" />
                <Column field="phone" header="Phone" />
                <Column field="lastVisit" header="Visit Date" />
                <Column field="doctor" header="Doctor" />
                <Column field="reason" header="Reason" />
                <Column field="timeTaken" header="Time Taken" />
                <Column field="status" header="Status" body={(data) => 
                  <Tag value={data.status} severity={getSeverity(data.status)} />
                } />
              </DataTable>
            </Card>
          </div>
          
          <div className="col-12 lg:col-4">
            <Card title="Patient Summary">
              <div className="flex flex-column gap-3">
                <div className="text-center mb-3">
                  <Avatar label="?" size="xlarge" className="mb-2" />
                  <h3 className="m-0">Select Patient</h3>
                  <p className="text-600 m-0">Search to view details</p>
                </div>
                
                <div className="grid">
                  <div className="col-6">
                    <div className="text-center p-2 border-round surface-100">
                      <div className="text-2xl font-bold text-blue-600">{appointments.length}</div>
                      <div className="text-sm text-600">Total Appointments</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-2 border-round surface-100">
                      <div className="text-2xl font-bold text-green-600">₹{(drawerStats.totalCash + drawerStats.totalOnline).toLocaleString()}</div>
                      <div className="text-sm text-600">Total Revenue</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <h4>Recent Activity</h4>
                  <Timeline 
                    value={appointments.slice(0, 3).map(apt => ({
                      date: new Date().toLocaleDateString(),
                      doctor: apt.doctorName,
                      reason: apt.symptoms || 'Consultation',
                      patient: apt.patientName
                    }))}
                    align="left"
                    className="customized-timeline"
                  >
                    <template>
                      {(item: any) => (
                        <div>
                          <div className="font-medium">{item.patient}</div>
                          <div className="text-sm text-600">{item.doctor}</div>
                          <div className="text-xs text-500">{item.reason}</div>
                        </div>
                      )}
                    </template>
                  </Timeline>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Dialog>

      {/* Enhanced Report Generation Dialog */}
      <Dialog
        header={generatedReport ? "Generated Report" : "Generate Comprehensive Reports"}
        visible={reportDialog}
        style={{ width: generatedReport ? '1000px' : '700px' }}
        onHide={() => {
          setReportDialog(false);
          setGeneratedReport(null);
        }}
        maximizable={!!generatedReport}
      >
        <div className="grid">
          <div className="col-12 md:col-6">
            <label className="block mb-2 font-medium">Report Type</label>
            <Dropdown
              value={reportFilters.reportType}
              options={[
                { label: 'Daily Report', value: 'daily' },
                { label: 'Weekly Report', value: 'weekly' },
                { label: 'Monthly Report', value: 'monthly' },
                { label: 'Quarterly Report', value: 'quarterly' },
                { label: 'Half-Yearly Report', value: 'half-yearly' },
                { label: 'Annual Report', value: 'annual' },
                { label: 'Custom Range', value: 'custom' }
              ]}
              onChange={(e) => setReportFilters({ ...reportFilters, reportType: e.value })}
              className="w-full"
            />
          </div>
          
          <div className="col-12 md:col-6">
            <label className="block mb-2 font-medium">Export Format</label>
            <Dropdown
              value="pdf"
              options={[
                { label: 'PDF Report', value: 'pdf', icon: 'pi pi-file-pdf' },
                { label: 'Excel Spreadsheet', value: 'excel', icon: 'pi pi-file-excel' },
                { label: 'CSV Data', value: 'csv', icon: 'pi pi-file' }
              ]}
              optionLabel="label"
              className="w-full"
            />
          </div>
          
          {reportFilters.reportType === 'custom' && (
            <div className="col-12">
              <label className="block mb-2 font-medium">Date Range</label>
              <Calendar
                value={reportFilters.dateRange}
                onChange={(e) => setReportFilters({ ...reportFilters, dateRange: e.value })}
                selectionMode="range"
                readOnlyInput
                hideOnRangeSelection
                className="w-full"
              />
            </div>
          )}
          
          <div className="col-12">
            <label className="block mb-2 font-medium">Include Departments</label>
            <MultiSelect
              value={reportFilters.departments}
              options={departments}
              onChange={(e) => setReportFilters({ ...reportFilters, departments: e.value })}
              placeholder="Select departments (All if none selected)"
              maxSelectedLabels={3}
              className="w-full"
            />
          </div>
          
          <div className="col-12">
            <label className="block mb-2 font-medium">Report Sections</label>
            <div className="grid">
              <div className="col-6">
                <div className="field-checkbox">
                  <input type="checkbox" id="patients" defaultChecked />
                  <label htmlFor="patients">Patient Details</label>
                </div>
                <div className="field-checkbox">
                  <input type="checkbox" id="revenue" defaultChecked />
                  <label htmlFor="revenue">Revenue Summary</label>
                </div>
                <div className="field-checkbox">
                  <input type="checkbox" id="appointments" defaultChecked />
                  <label htmlFor="appointments">Appointments</label>
                </div>
              </div>
              <div className="col-6">
                <div className="field-checkbox">
                  <input type="checkbox" id="payments" defaultChecked />
                  <label htmlFor="payments">Payment Details</label>
                </div>
                <div className="field-checkbox">
                  <input type="checkbox" id="queue" defaultChecked />
                  <label htmlFor="queue">Queue Analytics</label>
                </div>
                <div className="field-checkbox">
                  <input type="checkbox" id="staff" defaultChecked />
                  <label htmlFor="staff">Staff Performance</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {generatedReport ? (
          <div>
            <div className="mb-4 p-3 border-round bg-green-50 border-green-200">
              <h4 className="mt-0 mb-2 text-green-900">📊 Report Summary</h4>
              <div className="grid">
                <div className="col-6 md:col-3">
                  <div className="text-center p-2 border-round surface-100">
                    <div className="text-2xl font-bold text-blue-600">{generatedReport.summary.totalPatients}</div>
                    <div className="text-sm text-600">Total Patients</div>
                  </div>
                </div>
                <div className="col-6 md:col-3">
                  <div className="text-center p-2 border-round surface-100">
                    <div className="text-2xl font-bold text-green-600">₹{generatedReport.summary.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-600">Total Revenue</div>
                  </div>
                </div>
                <div className="col-6 md:col-3">
                  <div className="text-center p-2 border-round surface-100">
                    <div className="text-2xl font-bold text-orange-600">{generatedReport.summary.completedAppointments}</div>
                    <div className="text-sm text-600">Completed</div>
                  </div>
                </div>
                <div className="col-6 md:col-3">
                  <div className="text-center p-2 border-round surface-100">
                    <div className="text-2xl font-bold text-purple-600">{generatedReport.summary.avgWaitTime}m</div>
                    <div className="text-sm text-600">Avg Wait</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid">
              <div className="col-12 lg:col-6">
                <Card title="Patient Details" className="mb-3">
                  <DataTable 
                    value={generatedReport.patientDetails}
                    className="p-datatable-sm"
                    paginator
                    rows={5}
                    emptyMessage="No patient data"
                  >
                    <Column field="name" header="Patient" />
                    <Column field="doctor" header="Doctor" />
                    <Column field="status" header="Status" body={(data) => 
                      <Tag value={data.status} severity={getSeverity(data.status)} />
                    } />
                  </DataTable>
                </Card>
              </div>
              
              <div className="col-12 lg:col-6">
                <Card title="Queue Analytics" className="mb-3">
                  <DataTable 
                    value={generatedReport.queueAnalytics}
                    className="p-datatable-sm"
                    emptyMessage="No queue data"
                  >
                    <Column field="doctor" header="Doctor" />
                    <Column field="completedToday" header="Completed" />
                    <Column field="efficiency" header="Efficiency" body={(data) => `${data.efficiency}%`} />
                  </DataTable>
                </Card>
              </div>
            </div>
            
            <div className="flex justify-content-between align-items-center mt-4">
              <div className="text-sm text-600">
                Report generated on {generatedReport.generatedAt.toLocaleString()}
              </div>
              <div className="flex gap-2">
                <Button 
                  label="New Report" 
                  icon="pi pi-plus" 
                  outlined
                  onClick={() => setGeneratedReport(null)}
                />
                <Button 
                  label="Export to Excel" 
                  icon="pi pi-file-excel" 
                  className="p-button-success"
                  onClick={exportToExcel}
                />
                <Button 
                  label="Close" 
                  onClick={() => {
                    setReportDialog(false);
                    setGeneratedReport(null);
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid">
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Report Type</label>
                <Dropdown
                  value={reportFilters.reportType}
                  options={[
                    { label: 'Daily Report', value: 'daily' },
                    { label: 'Weekly Report', value: 'weekly' },
                    { label: 'Monthly Report', value: 'monthly' },
                    { label: 'Quarterly Report', value: 'quarterly' },
                    { label: 'Half-Yearly Report', value: 'half-yearly' },
                    { label: 'Annual Report', value: 'annual' },
                    { label: 'Custom Range', value: 'custom' }
                  ]}
                  onChange={(e) => setReportFilters({ ...reportFilters, reportType: e.value })}
                  className="w-full"
                />
              </div>
              
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Export Format</label>
                <Dropdown
                  value="pdf"
                  options={[
                    { label: 'PDF Report', value: 'pdf', icon: 'pi pi-file-pdf' },
                    { label: 'Excel Spreadsheet', value: 'excel', icon: 'pi pi-file-excel' },
                    { label: 'CSV Data', value: 'csv', icon: 'pi pi-file' }
                  ]}
                  optionLabel="label"
                  className="w-full"
                />
              </div>
              
              {reportFilters.reportType === 'custom' && (
                <div className="col-12">
                  <label className="block mb-2 font-medium">Date Range</label>
                  <Calendar
                    value={reportFilters.dateRange}
                    onChange={(e) => setReportFilters({ ...reportFilters, dateRange: e.value })}
                    selectionMode="range"
                    readOnlyInput
                    hideOnRangeSelection
                    className="w-full"
                  />
                </div>
              )}
              
              <div className="col-12">
                <label className="block mb-2 font-medium">Include Departments</label>
                <MultiSelect
                  value={reportFilters.departments}
                  options={departments}
                  onChange={(e) => setReportFilters({ ...reportFilters, departments: e.value })}
                  placeholder="Select departments (All if none selected)"
                  maxSelectedLabels={3}
                  className="w-full"
                />
              </div>
              
              <div className="col-12">
                <label className="block mb-2 font-medium">Report Sections</label>
                <div className="grid">
                  <div className="col-6">
                    <div className="field-checkbox">
                      <input type="checkbox" id="patients" defaultChecked />
                      <label htmlFor="patients">Patient Details</label>
                    </div>
                    <div className="field-checkbox">
                      <input type="checkbox" id="revenue" defaultChecked />
                      <label htmlFor="revenue">Revenue Summary</label>
                    </div>
                    <div className="field-checkbox">
                      <input type="checkbox" id="appointments" defaultChecked />
                      <label htmlFor="appointments">Appointments</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="field-checkbox">
                      <input type="checkbox" id="payments" defaultChecked />
                      <label htmlFor="payments">Payment Details</label>
                    </div>
                    <div className="field-checkbox">
                      <input type="checkbox" id="queue" defaultChecked />
                      <label htmlFor="queue">Queue Analytics</label>
                    </div>
                    <div className="field-checkbox">
                      <input type="checkbox" id="staff" defaultChecked />
                      <label htmlFor="staff">Staff Performance</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-content-between align-items-center mt-4">
              <div className="text-sm text-600">
                Report will include data from {reportFilters.reportType} period
              </div>
              <div className="flex gap-2">
                <Button 
                  label="Cancel" 
                  outlined 
                  onClick={() => setReportDialog(false)}
                  disabled={dashboardState.loading}
                />
                <Button 
                  label="Generate Report" 
                  icon="pi pi-file-pdf"
                  onClick={handleGenerateReport}
                  loading={dashboardState.loading}
                />
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Enhanced Queue Sidebar */}
      <Sidebar
        visible={queueSidebar}
        position="right"
        onHide={() => setQueueSidebar(false)}
        className="w-full md:w-25rem lg:w-35rem"
      >
        <div className="flex justify-content-between align-items-center mb-4">
          <h3 className="m-0">Live Queue Management</h3>
          <Button 
            icon="pi pi-refresh" 
            className="p-button-rounded p-button-text"
            onClick={() => {
              toast.current?.show({
                severity: 'info',
                summary: 'Queue Refreshed',
                detail: 'Latest queue data loaded',
                life: 2000
              });
            }}
          />
        </div>
        
        <div className="flex flex-column gap-4">
          {queueState.map((queue, index) => (
            <Card key={index} className="border-left-3 border-primary">
              <div className="flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 className="m-0 text-lg">{queue.doctorName}</h4>
                  <p className="m-0 text-sm text-600">{queue.department}</p>
                </div>
                <div className="flex align-items-center gap-2">
                  <Tag 
                    value={queue.status} 
                    severity={queue.status === 'active' ? 'success' : 'warning'}
                    icon={queue.status === 'active' ? 'pi pi-check' : 'pi pi-pause'}
                  />
                  <Badge value={(patientQueues[queue.doctorId] || []).length} severity="info" />
                </div>
              </div>
              
              <div className="grid mb-3">
                <div className="col-6">
                  <div className="text-center p-2 border-round surface-50">
                    <div className="font-bold text-blue-600">{queue.completedToday}</div>
                    <div className="text-xs text-600">Completed</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-2 border-round surface-50">
                    <div className="font-bold text-orange-600">{queue.avgWaitTime}</div>
                    <div className="text-xs text-600">Avg Wait</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-content-between mb-1">
                  <span className="text-sm font-medium">Current Patient</span>
                  <span className="text-sm font-bold text-green-600">{(patientQueues[queue.doctorId] || [])[0] || 'None'}</span>
                </div>
                <div className="flex justify-content-between mb-2">
                  <span className="text-sm font-medium">Next Patient</span>
                  <span className="text-sm font-bold text-blue-600">{(patientQueues[queue.doctorId] || [])[1] || 'None'}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-content-between mb-1">
                  <span className="text-sm font-medium">Efficiency</span>
                  <span className="text-sm">{queue.efficiency}%</span>
                </div>
                <ProgressBar value={queue.efficiency} className="h-0-5rem" />
              </div>
              
              <div className="flex gap-1">
                <Button 
                  label="Call Next" 
                  icon="pi pi-arrow-right" 
                  size="small" 
                  className="flex-1"
                  disabled={(patientQueues[queue.doctorId] || []).length === 0 || queue.status !== 'active'}
                  onClick={() => callNextPatient(queue.doctorId)}
                />
                <Button 
                  icon={queue.status === 'active' ? 'pi pi-pause' : 'pi pi-play'} 
                  size="small" 
                  severity={queue.status === 'active' ? 'warning' : 'success'}
                  tooltip={queue.status === 'active' ? 'Pause Queue' : 'Resume Queue'}
                  onClick={() => toggleQueueStatus(queue.doctorId)}
                />
                <Button 
                  icon="pi pi-list" 
                  size="small" 
                  outlined
                  tooltip="View Full Queue"
                  onClick={() => viewFullQueue(queue.doctorId)}
                />
              </div>
              
              {/* Waiting Patients List */}
              {(patientQueues[queue.doctorId] || []).length > 0 && (
                <div className="mt-3 pt-3 border-top-1 surface-border">
                  <div className="text-sm font-medium mb-2">Waiting Patients</div>
                  <div className="flex flex-column gap-1">
                    {(patientQueues[queue.doctorId] || []).map((patient, idx) => (
                      <div key={idx} className="flex justify-content-between align-items-center p-2 border-round surface-50">
                        <div className="flex align-items-center gap-2">
                          <Badge value={idx + 1} severity="secondary" />
                          <span className="text-sm">{patient}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            icon="pi pi-arrow-up" 
                            size="small" 
                            className="p-button-text p-button-sm"
                            tooltip="Move Up"
                            disabled={idx === 0}
                            onClick={() => movePatientUp(idx, queue.doctorId)}
                          />
                          <Button 
                            icon="pi pi-times" 
                            size="small" 
                            className="p-button-text p-button-sm p-button-danger"
                            tooltip="Remove from Queue"
                            onClick={() => removeFromQueue(idx, queue.doctorId)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-top-1 surface-border">
          <Button 
            label="Emergency Override" 
            icon="pi pi-exclamation-triangle" 
            className="w-full p-button-danger"
            outlined
            onClick={emergencyOverride}
          />
        </div>
      </Sidebar>

      {/* Comprehensive Settings Dialog */}
      <Dialog
        header="Staff Dashboard Settings"
        visible={settingsDialog}
        style={{ width: '900px' }}
        onHide={() => setSettingsDialog(false)}
        maximizable
      >
        <TabView>
          <TabPanel header="General" leftIcon="pi pi-cog mr-2">
            <div className="grid">
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">{t('language')}</label>
                <Dropdown
                  value={settings.language}
                  options={[
                    { label: 'English', value: 'en' },
                    { label: 'తెలుగు (Telugu)', value: 'te' },
                    { label: 'हिंदी (Hindi)', value: 'hi' }
                  ]}
                  onChange={(e) => {
                    setSettings(prev => ({ ...prev, language: e.value }));
                    setLanguage(e.value);
                    toast.current?.show({
                      severity: 'success',
                      summary: 'Language Changed',
                      detail: `Language changed to ${e.value === 'en' ? 'English' : e.value === 'te' ? 'Telugu' : 'Hindi'}`,
                      life: 3000
                    });
                  }}
                  className="w-full"
                />
              </div>
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">{t('theme')}</label>
                <Dropdown
                  value={settings.theme}
                  options={[
                    { label: '☀️ Light Theme', value: 'light' },
                    { label: '🌙 Dark Theme', value: 'dark' },
                    { label: '🌍 Auto (System)', value: 'auto' }
                  ]}
                  onChange={(e) => handleThemeChange(e.value)}
                  className="w-full"
                />
              </div>
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Auto Refresh Interval (seconds)</label>
                <div className="p-inputgroup">
                  <InputText
                    type="number"
                    min="5"
                    max="300"
                    value={settings.refreshInterval.toString()}
                    onChange={(e) => {
                      const value = Math.max(5, Math.min(300, parseInt(e.target.value) || 30));
                      handleSettingChange('refreshInterval', value);
                      // Real-time validation feedback
                      const input = e.target;
                      if (value < 10) {
                        input.style.borderColor = '#FF9800';
                        input.title = 'Very frequent refresh may impact performance';
                      } else if (value > 120) {
                        input.style.borderColor = '#2196F3';
                        input.title = 'Longer intervals save bandwidth';
                      } else {
                        input.style.borderColor = '#4CAF50';
                        input.title = 'Optimal refresh interval';
                      }
                      setTimeout(() => {
                        input.style.borderColor = '';
                      }, 2000);
                    }}
                    className="w-full"
                    placeholder="5-300 seconds"
                  />
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-clock"></i>
                  </span>
                </div>
              </div>
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Date Format</label>
                <Dropdown
                  value={settings.dateFormat}
                  options={[
                    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
                    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
                  ]}
                  onChange={(e) => setSettings({ ...settings, dateFormat: e.value })}
                  className="w-full"
                />
              </div>
              <div className="col-12">
                <div className="grid">
                  <div className="col-6">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="autoRefresh" 
                        checked={settings.autoRefresh}
                        onChange={(e) => {
                          handleSettingChange('autoRefresh', e.target.checked);
                          // Add visual indicator
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="autoRefresh">Enable Auto Refresh</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="soundNotifications" 
                        checked={settings.soundNotifications}
                        onChange={(e) => {
                          handleSettingChange('soundNotifications', e.target.checked);
                          // Add visual feedback
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="soundNotifications">Sound Notifications</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          
          <TabPanel header="Queue" leftIcon="pi pi-users mr-2">
            <div className="grid">
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Max Wait Time (minutes)</label>
                <div className="p-inputgroup">
                  <InputText
                    type="number"
                    min="10"
                    max="180"
                    value={settings.maxWaitTime.toString()}
                    onChange={(e) => {
                      const value = Math.max(10, Math.min(180, parseInt(e.target.value) || 60));
                      handleSettingChange('maxWaitTime', value);
                      // Real-time validation with color coding
                      const input = e.target;
                      if (value > 120) {
                        input.style.borderColor = '#FF5722';
                        input.title = 'Long wait times may frustrate patients';
                      } else if (value > 60) {
                        input.style.borderColor = '#FF9800';
                        input.title = 'Moderate wait time';
                      } else {
                        input.style.borderColor = '#4CAF50';
                        input.title = 'Good patient experience';
                      }
                      setTimeout(() => {
                        input.style.borderColor = '';
                      }, 2000);
                    }}
                    className="w-full"
                    placeholder="10-180 minutes"
                  />
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-hourglass"></i>
                  </span>
                </div>
              </div>
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Queue Display Count</label>
                <div className="p-inputgroup">
                  <InputText
                    type="number"
                    min="1"
                    max="20"
                    value={settings.queueDisplayCount.toString()}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(20, parseInt(e.target.value) || 5));
                      handleSettingChange('queueDisplayCount', value);
                      // Visual feedback
                      const input = e.target;
                      input.style.transform = 'scale(1.05)';
                      setTimeout(() => {
                        input.style.transform = 'scale(1)';
                      }, 200);
                    }}
                    className="w-full"
                    placeholder="1-20 patients"
                  />
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-list"></i>
                  </span>
                </div>
              </div>
              <div className="col-12">
                <div className="grid">
                  <div className="col-6">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="queueAutoAdvance" 
                        checked={settings.queueAutoAdvance}
                        onChange={(e) => {
                          handleSettingChange('queueAutoAdvance', e.target.checked);
                          // Visual feedback
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="queueAutoAdvance">Auto Advance Queue</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="emergencyPriority" 
                        checked={settings.emergencyPriority}
                        onChange={(e) => {
                          handleSettingChange('emergencyPriority', e.target.checked);
                          // Visual feedback
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="emergencyPriority">Emergency Priority</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          
          <TabPanel header="Voice" leftIcon="pi pi-microphone mr-2">
            <div className="grid">
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Voice Language</label>
                <div className="flex gap-2">
                  <Dropdown
                    value={settings.voiceLanguage}
                    options={[
                      { label: 'English (US)', value: 'en-US' },
                      { label: 'English (UK)', value: 'en-GB' },
                      { label: 'Hindi (हिंदी)', value: 'hi-IN' },
                      { label: 'Telugu (తెలుగు)', value: 'te-IN' }
                    ]}
                    onChange={(e) => {
                      handleSettingChange('voiceLanguage', e.value);
                      toast.current?.show({
                        severity: 'info',
                        summary: 'Voice Language Changed',
                        detail: `Voice recognition set to ${e.value}`,
                        life: 3000
                      });
                    }}
                    className="flex-1"
                  />
                  <Button 
                    icon={voiceState.isRecording ? "pi pi-stop" : "pi pi-microphone"}
                    className={voiceState.isRecording ? "p-button-danger voice-recording" : ""}
                    tooltip={voiceState.isRecording ? "Stop Test" : "Test Voice"}
                    onClick={() => {
                      if (settings.voiceEnabled) {
                        if (voiceState.isRecording) {
                          stopRecording();
                          toast.current?.show({
                            severity: 'info',
                            summary: 'Voice Test Stopped',
                            detail: voiceState.transcript || 'No speech detected',
                            life: 4000
                          });
                        } else {
                          startRecording();
                          toast.current?.show({
                            severity: 'info',
                            summary: 'Voice Test Started',
                            detail: 'Say something to test voice recognition',
                            life: 3000
                          });
                        }
                      } else {
                        toast.current?.show({
                          severity: 'warn',
                          summary: 'Voice Disabled',
                          detail: 'Enable voice recording first',
                          life: 3000
                        });
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Confidence Threshold</label>
                <div className="flex flex-column gap-2">
                  <div className="p-inputgroup">
                    <InputText
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={settings.voiceConfidenceThreshold.toString()}
                      onChange={(e) => {
                        const value = Math.max(0, Math.min(1, parseFloat(e.target.value) || 0.7));
                        handleSettingChange('voiceConfidenceThreshold', value);
                        // Show real-time feedback
                        const input = e.target;
                        input.style.borderColor = value >= 0.8 ? '#4CAF50' : value >= 0.5 ? '#FF9800' : '#F44336';
                        setTimeout(() => {
                          input.style.borderColor = '';
                        }, 1000);
                      }}
                      className="w-full"
                    />
                    <span className="p-inputgroup-addon">
                      <i className={`pi ${settings.voiceConfidenceThreshold >= 0.8 ? 'pi-check text-green-500' : settings.voiceConfidenceThreshold >= 0.5 ? 'pi-exclamation-triangle text-orange-500' : 'pi-times text-red-500'}`}></i>
                    </span>
                  </div>
                  <div className="text-xs text-600">
                    {settings.voiceConfidenceThreshold >= 0.8 ? '🎯 High accuracy - fewer false positives' : 
                     settings.voiceConfidenceThreshold >= 0.5 ? '⚖️ Balanced - good for most users' : 
                     '🔊 Low threshold - may capture unclear speech'}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="field-checkbox">
                  <input 
                    type="checkbox" 
                    id="voiceEnabled" 
                    checked={settings.voiceEnabled}
                    onChange={(e) => {
                      handleSettingChange('voiceEnabled', e.target.checked);
                      // Visual feedback
                      const checkbox = e.target;
                      checkbox.style.transform = 'scale(1.1)';
                      setTimeout(() => {
                        checkbox.style.transform = 'scale(1)';
                      }, 200);
                    }}
                  />
                  <label htmlFor="voiceEnabled">Enable Voice Recording</label>
                </div>
              </div>
            </div>
          </TabPanel>
          
          <TabPanel header="Payments" leftIcon="pi pi-wallet mr-2">
            <div className="grid">
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Default Payment Method</label>
                <Dropdown
                  value={settings.defaultPaymentMethod}
                  options={[
                    { label: 'Cash', value: 'cash' },
                    { label: 'UPI', value: 'upi' },
                    { label: 'Card', value: 'card' }
                  ]}
                  onChange={(e) => {
                    handleSettingChange('defaultPaymentMethod', e.value);
                    // Visual feedback for dropdown
                    const dropdown = e.target.closest('.p-dropdown');
                    if (dropdown) {
                      dropdown.style.transform = 'scale(1.02)';
                      setTimeout(() => {
                        dropdown.style.transform = 'scale(1)';
                      }, 200);
                    }
                  }}
                  className="w-full"
                />
              </div>
              <div className="col-12">
                <div className="grid">
                  <div className="col-6">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="requirePaymentConfirmation" 
                        checked={settings.requirePaymentConfirmation}
                        onChange={(e) => {
                          handleSettingChange('requirePaymentConfirmation', e.target.checked);
                          // Visual feedback
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="requirePaymentConfirmation">Require Payment Confirmation</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="autoGenerateReceipts" 
                        checked={settings.autoGenerateReceipts}
                        onChange={(e) => {
                          handleSettingChange('autoGenerateReceipts', e.target.checked);
                          // Visual feedback
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="autoGenerateReceipts">Auto Generate Receipts</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          
          <TabPanel header="Notifications" leftIcon="pi pi-bell mr-2">
            <div className="grid">
              <div className="col-12">
                <div className="grid">
                  <div className="col-4">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="emailNotifications" 
                        checked={settings.emailNotifications}
                        onChange={(e) => {
                          handleSettingChange('emailNotifications', e.target.checked);
                          // Visual feedback
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="emailNotifications">Email Notifications</label>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="smsNotifications" 
                        checked={settings.smsNotifications}
                        onChange={(e) => {
                          handleSettingChange('smsNotifications', e.target.checked);
                          // Visual feedback
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="smsNotifications">SMS Notifications</label>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="pushNotifications" 
                        checked={settings.pushNotifications}
                        onChange={(e) => {
                          handleSettingChange('pushNotifications', e.target.checked);
                          // Visual feedback
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="pushNotifications">Push Notifications</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          
          <TabPanel header="Display" leftIcon="pi pi-desktop mr-2">
            <div className="grid">
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Time Format</label>
                <Dropdown
                  value={settings.timeFormat}
                  options={[
                    { label: '24 Hour', value: '24h' },
                    { label: '12 Hour', value: '12h' }
                  ]}
                  onChange={(e) => {
                    handleSettingChange('timeFormat', e.value);
                    // Visual feedback for dropdown
                    const dropdown = e.target.closest('.p-dropdown');
                    if (dropdown) {
                      dropdown.style.transform = 'scale(1.02)';
                      setTimeout(() => {
                        dropdown.style.transform = 'scale(1)';
                      }, 200);
                    }
                  }}
                  className="w-full"
                />
              </div>
              <div className="col-12">
                <div className="grid">
                  <div className="col-6">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="compactView" 
                        checked={settings.compactView}
                        onChange={(e) => {
                          handleSettingChange('compactView', e.target.checked);
                          // Visual feedback
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="compactView">Compact View</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="showPatientPhotos" 
                        checked={settings.showPatientPhotos}
                        onChange={(e) => {
                          handleSettingChange('showPatientPhotos', e.target.checked);
                          // Visual feedback
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="showPatientPhotos">Show Patient Photos</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          
          <TabPanel header="Security" leftIcon="pi pi-shield mr-2">
            <div className="grid">
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Session Timeout (minutes)</label>
                <div className="flex flex-column gap-2">
                  <div className="p-inputgroup">
                    <InputText
                      type="number"
                      min="5"
                      max="480"
                      value={settings.sessionTimeout.toString()}
                      onChange={(e) => {
                        const value = Math.max(5, Math.min(480, parseInt(e.target.value) || 30));
                        handleSettingChange('sessionTimeout', value);
                        // Show real-time validation feedback
                        const input = e.target;
                        if (value < 15) {
                          input.style.borderColor = '#FF9800';
                          input.title = 'Very short - may interrupt work';
                        } else if (value > 120) {
                          input.style.borderColor = '#FF5722';
                          input.title = 'Long timeout - security risk';
                        } else {
                          input.style.borderColor = '#4CAF50';
                          input.title = 'Balanced security and usability';
                        }
                        setTimeout(() => {
                          input.style.borderColor = '';
                        }, 2000);
                      }}
                      className="w-full"
                      placeholder="5-480 minutes"
                    />
                    <span className="p-inputgroup-addon">
                      <i className={`pi ${settings.sessionTimeout < 15 ? 'pi-exclamation-triangle text-orange-500' : settings.sessionTimeout > 120 ? 'pi-shield text-red-500' : 'pi-check text-green-500'}`}></i>
                    </span>
                  </div>
                  <div className="text-xs text-600">
                    {settings.sessionTimeout < 15 ? '⚠️ Very short - may interrupt workflow' : 
                     settings.sessionTimeout > 120 ? '🔒 Long timeout - consider security implications' : 
                     '✅ Balanced timeout for security and productivity'}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="grid">
                  <div className="col-6">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="requirePasswordChange" 
                        checked={settings.requirePasswordChange}
                        onChange={(e) => {
                          handleSettingChange('requirePasswordChange', e.target.checked);
                          // Visual feedback
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="requirePasswordChange">Require Password Change</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="field-checkbox">
                      <input 
                        type="checkbox" 
                        id="twoFactorAuth" 
                        checked={settings.twoFactorAuth}
                        onChange={(e) => {
                          handleSettingChange('twoFactorAuth', e.target.checked);
                          // Visual feedback
                          const checkbox = e.target;
                          checkbox.style.transform = 'scale(1.1)';
                          setTimeout(() => {
                            checkbox.style.transform = 'scale(1)';
                          }, 200);
                        }}
                      />
                      <label htmlFor="twoFactorAuth">Two-Factor Authentication</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="flex gap-2">
                  <Button 
                    label="Change Password" 
                    icon="pi pi-key" 
                    outlined
                    onClick={() => setPasswordDialog(true)}
                  />
                  <Button 
                    label="Setup 2FA" 
                    icon="pi pi-shield" 
                    className="p-button-info"
                    outlined
                    onClick={() => setTwoFactorDialog(true)}
                    disabled={settings.twoFactorAuth}
                  />
                  <Button 
                    label="Logout All Devices" 
                    icon="pi pi-sign-out" 
                    className="p-button-danger"
                    outlined
                    onClick={() => setLogoutDialog(true)}
                  />
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
        
        <div className="flex justify-content-between align-items-center mt-4 pt-3 border-top-1 surface-border">
          <div className="flex gap-2">
            <Button 
              label="Reset to Default" 
              icon="pi pi-refresh" 
              className="p-button-secondary"
              outlined
              onClick={() => {
                const defaultSettings = {
                  language: 'en',
                  theme: 'light',
                  autoRefresh: true,
                  refreshInterval: 30,
                  soundNotifications: true,
                  queueAutoAdvance: true,
                  maxWaitTime: 60,
                  emergencyPriority: true,
                  queueDisplayCount: 5,
                  voiceEnabled: true,
                  voiceLanguage: 'en-US',
                  voiceConfidenceThreshold: 0.7,
                  defaultPaymentMethod: 'cash',
                  requirePaymentConfirmation: true,
                  autoGenerateReceipts: true,
                  emailNotifications: true,
                  smsNotifications: false,
                  pushNotifications: true,
                  compactView: false,
                  showPatientPhotos: true,
                  dateFormat: 'DD/MM/YYYY',
                  timeFormat: '24h',
                  sessionTimeout: 30,
                  requirePasswordChange: false,
                  twoFactorAuth: false
                };
                
                setSettings(defaultSettings);
                applySettings(defaultSettings);
                localStorage.setItem('staffSettings', JSON.stringify(defaultSettings));
                
                toast.current?.show({
                  severity: 'success',
                  summary: 'Settings Reset',
                  detail: 'All settings have been reset to default values',
                  life: 3000
                });
              }}
            />
            <Button 
              label="Export Settings" 
              icon="pi pi-download" 
              outlined
              onClick={() => {
                const settingsBlob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(settingsBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'staff-settings.json';
                link.click();
                URL.revokeObjectURL(url);
                
                toast.current?.show({
                  severity: 'success',
                  summary: 'Settings Exported',
                  detail: 'Settings exported successfully',
                  life: 3000
                });
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              label={t('cancel')} 
              outlined 
              onClick={() => setSettingsDialog(false)}
            />
            <Button 
              label={t('saveSettings')} 
              icon="pi pi-check"
              onClick={() => {
                try {
                  // Validate settings before saving
                  if (settings.refreshInterval < 5 || settings.refreshInterval > 300) {
                    throw new Error('Refresh interval must be between 5-300 seconds');
                  }
                  if (settings.maxWaitTime < 10 || settings.maxWaitTime > 180) {
                    throw new Error('Max wait time must be between 10-180 minutes');
                  }
                  if (settings.sessionTimeout < 5 || settings.sessionTimeout > 480) {
                    throw new Error('Session timeout must be between 5-480 minutes');
                  }
                  
                  // Create backup of current settings
                  const currentSettings = localStorage.getItem('staffSettings');
                  if (currentSettings) {
                    localStorage.setItem('staffSettingsBackup', currentSettings);
                  }
                  
                  // Save new settings
                  localStorage.setItem('staffSettings', JSON.stringify(settings));
                  applySettings(settings);
                  
                  // Show success message with details
                  toast.current?.show({
                    severity: 'success',
                    summary: 'Settings Saved Successfully',
                    detail: `${Object.keys(settings).length} settings saved and applied`,
                    life: 4000
                  });
                  
                  setSettingsDialog(false);
                  
                  // Apply language changes immediately
                  if (settings.language !== language) {
                    setLanguage(settings.language as 'en' | 'te' | 'hi');
                    setTimeout(() => {
                      toast.current?.show({
                        severity: 'success',
                        summary: 'Language Applied',
                        detail: 'Language has been changed successfully',
                        life: 3000
                      });
                    }, 500);
                  }
                  
                } catch (error) {
                  toast.current?.show({
                    severity: 'error',
                    summary: 'Save Failed',
                    detail: error instanceof Error ? error.message : 'Failed to save settings',
                    life: 5000
                  });
                }
              }}
            />
          </div>
        </div>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog
        header="Change Password"
        visible={passwordDialog}
        style={{ width: '450px' }}
        onHide={() => {
          setPasswordDialog(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }}
      >
        <div className="flex flex-column gap-3">
          <div>
            <label htmlFor="currentPassword" className="block mb-2 font-medium">Current Password *</label>
            <Password
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full"
              placeholder="Enter current password"
              toggleMask
              feedback={false}
            />
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block mb-2 font-medium">New Password *</label>
            <Password
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full"
              placeholder="Enter new password"
              toggleMask
              promptLabel="Choose a password"
              weakLabel="Too simple"
              mediumLabel="Average complexity"
              strongLabel="Complex password"
            />
            <small className="text-600">
              Password must be at least 8 characters with uppercase, lowercase, number and special character
            </small>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block mb-2 font-medium">Confirm New Password *</label>
            <Password
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full"
              placeholder="Confirm new password"
              toggleMask
              feedback={false}
            />
            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <small className="text-red-500">Passwords do not match</small>
            )}
          </div>
          
          <div className="p-3 border-round surface-100">
            <h4 className="mt-0 mb-2">Password Requirements:</h4>
            <ul className="list-none p-0 m-0">
              <li className={`flex align-items-center gap-2 mb-1 ${passwordData.newPassword.length >= 6 ? 'text-green-600' : 'text-600'}`}>
                <i className={`pi ${passwordData.newPassword.length >= 6 ? 'pi-check' : 'pi-circle'}`}></i>
                At least 6 characters
              </li>
              <li className={`flex align-items-center gap-2 mb-1 ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-600'}`}>
                <i className={`pi ${/[A-Z]/.test(passwordData.newPassword) ? 'pi-check' : 'pi-circle'}`}></i>
                One uppercase letter
              </li>
              <li className={`flex align-items-center gap-2 mb-1 ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-600'}`}>
                <i className={`pi ${/[a-z]/.test(passwordData.newPassword) ? 'pi-check' : 'pi-circle'}`}></i>
                One lowercase letter
              </li>
              <li className={`flex align-items-center gap-2 mb-1 ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-600'}`}>
                <i className={`pi ${/[0-9]/.test(passwordData.newPassword) ? 'pi-check' : 'pi-circle'}`}></i>
                One number
              </li>
              <li className={`flex align-items-center gap-2 ${/[!@#$%^&*]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-600'}`}>
                <i className={`pi ${/[!@#$%^&*]/.test(passwordData.newPassword) ? 'pi-check' : 'pi-circle'}`}></i>
                One special character (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancel" 
            outlined 
            onClick={() => {
              setPasswordDialog(false);
              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }}
          />
          <Button 
            label="Change Password" 
            icon="pi pi-key"
            onClick={handlePasswordChange}
            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || passwordData.newPassword !== passwordData.confirmPassword}
          />
        </div>
      </Dialog>

      {/* Two-Factor Authentication Setup Dialog */}
      <Dialog
        header="Setup Two-Factor Authentication"
        visible={twoFactorDialog}
        style={{ width: '600px' }}
        onHide={() => {
          setTwoFactorDialog(false);
          setTwoFactorData({ phone: '', email: '', method: 'sms', verificationCode: '', qrCode: '', backupCodes: [] });
        }}
      >
        {!twoFactorData.qrCode ? (
          <div className="flex flex-column gap-3">
            <div className="p-3 border-round bg-blue-50 border-blue-200">
              <h4 className="mt-0 mb-2 text-blue-900">🔒 Enhanced Security</h4>
              <p className="m-0 text-blue-800">
                Two-factor authentication adds an extra layer of security to your account by requiring a second form of verification.
              </p>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Verification Method</label>
              <div className="grid">
                <div className="col-6">
                  <div className="field-radiobutton">
                    <input 
                      type="radio" 
                      id="sms" 
                      name="method" 
                      value="sms" 
                      checked={twoFactorData.method === 'sms'}
                      onChange={(e) => setTwoFactorData({ ...twoFactorData, method: e.target.value })}
                    />
                    <label htmlFor="sms">SMS Verification</label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="field-radiobutton">
                    <input 
                      type="radio" 
                      id="email" 
                      name="method" 
                      value="email" 
                      checked={twoFactorData.method === 'email'}
                      onChange={(e) => setTwoFactorData({ ...twoFactorData, method: e.target.value })}
                    />
                    <label htmlFor="email">Email Verification</label>
                  </div>
                </div>
              </div>
            </div>
            
            {twoFactorData.method === 'sms' && (
              <div>
                <label htmlFor="phone" className="block mb-2 font-medium">Phone Number *</label>
                <InputText
                  id="phone"
                  value={twoFactorData.phone}
                  onChange={(e) => setTwoFactorData({ ...twoFactorData, phone: e.target.value })}
                  className="w-full"
                  placeholder="+91 XXXXXXXXXX"
                />
                <small className="text-600">We'll send verification codes to this number</small>
              </div>
            )}
            
            {twoFactorData.method === 'email' && (
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">Email Address *</label>
                <InputText
                  id="email"
                  type="email"
                  value={twoFactorData.email}
                  onChange={(e) => setTwoFactorData({ ...twoFactorData, email: e.target.value })}
                  className="w-full"
                  placeholder="your.email@example.com"
                />
                <small className="text-600">We'll send verification codes to this email</small>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-column gap-3">
            <div className="text-center">
              <h4>Scan QR Code</h4>
              <p className="text-600 mb-3">Use your authenticator app to scan this QR code</p>
              <div className="inline-block p-3 border-round surface-100">
                <img src={twoFactorData.qrCode} alt="QR Code" className="w-10rem h-10rem" />
              </div>
            </div>
            
            <div>
              <label htmlFor="verificationCode" className="block mb-2 font-medium">Verification Code *</label>
              <InputText
                id="verificationCode"
                value={twoFactorData.verificationCode}
                onChange={(e) => setTwoFactorData({ ...twoFactorData, verificationCode: e.target.value })}
                className="w-full"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <small className="text-600">Enter the 6-digit code from your authenticator app</small>
            </div>
            
            <div className="p-3 border-round bg-yellow-50 border-yellow-200">
              <h4 className="mt-0 mb-2 text-yellow-900">🔑 Backup Codes</h4>
              <p className="text-yellow-800 mb-2">Save these backup codes in a safe place:</p>
              <div className="grid">
                {twoFactorData.backupCodes.map((code, index) => (
                  <div key={index} className="col-6">
                    <code className="bg-white p-1 border-round text-sm">{code}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancel" 
            outlined 
            onClick={() => {
              setTwoFactorDialog(false);
              setTwoFactorData({ phone: '', email: '', method: 'sms', verificationCode: '', qrCode: '', backupCodes: [] });
            }}
          />
          {!twoFactorData.qrCode ? (
            <Button 
              label="Setup 2FA" 
              icon="pi pi-shield"
              onClick={handleTwoFactorSetup}
              disabled={(twoFactorData.method === 'sms' && !twoFactorData.phone) || (twoFactorData.method === 'email' && !twoFactorData.email)}
            />
          ) : (
            <Button 
              label="Verify & Enable" 
              icon="pi pi-check"
              onClick={handleTwoFactorVerify}
              disabled={!twoFactorData.verificationCode || twoFactorData.verificationCode.length !== 6}
            />
          )}
        </div>
      </Dialog>

      {/* Logout All Devices Confirmation Dialog */}
      <Dialog
        header="Logout All Devices"
        visible={logoutDialog}
        style={{ width: '450px' }}
        onHide={() => setLogoutDialog(false)}
      >
        <div className="flex flex-column gap-3">
          <div className="text-center">
            <i className="pi pi-exclamation-triangle text-6xl text-orange-500 mb-3"></i>
            <h3 className="mt-0 mb-2">Are you sure?</h3>
            <p className="text-600 mb-3">
              This action will log out your account from all devices and browsers. You will need to log in again on each device.
            </p>
          </div>
          
          <div className="p-3 border-round bg-orange-50 border-orange-200">
            <h4 className="mt-0 mb-2 text-orange-900">⚠️ What happens next:</h4>
            <ul className="text-orange-800 pl-3">
              <li>All active sessions will be terminated</li>
              <li>You'll be logged out from mobile apps</li>
              <li>Other browsers will require re-login</li>
              <li>This action cannot be undone</li>
            </ul>
          </div>
          
          <div className="p-3 border-round bg-blue-50 border-blue-200">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-info-circle text-blue-600"></i>
              <span className="text-blue-800 font-medium">Current session will also be terminated</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancel" 
            outlined 
            onClick={() => setLogoutDialog(false)}
          />
          <Button 
            label="Logout All Devices" 
            icon="pi pi-sign-out"
            className="p-button-danger"
            onClick={handleLogoutAllDevices}
          />
        </div>
      </Dialog>

      {/* Patient Details Dialog */}
      <Dialog
        header="Patient Details"
        visible={patientDetailsDialog}
        style={{ width: '700px' }}
        onHide={() => {
          setPatientDetailsDialog(false);
          setSelectedPatient(null);
        }}
        maximizable
      >
        {selectedPatient && (
          <div className="grid">
            <div className="col-12 md:col-4">
              <div className="text-center mb-4">
                <Avatar 
                  label={selectedPatient.patientName.charAt(0)} 
                  size="xlarge" 
                  className="mb-3" 
                  style={{ backgroundColor: '#2196F3', color: 'white' }}
                />
                <h3 className="m-0">{selectedPatient.patientName}</h3>
                <p className="text-600 m-0">{selectedPatient.phone}</p>
                <Tag 
                  value={selectedPatient.priority} 
                  severity={getPriorityColor(selectedPatient.priority)} 
                  className="mt-2"
                />
              </div>
              
              <div className="grid">
                <div className="col-6">
                  <div className="text-center p-2 border-round surface-100">
                    <div className="text-2xl font-bold text-blue-600">{selectedPatient.queuePosition}</div>
                    <div className="text-sm text-600">Queue Position</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-2 border-round surface-100">
                    <div className="text-2xl font-bold text-green-600">{selectedPatient.estimatedDuration}m</div>
                    <div className="text-sm text-600">Est. Duration</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-12 md:col-8">
              <div className="grid">
                <div className="col-12 md:col-6">
                  <label className="block mb-2 font-medium text-900">Doctor</label>
                  <div className="p-3 border-round surface-100">
                    <div className="font-medium">{selectedPatient.doctorName}</div>
                    <div className="text-sm text-600">{selectedPatient.department}</div>
                  </div>
                </div>
                <div className="col-12 md:col-6">
                  <label className="block mb-2 font-medium text-900">Appointment Time</label>
                  <div className="p-3 border-round surface-100">
                    <div className="font-medium">{selectedPatient.time}</div>
                    <div className="text-sm text-600">Today</div>
                  </div>
                </div>
                <div className="col-12 md:col-6">
                  <label className="block mb-2 font-medium text-900">Status</label>
                  <div className="p-3 border-round surface-100">
                    <Tag value={selectedPatient.status} severity={getSeverity(selectedPatient.status)} />
                  </div>
                </div>
                <div className="col-12 md:col-6">
                  <label className="block mb-2 font-medium text-900">Payment</label>
                  <div className="p-3 border-round surface-100">
                    <Tag 
                      value={selectedPatient.paymentStatus} 
                      severity={selectedPatient.paymentStatus === 'paid' ? 'success' : 'danger'} 
                    />
                  </div>
                </div>
                <div className="col-12">
                  <label className="block mb-2 font-medium text-900">Symptoms</label>
                  <div className="p-3 border-round surface-100">
                    <p className="m-0">{selectedPatient.symptoms}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  label="Call Patient" 
                  icon="pi pi-phone" 
                  onClick={() => {
                    setPatientDetailsDialog(false);
                    callPatient(selectedPatient);
                  }}
                />
                <Button 
                  label="Move to Consultation" 
                  icon="pi pi-arrow-right" 
                  className="p-button-info"
                  onClick={() => {
                    movePatientIn(selectedPatient.id);
                    setPatientDetailsDialog(false);
                  }}
                  disabled={selectedPatient.status !== 'confirmed'}
                />
                <Button 
                  label="Add Revisit" 
                  icon="pi pi-calendar-plus" 
                  outlined
                  onClick={() => {
                    setPatientDetailsDialog(false);
                    addRevisitAppointment(selectedPatient);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Call Patient Dialog */}
      <Dialog
        header="Call Patient"
        visible={callPatientDialog}
        style={{ width: '450px' }}
        onHide={() => {
          setCallPatientDialog(false);
          setSelectedPatient(null);
        }}
      >
        {selectedPatient && (
          <div className="flex flex-column gap-3">
            <div className="text-center">
              <i className="pi pi-phone text-6xl text-blue-500 mb-3"></i>
              <h3 className="mt-0 mb-2">Call {selectedPatient.patientName}?</h3>
              <p className="text-600 mb-3">
                This will initiate a call to {selectedPatient.phone}
              </p>
            </div>
            
            <div className="p-3 border-round bg-blue-50 border-blue-200">
              <h4 className="mt-0 mb-2 text-blue-900">📞 Call Options:</h4>
              <div className="grid">
                <div className="col-6">
                  <Button 
                    label="Voice Call" 
                    icon="pi pi-phone" 
                    className="w-full p-button-info"
                    onClick={handleCallPatient}
                  />
                </div>
                <div className="col-6">
                  <Button 
                    label="Send SMS" 
                    icon="pi pi-send" 
                    className="w-full p-button-success"
                    outlined
                    onClick={() => {
                      toast.current?.show({
                        severity: 'success',
                        summary: 'SMS Sent',
                        detail: `Notification sent to ${selectedPatient.patientName}`,
                        life: 3000
                      });
                      setCallPatientDialog(false);
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-3 border-round surface-100">
              <div className="flex justify-content-between mb-2">
                <span className="font-medium">Patient:</span>
                <span>{selectedPatient.patientName}</span>
              </div>
              <div className="flex justify-content-between mb-2">
                <span className="font-medium">Phone:</span>
                <span>{selectedPatient.phone}</span>
              </div>
              <div className="flex justify-content-between mb-2">
                <span className="font-medium">Doctor:</span>
                <span>{selectedPatient.doctorName}</span>
              </div>
              <div className="flex justify-content-between">
                <span className="font-medium">Time:</span>
                <span>{selectedPatient.time}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancel" 
            outlined 
            onClick={() => setCallPatientDialog(false)}
          />
        </div>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog
        header="Record Payment"
        visible={recordPaymentDialog}
        style={{ width: '600px' }}
        onHide={() => {
          setRecordPaymentDialog(false);
          setPaymentData({
            patientName: '',
            phone: '',
            amount: '',
            paymentMethod: 'cash',
            description: '',
            receiptNumber: ''
          });
        }}
        className="p-fluid"
      >
        <div className="grid">
          <div className="col-12 md:col-6">
            <label htmlFor="patientName" className="block mb-2 font-medium">Patient Name *</label>
            <InputText
              id="patientName"
              value={paymentData.patientName}
              onChange={(e) => setPaymentData({ ...paymentData, patientName: e.target.value })}
              placeholder="Enter patient name"
              required
            />
          </div>
          <div className="col-12 md:col-6">
            <label htmlFor="phone" className="block mb-2 font-medium">Phone Number</label>
            <InputText
              id="phone"
              value={paymentData.phone}
              onChange={(e) => setPaymentData({ ...paymentData, phone: e.target.value })}
              placeholder="+91 XXXXXXXXXX"
            />
          </div>
          <div className="col-12 md:col-6">
            <label htmlFor="amount" className="block mb-2 font-medium">Amount *</label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">₹</span>
              <InputText
                id="amount"
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <label htmlFor="paymentMethod" className="block mb-2 font-medium">Payment Method *</label>
            <Dropdown
              id="paymentMethod"
              value={paymentData.paymentMethod}
              options={[
                { label: 'Cash', value: 'cash', icon: 'pi pi-money-bill' },
                { label: 'UPI', value: 'upi', icon: 'pi pi-mobile' },
                { label: 'Card', value: 'card', icon: 'pi pi-credit-card' },
                { label: 'Net Banking', value: 'netbanking', icon: 'pi pi-globe' },
                { label: 'Cheque', value: 'cheque', icon: 'pi pi-file' }
              ]}
              onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.value })}
              optionLabel="label"
            />
          </div>
          <div className="col-12">
            <label htmlFor="description" className="block mb-2 font-medium">Description</label>
            <InputTextarea
              id="description"
              value={paymentData.description}
              onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
              placeholder="Consultation fee, medicine, tests, etc."
              rows={2}
            />
          </div>
          <div className="col-12 md:col-6">
            <label htmlFor="receiptNumber" className="block mb-2 font-medium">Receipt Number</label>
            <InputText
              id="receiptNumber"
              value={paymentData.receiptNumber || `RCP-${Date.now().toString().slice(-6)}`}
              onChange={(e) => setPaymentData({ ...paymentData, receiptNumber: e.target.value })}
              placeholder="Auto-generated"
            />
          </div>
        </div>
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancel" 
            icon="pi pi-times"
            outlined 
            onClick={() => setRecordPaymentDialog(false)}
          />
          <Button 
            label="Record Payment" 
            icon="pi pi-check"
            onClick={() => {
              if (!paymentData.patientName || !paymentData.amount) {
                toast.current?.show({
                  severity: 'error',
                  summary: 'Validation Error',
                  detail: 'Please fill required fields',
                  life: 3000
                });
                return;
              }
              
              try {
                // Create transaction record
                const transaction = {
                  id: Date.now().toString(),
                  timestamp: new Date().toISOString(),
                  patientName: paymentData.patientName,
                  phone: paymentData.phone,
                  amount: parseFloat(paymentData.amount),
                  paymentMethod: paymentData.paymentMethod,
                  description: paymentData.description,
                  receiptNumber: paymentData.receiptNumber || `RCP-${Date.now().toString().slice(-6)}`,
                  staff: user?.name || 'Staff',
                  date: new Date().toLocaleDateString(),
                  time: new Date().toLocaleTimeString()
                };
                
                // Add to transaction history
                setTransactionHistory(prev => {
                  const newHistory = [transaction, ...prev];
                  localStorage.setItem('transactionHistory', JSON.stringify(newHistory));
                  return newHistory;
                });
                
                // Update drawer stats
                if (paymentData.paymentMethod === 'cash') {
                  setStats(prev => ({
                    ...prev,
                    totalCash: prev.totalCash + parseFloat(paymentData.amount)
                  }));
                } else {
                  setStats(prev => ({
                    ...prev,
                    totalOnline: prev.totalOnline + parseFloat(paymentData.amount)
                  }));
                }
                
                // Show success message
                toast.current?.show({
                  severity: 'success',
                  summary: 'Payment Recorded',
                  detail: `₹${paymentData.amount} ${paymentData.paymentMethod} payment recorded for ${paymentData.patientName}`,
                  life: 4000
                });
                
                // Reset form data
                setPaymentData({
                  patientName: '',
                  phone: '',
                  amount: '',
                  paymentMethod: 'cash',
                  description: '',
                  receiptNumber: ''
                });
                
                // Close dialog
                setRecordPaymentDialog(false);
                
              } catch (error) {
                console.error('Error recording payment:', error);
                toast.current?.show({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to record payment. Please try again.',
                  life: 3000
                });
              }
            }}
            disabled={!paymentData.patientName || !paymentData.amount}
          />
        </div>
      </Dialog>

      {/* Drawer Count Dialog */}
      <Dialog
        header="Physical Drawer Count"
        visible={drawerCountDialog}
        style={{ width: '800px' }}
        onHide={() => {
          setDrawerCountDialog(false);
          setDrawerCountData({
            expectedCash: 0,
            actualCash: '',
            notes: '',
            countedBy: user?.name || 'Staff',
            denominations: {
              '2000': 0, '500': 0, '200': 0, '100': 0, '50': 0,
              '20': 0, '10': 0, '5': 0, '2': 0, '1': 0
            }
          });
        }}
        maximizable
      >
        <div className="grid">
          <div className="col-12 lg:col-8">
            <Card title="Count by Denomination">
              <div className="grid">
                {Object.entries(drawerCountData.denominations).map(([denom, count]) => (
                  <div key={denom} className="col-6 md:col-4 lg:col-3">
                    <label className="block mb-2 font-medium">₹{denom} Notes</label>
                    <div className="p-inputgroup">
                      <InputText
                        type="number"
                        min="0"
                        value={count.toString()}
                        onChange={(e) => {
                          const newCount = parseInt(e.target.value) || 0;
                          setDrawerCountData(prev => ({
                            ...prev,
                            denominations: {
                              ...prev.denominations,
                              [denom]: newCount
                            }
                          }));
                        }}
                        className="text-center"
                      />
                      <span className="p-inputgroup-addon">
                        ₹{(parseInt(denom) * count).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 border-round bg-blue-50">
                <div className="flex justify-content-between align-items-center">
                  <span className="font-medium text-blue-900">Total Counted:</span>
                  <span className="text-2xl font-bold text-blue-900">
                    ₹{Object.entries(drawerCountData.denominations)
                      .reduce((total, [denom, count]) => total + (parseInt(denom) * count), 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="col-12 lg:col-4">
            <Card title="Count Summary">
              <div className="flex flex-column gap-3">
                <div className="p-3 border-round surface-100">
                  <div className="flex justify-content-between mb-2">
                    <span className="font-medium">Expected Cash:</span>
                    <span className="font-bold text-green-600">₹{drawerCountData.expectedCash.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-content-between mb-2">
                    <span className="font-medium">Actual Count:</span>
                    <span className="font-bold text-blue-600">
                      ₹{Object.entries(drawerCountData.denominations)
                        .reduce((total, [denom, count]) => total + (parseInt(denom) * count), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-content-between">
                    <span className="font-medium">Difference:</span>
                    <span className={`font-bold ${
                      Object.entries(drawerCountData.denominations)
                        .reduce((total, [denom, count]) => total + (parseInt(denom) * count), 0) - drawerCountData.expectedCash === 0
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ₹{(Object.entries(drawerCountData.denominations)
                        .reduce((total, [denom, count]) => total + (parseInt(denom) * count), 0) - drawerCountData.expectedCash)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Counted By</label>
                  <InputText
                    value={drawerCountData.countedBy}
                    onChange={(e) => setDrawerCountData({ ...drawerCountData, countedBy: e.target.value })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Notes</label>
                  <InputTextarea
                    value={drawerCountData.notes}
                    onChange={(e) => setDrawerCountData({ ...drawerCountData, notes: e.target.value })}
                    placeholder="Any discrepancies or notes..."
                    rows={3}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancel" 
            outlined 
            onClick={() => setDrawerCountDialog(false)}
          />
          <Button 
            label="Save Count" 
            icon="pi pi-save"
            onClick={() => {
              const totalCounted = Object.entries(drawerCountData.denominations)
                .reduce((total, [denom, count]) => total + (parseInt(denom) * count), 0);
              const difference = totalCounted - drawerCountData.expectedCash;
              
              toast.current?.show({
                severity: difference === 0 ? 'success' : 'warn',
                summary: 'Drawer Count Saved',
                detail: difference === 0 
                  ? 'Cash count matches expected amount' 
                  : `Difference of ₹${Math.abs(difference)} ${difference > 0 ? 'excess' : 'shortage'} found`,
                life: 4000
              });
              
              setDrawerCountDialog(false);
            }}
          />
        </div>
      </Dialog>

      {/* Reconcile Dialog */}
      <Dialog
        header="End-of-Day Reconciliation"
        visible={reconcileDialog}
        style={{ width: '700px' }}
        onHide={() => {
          setReconcileDialog(false);
          setReconcileData({
            systemTotal: 0,
            physicalCount: 0,
            difference: 0,
            reconcileNotes: '',
            adjustmentReason: '',
            approvedBy: ''
          });
        }}
      >
        <div className="grid">
          <div className="col-12">
            <div className="p-3 border-round bg-orange-50 border-orange-200 mb-4">
              <h4 className="mt-0 mb-2 text-orange-900">📊 Daily Reconciliation</h4>
              <p className="m-0 text-orange-800">
                Compare system totals with physical cash count and online payments to ensure accuracy.
              </p>
            </div>
          </div>
          
          <div className="col-12 md:col-6">
            <Card title="System Totals" className="h-full">
              <div className="flex flex-column gap-3">
                <div className="flex justify-content-between p-2 border-round surface-100">
                  <span>Cash (System):</span>
                  <span className="font-bold text-green-600">₹{drawerStats.totalCash.toLocaleString()}</span>
                </div>
                <div className="flex justify-content-between p-2 border-round surface-100">
                  <span>Online Payments:</span>
                  <span className="font-bold text-blue-600">₹{drawerStats.totalOnline.toLocaleString()}</span>
                </div>
                <div className="flex justify-content-between p-2 border-round bg-green-100">
                  <span className="font-medium">Total (System):</span>
                  <span className="font-bold text-green-900">₹{(drawerStats.totalCash + drawerStats.totalOnline).toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="col-12 md:col-6">
            <Card title="Physical Count" className="h-full">
              <div className="flex flex-column gap-3">
                <div>
                  <label className="block mb-2 font-medium">Physical Cash Count *</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">₹</span>
                    <InputText
                      type="number"
                      value={reconcileData.physicalCount.toString()}
                      onChange={(e) => {
                        const physical = parseFloat(e.target.value) || 0;
                        setReconcileData(prev => ({
                          ...prev,
                          physicalCount: physical,
                          difference: physical + drawerStats.totalOnline - (drawerStats.totalCash + drawerStats.totalOnline)
                        }));
                      }}
                      placeholder="Enter actual cash count"
                    />
                  </div>
                </div>
                
                <div className="flex justify-content-between p-2 border-round surface-100">
                  <span>Online (Verified):</span>
                  <span className="font-bold text-blue-600">₹{drawerStats.totalOnline.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-content-between p-2 border-round bg-blue-100">
                  <span className="font-medium">Total (Actual):</span>
                  <span className="font-bold text-blue-900">
                    ₹{(reconcileData.physicalCount + drawerStats.totalOnline).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="col-12">
            <div className={`p-3 border-round ${
              Math.abs(reconcileData.physicalCount - drawerStats.totalCash) === 0
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex justify-content-between align-items-center">
                <span className="font-medium">Cash Difference:</span>
                <span className={`text-2xl font-bold ${
                  Math.abs(reconcileData.physicalCount - drawerStats.totalCash) === 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  ₹{Math.abs(reconcileData.physicalCount - drawerStats.totalCash).toLocaleString()}
                  {reconcileData.physicalCount - drawerStats.totalCash !== 0 && (
                    <span className="text-sm ml-2">
                      ({reconcileData.physicalCount > drawerStats.totalCash ? 'Excess' : 'Shortage'})
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          {Math.abs(reconcileData.physicalCount - drawerStats.totalCash) > 0 && (
            <>
              <div className="col-12">
                <label className="block mb-2 font-medium">Adjustment Reason *</label>
                <Dropdown
                  value={reconcileData.adjustmentReason}
                  options={[
                    { label: 'Counting Error', value: 'counting_error' },
                    { label: 'Unrecorded Transaction', value: 'unrecorded_transaction' },
                    { label: 'Change Given', value: 'change_given' },
                    { label: 'Petty Cash Usage', value: 'petty_cash' },
                    { label: 'Other', value: 'other' }
                  ]}
                  onChange={(e) => setReconcileData({ ...reconcileData, adjustmentReason: e.value })}
                  placeholder="Select reason for difference"
                  className="w-full"
                />
              </div>
              
              <div className="col-12">
                <label className="block mb-2 font-medium">Approved By *</label>
                <InputText
                  value={reconcileData.approvedBy}
                  onChange={(e) => setReconcileData({ ...reconcileData, approvedBy: e.target.value })}
                  placeholder="Manager/Supervisor name"
                  className="w-full"
                />
              </div>
            </>
          )}
          
          <div className="col-12">
            <label className="block mb-2 font-medium">Reconciliation Notes</label>
            <InputTextarea
              value={reconcileData.reconcileNotes}
              onChange={(e) => setReconcileData({ ...reconcileData, reconcileNotes: e.target.value })}
              placeholder="Any additional notes about the reconciliation..."
              rows={3}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancel" 
            outlined 
            onClick={() => setReconcileDialog(false)}
          />
          <Button 
            label="Complete Reconciliation" 
            icon="pi pi-check"
            className="p-button-success"
            onClick={() => {
              const difference = Math.abs(reconcileData.physicalCount - drawerStats.totalCash);
              
              if (difference > 0 && (!reconcileData.adjustmentReason || !reconcileData.approvedBy)) {
                toast.current?.show({
                  severity: 'error',
                  summary: 'Validation Error',
                  detail: 'Please provide adjustment reason and approval for discrepancies',
                  life: 3000
                });
                return;
              }
              
              // Generate reconciliation report
              const reconciliationReport = {
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString(),
                systemCash: drawerStats.totalCash,
                physicalCash: reconcileData.physicalCount,
                onlinePayments: drawerStats.totalOnline,
                difference: reconcileData.physicalCount - drawerStats.totalCash,
                adjustmentReason: reconcileData.adjustmentReason,
                approvedBy: reconcileData.approvedBy,
                notes: reconcileData.reconcileNotes,
                reconciledBy: user?.name || 'Staff'
              };
              
              // Save to localStorage
              const existingReconciliations = JSON.parse(localStorage.getItem('reconciliations') || '[]');
              existingReconciliations.push(reconciliationReport);
              localStorage.setItem('reconciliations', JSON.stringify(existingReconciliations));
              
              toast.current?.show({
                severity: 'success',
                summary: 'Reconciliation Complete',
                detail: difference === 0 
                  ? 'Perfect match! No discrepancies found.' 
                  : `Reconciliation completed with ₹${difference} ${reconcileData.physicalCount > drawerStats.totalCash ? 'excess' : 'shortage'}`,
                life: 5000
              });
              
              setReconcileDialog(false);
            }}
            disabled={reconcileData.physicalCount === 0}
          />
        </div>
      </Dialog>

      {/* Add Revisit Dialog */}
      <Dialog
        header="Schedule Revisit Appointment"
        visible={revisitDialog}
        style={{ width: '600px' }}
        onHide={() => {
          setRevisitDialog(false);
          setSelectedPatient(null);
        }}
      >
        {selectedPatient && (
          <div className="flex flex-column gap-3">
            <div className="p-3 border-round bg-green-50 border-green-200">
              <h4 className="mt-0 mb-2 text-green-900">👨‍⚕️ Follow-up Appointment</h4>
              <p className="m-0 text-green-800">
                Schedule a follow-up appointment for {selectedPatient.patientName} with {selectedPatient.doctorName}
              </p>
            </div>
            
            <div className="grid">
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Revisit Date</label>
                <Calendar 
                  value={new Date()}
                  className="w-full"
                  minDate={new Date()}
                  showIcon
                />
              </div>
              <div className="col-12 md:col-6">
                <label className="block mb-2 font-medium">Preferred Time</label>
                <Dropdown
                  value="10:00 AM"
                  options={[
                    { label: '9:00 AM', value: '9:00 AM' },
                    { label: '10:00 AM', value: '10:00 AM' },
                    { label: '11:00 AM', value: '11:00 AM' },
                    { label: '2:00 PM', value: '2:00 PM' },
                    { label: '3:00 PM', value: '3:00 PM' },
                    { label: '4:00 PM', value: '4:00 PM' }
                  ]}
                  className="w-full"
                />
              </div>
              <div className="col-12">
                <label className="block mb-2 font-medium">Doctor</label>
                <Dropdown
                  value={selectedPatient.doctorName}
                  options={doctors}
                  className="w-full"
                  disabled
                />
              </div>
              <div className="col-12">
                <label className="block mb-2 font-medium">Reason for Revisit</label>
                <InputTextarea
                  placeholder="Follow-up consultation, test results review, etc."
                  rows={3}
                  className="w-full"
                />
              </div>
              <div className="col-12">
                <label className="block mb-2 font-medium">Priority Level</label>
                <Dropdown
                  value="normal"
                  options={[
                    { label: 'Normal', value: 'normal' },
                    { label: 'High', value: 'high' },
                    { label: 'Urgent', value: 'urgent' }
                  ]}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="p-3 border-round surface-100">
              <div className="flex justify-content-between mb-2">
                <span className="font-medium">Patient:</span>
                <span>{selectedPatient.patientName}</span>
              </div>
              <div className="flex justify-content-between mb-2">
                <span className="font-medium">Phone:</span>
                <span>{selectedPatient.phone}</span>
              </div>
              <div className="flex justify-content-between">
                <span className="font-medium">Department:</span>
                <span>{selectedPatient.department}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancel" 
            outlined 
            onClick={() => setRevisitDialog(false)}
          />
          <Button 
            label="Schedule Revisit" 
            icon="pi pi-calendar-plus"
            onClick={handleRevisitSubmit}
          />
        </div>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog
        header="Notifications"
        visible={notificationsDialog}
        style={{ width: '500px' }}
        onHide={() => setNotificationsDialog(false)}
      >
        <div className="flex flex-column gap-3">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="p-3 border-round surface-100 border-left-3 border-blue-500">
                <div className="flex justify-content-between align-items-start mb-2">
                  <div className="flex align-items-center gap-2">
                    <i className={`pi ${notification.type === 'appointment' ? 'pi-calendar' : notification.type === 'payment' ? 'pi-money-bill' : 'pi-info-circle'} text-blue-500`}></i>
                    <span className="font-medium">{notification.title}</span>
                  </div>
                  <small className="text-500">{notification.time}</small>
                </div>
                <p className="m-0 text-600 text-sm">{notification.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center p-4">
              <i className="pi pi-bell-slash text-4xl text-400 mb-3"></i>
              <p className="text-600 m-0">No notifications</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Mark All Read" 
            icon="pi pi-check" 
            outlined
            onClick={() => {
              toast.current?.show({
                severity: 'success',
                summary: 'Notifications Cleared',
                detail: 'All notifications marked as read',
                life: 3000
              });
              setNotificationsDialog(false);
            }}
            disabled={notifications.length === 0}
          />
          <Button 
            label="Close" 
            onClick={() => setNotificationsDialog(false)}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default StaffDashboard;