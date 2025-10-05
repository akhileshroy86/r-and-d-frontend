# Language Context System

This document explains how to use the global language system in the Healthcare Management System.

## Overview

The language system provides:
- Global language state management
- Automatic translation function
- Immediate language switching
- Persistent language settings
- Support for English, Telugu, and Hindi

## Setup

The `LanguageProvider` is already configured in `app/providers.tsx` and wraps the entire application.

## Usage in Components

### Basic Usage

```tsx
import { useLanguage } from '../../contexts/LanguageContext';

const YourComponent = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('staffDashboard')}</h1>
      <p>{t('welcomeBack')}</p>
      <Button label={t('save')} />
    </div>
  );
};
```

### Available Hook Properties

- `t(key)` - Translation function that returns translated text
- `language` - Current language code ('en', 'te', 'hi')
- `setLanguage(lang)` - Function to change language immediately
- `availableLanguages` - Array of available language options

### Language Switching

```tsx
// Change language immediately
setLanguage('te'); // Switch to Telugu
setLanguage('hi'); // Switch to Hindi
setLanguage('en'); // Switch to English
```

## Available Translation Keys

### Common Keys
- `staffDashboard`, `welcomeBack`, `today`
- `save`, `cancel`, `close`, `edit`, `delete`, `add`, `view`
- `search`, `filter`, `export`, `import`, `refresh`
- `loading`, `error`, `success`, `warning`, `info`

### Navigation Keys
- `home`, `dashboard`, `patients`, `doctors`, `staff`
- `reports`, `profile`, `logout`

### Patient Related Keys
- `patientName`, `patientPhone`, `patientEmail`, `patientAddress`
- `patientAge`, `patientGender`, `symptoms`, `diagnosis`
- `treatment`, `prescription`

### Appointment Related Keys
- `appointmentTime`, `appointmentDate`, `appointmentStatus`
- `bookAppointment`, `rescheduleAppointment`, `cancelAppointment`

### Payment Related Keys
- `paymentAmount`, `paymentMethod`, `paymentStatus`, `paymentDate`
- `recordPayment`

### Status Values
- `pending`, `confirmed`, `completed`, `cancelled`
- `inProgress`, `paid`, `unpaid`

## Adding New Translations

To add new translation keys, update the `translations` object in `LanguageContext.tsx`:

```tsx
const translations = {
  en: {
    // Add new English translations
    newKey: 'New Text',
  },
  te: {
    // Add new Telugu translations
    newKey: 'కొత్త వచనం',
  },
  hi: {
    // Add new Hindi translations
    newKey: 'नया पाठ',
  }
};
```

## Language Persistence

- Language settings are automatically saved to localStorage
- Settings persist across browser sessions
- Language is applied immediately when changed
- No page reload required

## Components Using Language System

### Current Components
- `StaffDashboard` - Full translation support
- `Navbar` - Navigation menu translations
- `LanguageSwitcher` - Reusable language selector

### Adding to New Components

1. Import the hook: `import { useLanguage } from '../../contexts/LanguageContext';`
2. Use the hook: `const { t } = useLanguage();`
3. Replace hardcoded text: `{t('translationKey')}`

## Best Practices

1. **Always use translation keys** instead of hardcoded text
2. **Use descriptive key names** that indicate the context
3. **Group related keys** logically (patient*, appointment*, etc.)
4. **Test all languages** when adding new features
5. **Provide fallbacks** - the system automatically falls back to English if a translation is missing

## Example Implementation

See `components/common/ExampleComponent.tsx` for a complete example of how to implement translations in a component.

## Language Codes

- `en` - English
- `te` - Telugu (తెలుగు)
- `hi` - Hindi (हिंदी)

## Future Enhancements

- Add more languages as needed
- Implement RTL support for Arabic/Hebrew
- Add date/number formatting per locale
- Implement pluralization rules
- Add translation validation tools