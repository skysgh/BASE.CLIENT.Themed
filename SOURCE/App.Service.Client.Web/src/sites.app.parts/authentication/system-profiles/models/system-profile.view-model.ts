/**
 * System Profile View Model
 */
export interface SystemProfileViewModel {
  id: string;
  userId: string;
  
  // Display
  theme: 'light' | 'dark' | 'system';
  languageCode: string;
  locale: string;
  timezone: string;
  
  // Accessibility
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  
  // Account
  defaultAccountId: string | null;
  lastAccessedAccountId: string | null;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  
  // Computed
  effectiveTheme: 'light' | 'dark';
  fontSizeClass: string;
}

/**
 * Resolve 'system' theme based on OS preference
 */
export function resolveSystemTheme(theme: 'light' | 'dark' | 'system'): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  
  // Check OS preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

/**
 * Get CSS class for font size
 */
export function getFontSizeClass(size: 'small' | 'medium' | 'large' | 'x-large'): string {
  const classes: Record<string, string> = {
    'small': 'fs-sm',
    'medium': 'fs-base',
    'large': 'fs-lg',
    'x-large': 'fs-xl'
  };
  return classes[size] || 'fs-base';
}
