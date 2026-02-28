// i18n configuration
// This file provides language utilities and types

// Export language configuration
export const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' }
];

export type SupportedLanguage = 'en' | 'ar';

// Re-export from LanguageContext for convenience
// Note: Import useLanguage directly from @/contexts/LanguageContext in components
export { useLanguage, LanguageProvider } from '../contexts/LanguageContext';

// Default export for initialization
export default function initializeI18n() {
  // i18n is initialized through LanguageContext
  console.log('[i18n] Initialized via LanguageContext');
}
