/**
 * Multi-Account Configuration Types
 * 
 * Defines the structure for account-specific configuration.
 * Each account can override default settings for branding, context, and resources.
 * 
 * Architecture:
 * - Base configuration provides defaults (default.json)
 * - Account configuration overrides specific properties (accounts/{accountId}/config.json)
 * - Cascading merge: default → account
 * 
 * Usage:
 * Loaded at runtime via AccountService based on URL:
 * - URL: example.com/foo → loads /assets/accounts/foo/config.json
 * - URL: foo.example.com → loads /assets/accounts/foo/config.json
 * - URL: example.com → loads /assets/accounts/{defaultAccountId}/config.json
 */

export interface AccountConfig {
  /** Unique account identifier (e.g., 'foo', 'bar', 'ibm') */
  accountId: string;
  
  /** Account GUID (for database queries) */
  accountGuid?: string;
  
  /** Display name of the account organization */
  name: string;
  
  /** Display title (shown in header) */
  title?: string;
  
  /** Display subtitle (shown in header) */
  subtitle?: string;
  
  /** Branding configuration (logo, colors, theme) */
  branding: AccountBranding;
  
  /** Organizational context (sponsor, developer, distributor info) */
  context: AccountContext;
  
  /** Resource paths (images, files, i18n) */
  resources: AccountResources;
  
  /** Applet configuration with per-applet feature flags */
  applets?: AccountApplets;
  
  /** Global feature flags (UI toggles not specific to an applet) */
  features?: AccountFeatures;
  
  /** Internal flag: Was this account config found or is it a fallback? */
  _accountNotFound?: boolean;
}

export interface AccountBranding {
  /** Path to account logo (light theme) */
  logo: string;
  
  /** Path to account logo (dark theme) */
  logoDark?: string;
  
  /** Path to account small logo (collapsed sidebar) */
  logoSm?: string;
  
  /** Path to favicon */
  favicon?: string;
  
  /** Theme colors */
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
}

export interface AccountContext {
  /** Sponsor organization details */
  sponsor?: OrganizationInfo;
  
  /** Developer organization details */
  developer?: OrganizationInfo;
  
  /** Distributor organization details */
  distributor?: OrganizationInfo;
}

export interface OrganizationInfo {
  /** Organization title/name */
  title: string;
  
  /** Organization description */
  description?: string;
  
  /** Contact channels */
  channels?: {
    email?: string;
    tel?: string;
    postal?: {
      street: string;
      street2?: string;
      city: string;
      region: string;
      code: string;
      country: string;
    };
  };
}

export interface AccountResources {
  /** Base path for account-specific images */
  images?: {
    root?: string;
    trustedBy?: string;
    backgrounds?: string;
  };
  
  /** Base path for account-specific files */
  files?: {
    root?: string;
    documents?: string;
  };
  
  /** Path to account-specific i18n files */
  i18n?: {
    path: string;
  };
}

/**
 * Applet configuration with per-applet feature flags
 */
export interface AccountApplets {
  /** Default applet to show */
  default?: string;
  
  /** Per-applet configuration */
  [appletId: string]: AppletConfig | string | undefined;
}

/**
 * Individual applet configuration
 */
export interface AppletConfig {
  /** Is this applet enabled for this account? */
  enabled: boolean;
  
  /** Applet-specific feature flags */
  features?: {
    [featureName: string]: boolean;
  };
}

/**
 * Global feature flags (not applet-specific)
 */
export interface AccountFeatures {
  /** Enable analytics tracking */
  enableAnalytics?: boolean;
  
  /** Enable chat functionality */
  enableChat?: boolean;
  
  /** Enable notifications */
  enableNotifications?: boolean;
  
  /** Enable settings gear icon in topbar */
  enableSettingsIcon?: boolean;
  
  /** Enable/disable other global features */
  [featureName: string]: boolean | undefined;
}

/**
 * Default account configuration
 * Used as fallback when account-specific config is not found
 */
export const DEFAULT_ACCOUNT_CONFIG: Partial<AccountConfig> = {
  accountId: 'default',
  accountGuid: '00000000-0000-0000-0000-000000000001',
  name: 'Default Account',
  title: 'BASE Application',
  subtitle: 'Multi-Account Platform',
  branding: {
    logo: '/assets/core/media/open/accounts/default/logo-dark.png',
    logoDark: '/assets/core/media/open/accounts/default/logo-light.png',
    logoSm: '/assets/core/media/open/accounts/default/logo-sm.png',
    theme: {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d'
    }
  },
  resources: {
    images: {
      root: '/assets/core/media/open/accounts/default/',
      trustedBy: '/assets/core/media/open/accounts/default/trustedBy/',
      backgrounds: '/assets/core/media/open/accounts/default/backgrounds/'
    },
    files: {
      root: '/assets/core/media/open/accounts/default/files/'
    },
    i18n: {
      path: '/assets/data'
    }
  },
  applets: {
    default: 'spikes',
    settings: { enabled: true, features: { userSettings: true, accountSettings: true } }
  },
  features: {
    enableSettingsIcon: true,
    enableNotifications: true
  }
};

/**
 * Account URL patterns for detection
 */
export interface AccountUrlPattern {
  /** Pattern type: 'subdomain' or 'path' */
  type: 'subdomain' | 'path';
  
  /** Regex pattern to extract account ID */
  pattern: RegExp;
  
  /** Default account ID if no match */
  defaultAccountId: string;
}

/**
 * Default URL pattern configuration
 * Supports both:
 * - Path-based: example.com/foo
 * - Subdomain-based: foo.example.com
 */
export const DEFAULT_ACCOUNT_URL_PATTERNS: AccountUrlPattern[] = [
  {
    type: 'path',
    pattern: /^\/([^\/]+)/,  // Matches /foo, /bar, etc.
    defaultAccountId: 'default'
  },
  {
    type: 'subdomain',
    pattern: /^([^.]+)\./,   // Matches foo.example.com
    defaultAccountId: 'default'
  }
];
