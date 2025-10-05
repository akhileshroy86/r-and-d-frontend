'use client';

import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();

  const languageOptions = availableLanguages.map(lang => ({
    label: `${lang.nativeName} (${lang.name})`,
    value: lang.code,
    code: lang.code
  }));

  return (
    <Dropdown
      value={language}
      options={languageOptions}
      onChange={(e) => setLanguage(e.value)}
      placeholder="Select Language"
      className="w-full md:w-14rem"
      optionLabel="label"
    />
  );
};

export default LanguageSwitcher;