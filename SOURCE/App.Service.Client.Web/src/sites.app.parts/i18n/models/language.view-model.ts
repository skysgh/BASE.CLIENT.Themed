/**
 * Language ViewModel
 * 
 * UI-ready language model with display properties.
 */
export interface LanguageViewModel {
  id: string;
  enabled: boolean;
  name: string;
  nativeName: string;
  languageCode: string;
  flagImageId: string;
  
  // Display helpers
  displayLabel: string;
  flagUrl: string;
}

/** Well-known language codes */
export const LANGUAGE_CODES = {
  EN: 'en',
  ES: 'es', 
  FR: 'fr',
  DE: 'de',
  ZH: 'zh',
  JA: 'ja',
  KO: 'ko',
  PT: 'pt',
  IT: 'it',
  RU: 'ru',
} as const;
