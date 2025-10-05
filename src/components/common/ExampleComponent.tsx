'use client';

import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Example component showing how to use the global language context
 * This demonstrates how ANY component can access translations
 */
const ExampleComponent: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <Card title={t('dashboard')} className="m-3">
      <div className="flex flex-column gap-3">
        <p>Current language: {language}</p>
        
        <div className="flex gap-2">
          <Button label={t('save')} icon="pi pi-save" />
          <Button label={t('cancel')} icon="pi pi-times" outlined />
          <Button label={t('edit')} icon="pi pi-pencil" severity="info" />
          <Button label={t('delete')} icon="pi pi-trash" severity="danger" />
        </div>
        
        <div className="grid">
          <div className="col-12 md:col-6">
            <h4>{t('patients')}</h4>
            <p>{t('patientName')}: John Doe</p>
            <p>{t('patientPhone')}: +91 9876543210</p>
            <p>{t('symptoms')}: Fever, headache</p>
          </div>
          
          <div className="col-12 md:col-6">
            <h4>{t('appointments')}</h4>
            <p>{t('appointmentTime')}: 10:30 AM</p>
            <p>{t('appointmentStatus')}: {t('confirmed')}</p>
            <p>{t('paymentStatus')}: {t('paid')}</p>
          </div>
        </div>
        
        <div className="p-3 border-round surface-100">
          <h5>How to use translations in your component:</h5>
          <pre className="text-sm">
{`import { useLanguage } from '../../contexts/LanguageContext';

const YourComponent = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('staffDashboard')}</h1>
      <p>{t('welcomeBack')}</p>
      <Button label={t('save')} />
    </div>
  );
};`}
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default ExampleComponent;