/**
 * Auth Provider Configuration Model
 * 
 * Runtime-loaded configuration for authentication providers.
 * Loaded from /assets/config/auth-providers.json
 * 
 * This keeps provider configuration separate from compiled code,
 * allowing changes without rebuilding.
 */

/**
 * Provider category for grouping in UI
 */
export type ProviderCategory = 'enterprise' | 'social' | 'developer' | 'professional' | 'local';

/**
 * Authentication protocol type
 */
export type AuthProtocol = 'oidc' | 'oauth2' | 'saml' | 'local';

/**
 * Individual provider configuration
 */
export interface AuthProviderConfig {
  /** Unique identifier (e.g., 'microsoft', 'google', 'email') */
  id: string;
  
  /** Short name (e.g., 'Microsoft') */
  name: string;
  
  /** Button text (e.g., 'Continue with Microsoft') */
  displayName: string;
  
  /** Remix icon class (e.g., 'ri-microsoft-fill') */
  icon: string;
  
  /** Icon color for styling */
  iconColor: string;
  
  /** CSS class for the button */
  buttonClass: string;
  
  /** Whether this provider is enabled */
  enabled: boolean;
  
  /** Authentication protocol */
  protocol: AuthProtocol;
  
  /** Display order (lower = first) */
  order: number;
  
  /** Category for grouping */
  category: ProviderCategory;
  
  /** Help text / description */
  description: string;
}

/**
 * Auth settings configuration
 */
export interface AuthSettingsConfig {
  /** Allow username/password login */
  allowLocalLogin: boolean;
  
  /** Allow new user registration */
  allowSignup: boolean;
  
  /** Require email verification before login */
  requireEmailVerification: boolean;
  
  /** Default provider to pre-select (null = show all) */
  defaultProvider: string | null;
  
  /** Show "Remember me" checkbox */
  rememberMeEnabled: boolean;
  
  /** Days to remember login */
  rememberMeDays: number;
  
  /** Session timeout in minutes */
  sessionTimeoutMinutes: number;
  
  /** Max failed login attempts before lockout */
  maxLoginAttempts: number;
  
  /** Lockout duration in minutes */
  lockoutMinutes: number;
}

/**
 * Branding configuration for auth screens
 */
export interface AuthBrandingConfig {
  /** Logo URL (null = use default) */
  logoUrl: string | null;
  
  /** Primary brand color */
  primaryColor: string;
  
  /** Sign in page title */
  signInTitle: string;
  
  /** Sign in page subtitle */
  signInSubtitle: string;
  
  /** Sign up page title */
  signUpTitle: string;
  
  /** Sign up page subtitle */
  signUpSubtitle: string;
  
  /** Text for the "or" divider between providers */
  orDividerText: string;
}

/**
 * Complete auth providers configuration
 */
export interface AuthProvidersConfiguration {
  /** List of authentication providers */
  providers: AuthProviderConfig[];
  
  /** Authentication settings */
  settings: AuthSettingsConfig;
  
  /** Branding configuration */
  branding: AuthBrandingConfig;
}

/**
 * Default configuration (used if config file fails to load)
 */
export const DEFAULT_AUTH_CONFIG: AuthProvidersConfiguration = {
  providers: [
    {
      id: 'email',
      name: 'Email',
      displayName: 'Continue with Email',
      icon: 'ri-mail-fill',
      iconColor: '#6c757d',
      buttonClass: 'btn-outline-secondary',
      enabled: true,
      protocol: 'local',
      order: 100,
      category: 'local',
      description: 'Sign in with email and password'
    }
  ],
  settings: {
    allowLocalLogin: true,
    allowSignup: true,
    requireEmailVerification: false,
    defaultProvider: null,
    rememberMeEnabled: true,
    rememberMeDays: 30,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    lockoutMinutes: 15
  },
  branding: {
    logoUrl: null,
    primaryColor: '#0ab39c',
    signInTitle: 'Welcome Back!',
    signInSubtitle: 'Sign in to continue',
    signUpTitle: 'Create Account',
    signUpSubtitle: 'Get started with your free account',
    orDividerText: 'or'
  }
};
