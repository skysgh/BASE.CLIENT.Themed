/**
 * System Profile DTO
 * 
 * Cross-account user preferences (1:1 with User).
 * Settings that apply regardless of which account the user is in.
 * 
 * Key Design:
 * - Profile points TO User (not the other way around)
 * - One SystemProfile per User (uber profile)
 * - Contains system-wide preferences, not account-specific
 */
export interface SystemProfileDto {
  /** Unique identifier */
  id: string;
  
  /** Reference to User entity */
  userId: string;
  
  // ─────────────────────────────────────────────────────────────
  // Display Preferences
  // ─────────────────────────────────────────────────────────────
  
  /** UI theme: 'light', 'dark', 'system' */
  theme: 'light' | 'dark' | 'system';
  
  /** Preferred language code (e.g., 'en', 'es', 'fr') */
  languageCode: string;
  
  /** Preferred locale for date/number formatting (e.g., 'en-US') */
  locale: string;
  
  /** Timezone (e.g., 'America/New_York', 'Europe/London') */
  timezone: string;
  
  // ─────────────────────────────────────────────────────────────
  // Accessibility
  // ─────────────────────────────────────────────────────────────
  
  /** Reduce motion/animations */
  reduceMotion: boolean;
  
  /** High contrast mode */
  highContrast: boolean;
  
  /** Font size preference: 'small', 'medium', 'large', 'x-large' */
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  
  // ─────────────────────────────────────────────────────────────
  // Account Management
  // ─────────────────────────────────────────────────────────────
  
  /** Default account to load on login (null = last used or first available) */
  defaultAccountId: string | null;
  
  /** ID of the account last accessed (for "continue where you left off") */
  lastAccessedAccountId: string | null;
  
  // ─────────────────────────────────────────────────────────────
  // Notifications (System-wide)
  // ─────────────────────────────────────────────────────────────
  
  /** Receive email notifications */
  emailNotifications: boolean;
  
  /** Receive push notifications */
  pushNotifications: boolean;
  
  /** Marketing emails opt-in */
  marketingEmails: boolean;
  
  // ─────────────────────────────────────────────────────────────
  // Timestamps
  // ─────────────────────────────────────────────────────────────
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Update System Profile Request
 */
export interface UpdateSystemProfileDto {
  theme?: 'light' | 'dark' | 'system';
  languageCode?: string;
  locale?: string;
  timezone?: string;
  reduceMotion?: boolean;
  highContrast?: boolean;
  fontSize?: 'small' | 'medium' | 'large' | 'x-large';
  defaultAccountId?: string | null;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingEmails?: boolean;
}
