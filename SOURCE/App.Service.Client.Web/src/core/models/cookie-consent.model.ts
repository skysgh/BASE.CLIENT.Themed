/**
 * Cookie Consent Models
 * 
 * GDPR-compliant cookie consent categories and preferences.
 * 
 * Standard Categories (per GDPR/ePrivacy):
 * - Necessary: Required for site function (cannot be disabled)
 * - Functional: Remember preferences, language settings
 * - Analytics: Track usage patterns, improve site
 * - Marketing: Personalized ads, cross-site tracking
 * 
 * See: https://gdpr.eu/cookies/
 */

/**
 * Cookie category types
 */
export type CookieCategory = 
  | 'necessary'    // Essential - cannot be disabled
  | 'functional'   // Preferences, language, accessibility
  | 'analytics'    // Usage tracking, performance metrics
  | 'marketing';   // Advertising, remarketing

/**
 * Configuration for a cookie category
 */
export interface CookieCategoryConfig {
  /** Category identifier */
  id: CookieCategory;
  
  /** Display name */
  name: string;
  
  /** i18n key for name */
  nameKey?: string;
  
  /** Description of what this category covers */
  description: string;
  
  /** i18n key for description */
  descriptionKey?: string;
  
  /** Whether user can toggle this category off */
  required: boolean;
  
  /** Default state (for optional categories) */
  defaultEnabled: boolean;
  
  /** Icon class */
  icon?: string;
  
  /** Examples of cookies in this category */
  examples?: string[];
}

/**
 * User's cookie consent preferences
 */
export interface CookieConsentPreferences {
  /** Whether consent has been given/recorded */
  consentGiven: boolean;
  
  /** Timestamp when consent was given */
  consentDate?: Date | string;
  
  /** Version of consent form shown */
  consentVersion?: string;
  
  /** Category preferences */
  categories: {
    necessary: boolean;    // Always true
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  };
}

/**
 * Cookie consent state for storage
 */
export interface CookieConsentState {
  /** Preferences */
  preferences: CookieConsentPreferences;
  
  /** Last updated timestamp */
  updatedAt: string;
  
  /** Expiry timestamp (typically 1 year) */
  expiresAt: string;
}

/**
 * Default category configurations
 */
export const DEFAULT_COOKIE_CATEGORIES: CookieCategoryConfig[] = [
  {
    id: 'necessary',
    name: 'Strictly Necessary',
    nameKey: 'COOKIES.CATEGORY.NECESSARY.NAME',
    description: 'Essential cookies required for the website to function. These cannot be disabled.',
    descriptionKey: 'COOKIES.CATEGORY.NECESSARY.DESCRIPTION',
    required: true,
    defaultEnabled: true,
    icon: 'ri-shield-check-line',
    examples: ['Session cookies', 'Authentication', 'Security tokens', 'Load balancing']
  },
  {
    id: 'functional',
    name: 'Functional',
    nameKey: 'COOKIES.CATEGORY.FUNCTIONAL.NAME',
    description: 'Enable enhanced functionality and personalization such as language preferences and accessibility settings.',
    descriptionKey: 'COOKIES.CATEGORY.FUNCTIONAL.DESCRIPTION',
    required: false,
    defaultEnabled: true,
    icon: 'ri-settings-3-line',
    examples: ['Language preference', 'Theme settings', 'Accessibility options', 'Recently viewed items']
  },
  {
    id: 'analytics',
    name: 'Analytics',
    nameKey: 'COOKIES.CATEGORY.ANALYTICS.NAME',
    description: 'Help us understand how visitors use our website to improve user experience.',
    descriptionKey: 'COOKIES.CATEGORY.ANALYTICS.DESCRIPTION',
    required: false,
    defaultEnabled: false,
    icon: 'ri-bar-chart-2-line',
    examples: ['Google Analytics', 'Page views', 'User behavior', 'Performance metrics']
  },
  {
    id: 'marketing',
    name: 'Marketing',
    nameKey: 'COOKIES.CATEGORY.MARKETING.NAME',
    description: 'Used to deliver relevant advertisements and track ad campaign effectiveness.',
    descriptionKey: 'COOKIES.CATEGORY.MARKETING.DESCRIPTION',
    required: false,
    defaultEnabled: false,
    icon: 'ri-advertisement-line',
    examples: ['Google Ads', 'Facebook Pixel', 'Remarketing', 'Cross-site tracking']
  }
];

/**
 * Default consent preferences (before user interaction)
 */
export const DEFAULT_CONSENT_PREFERENCES: CookieConsentPreferences = {
  consentGiven: false,
  categories: {
    necessary: true,      // Always enabled
    functional: false,    // Disabled until consent
    analytics: false,
    marketing: false
  }
};

/**
 * Create initial consent state
 */
export function createInitialConsentState(): CookieConsentState {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year expiry
  
  return {
    preferences: { ...DEFAULT_CONSENT_PREFERENCES },
    updatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  };
}

/**
 * Create "accept all" preferences
 */
export function createAcceptAllPreferences(): CookieConsentPreferences {
  return {
    consentGiven: true,
    consentDate: new Date().toISOString(),
    consentVersion: '1.0',
    categories: {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    }
  };
}

/**
 * Create "necessary only" preferences
 */
export function createNecessaryOnlyPreferences(): CookieConsentPreferences {
  return {
    consentGiven: true,
    consentDate: new Date().toISOString(),
    consentVersion: '1.0',
    categories: {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    }
  };
}
