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
  
  /** Description and purpose of the application/service */
  description?: AccountDescription;
  
  /** Copyright information */
  copyrights?: AccountCopyrights;
  
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
  
  /** UI preferences (spacing, etc.) - cascades: service → account → user */
  preferences?: AccountPreferences;
  
  /** Internal flag: Was this account config found or is it a fallback? */
  _accountNotFound?: boolean;
}

export interface AccountDescription {
  /** Short description of the service */
  description?: string;
  
  /** Purpose statement */
  purpose?: string;
  
  /** Full title of the service */
  title?: string;
}

/**
 * Copyright information
 */
export interface AccountCopyrights {
  /** Copyright year or year range (e.g., '2024' or '2020-2024') */
  year?: string;
  
  /** Copyright holder name */
  holder?: string;
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
 * 
 * These flags control UI visibility across the application.
 * 
 * Configuration Cascade:
 * 1. System defaults (DEFAULT_ACCOUNT_CONFIG.features)
 * 2. Account config overrides (accounts/{accountId}.json → features)
 * 
 * Usage in components:
 * ```typescript
 * this.accountService.getConfigValue<boolean>('features.showSettingsIcon').subscribe(enabled => {
 *   this.showSettings = enabled ?? true; // fallback to default
 * });
 * ```
 */
export interface AccountFeatures {
  // ============================================
  // Analytics & Tracking
  // ============================================
  
  /** Enable analytics tracking */
  enableAnalytics?: boolean;
  
  // ============================================
  // Toolbar Icons (header bar)
  // ============================================
  
  /** 
   * Show settings gear icon in topbar
   * @default false - Settings accessible via User Menu
   */
  showSettingsIcon?: boolean;
  
  /**
   * Show theme switcher (dark/light mode) icon in topbar
   * @default true
   */
  showThemeSwitcher?: boolean;
  
  /**
   * Show fullscreen toggle icon in topbar
   * @default true
   */
  showFullscreenToggle?: boolean;
  
  /**
   * Show notifications icon in topbar
   * @default true
   */
  showNotifications?: boolean;
  
  /**
   * Show language selector in topbar
   * @default true
   */
  showLanguageSelector?: boolean;
  
  /**
   * Show shopping cart icon in topbar
   * @default false
   */
  showShoppingCart?: boolean;
  
  /**
   * Show trash/deleted items icon in topbar
   * @default false
   */
  showTrashIcon?: boolean;
  
  /**
   * Show help icon in topbar
   * @default true
   */
  showHelpIcon?: boolean;
  
  // ============================================
  // User Menu Items
  // ============================================
  
  /**
   * Show Finances/Wallet item in user menu
   * @default true
   */
  showUserMenuFinances?: boolean;
  
  /**
   * Show Messages item in user menu
   * @default true
   */
  showUserMenuMessages?: boolean;
  
  /**
   * Show Tasks item in user menu
   * @default true
   */
  showUserMenuTasks?: boolean;
  
  /**
   * Show Help/Support item in user menu
   * @default true
   */
  showUserMenuHelp?: boolean;
  
  // ============================================
  // Communication Features
  // ============================================
  
  /** Enable chat functionality */
  enableChat?: boolean;
  
  /** Enable notifications */
  enableNotifications?: boolean;
  
  // ============================================
  // Legacy/Deprecated (kept for backward compatibility)
  // ============================================
  
  /** @deprecated Use showSettingsIcon instead */
  enableSettingsIcon?: boolean;
  
  // ============================================
  // Allow additional custom flags
  // ============================================
  
  /** Enable/disable other global features */
  [featureName: string]: boolean | undefined;
}

/**
 * UI Preferences
 * 
 * Controls visual preferences like spacing, appearance, etc.
 * Cascades: service → account → user (user wins)
 * 
 * Structure is nested to avoid conflicts:
 * preferences.spacing
 * preferences.appearance.mode
 * preferences.appearance.layout
 */
export interface AccountPreferences {
  /**
   * UI spacing density
   * @default 'comfortable'
   */
  spacing?: 'compact' | 'comfortable' | 'spacious';
  
  /**
   * Appearance settings (theme, layout, colors)
   */
  appearance?: AppearancePreferences;
}

/**
 * Appearance Preferences
 * 
 * Controls theme mode, layout, sidebar, topbar colors
 * Mirrors the rightsidebar theme customizer options
 */
export interface AppearancePreferences {
  /**
   * Color mode
   * @default 'light'
   */
  mode?: 'light' | 'dark';
  
  /**
   * Primary theme color (hex)
   * Account-level: sets the brand color
   * User-level: personal preference (if not locked)
   * @default '#25a0e2' (cyan)
   */
  primaryColor?: string;
  
  /**
   * Layout style
   * @default 'vertical'
   */
  layout?: 'vertical' | 'horizontal' | 'twocolumn' | 'semibox';
  
  /**
   * Layout width
   * @default 'fluid'
   */
  layoutWidth?: 'fluid' | 'boxed';
  
  /**
   * Layout position (scrollable or fixed)
   * @default 'fixed'
   */
  layoutPosition?: 'fixed' | 'scrollable';
  
  /**
   * Topbar color
   * @default 'light'
   */
  topbarColor?: 'light' | 'dark';
  
  /**
   * Sidebar size
   * @default 'default'
   */
  sidebarSize?: 'default' | 'compact' | 'small-icon' | 'small-hover';
  
  /**
   * Sidebar view (for vertical layout)
   * @default 'default'
   */
  sidebarView?: 'default' | 'detached';
  
  /**
   * Sidebar color
   * @default 'dark'
   */
  sidebarColor?: 'light' | 'dark' | 'gradient' | 'gradient-2' | 'gradient-3' | 'gradient-4';
  
  /**
   * Sidebar background image
   * @default 'none'
   */
  sidebarImage?: 'none' | 'img-1' | 'img-2' | 'img-3' | 'img-4';
  
  /**
   * Show preloader on page load
   * @default 'disable'
   */
  preloader?: 'enable' | 'disable';
  
  /**
   * Sidebar visibility (for horizontal layout)
   * @default 'show'
   */
  sidebarVisibility?: 'show' | 'hidden';
}

/**
 * Default account configuration
 * Used as fallback when account-specific config is not found
 * 
 * These are the SYSTEM DEFAULTS.
 * Account-specific config.json files can override any of these values.
 */
export const DEFAULT_ACCOUNT_CONFIG: Partial<AccountConfig> = {
  accountId: 'default',
  accountGuid: '00000000-0000-0000-0000-000000000001',
  name: 'Default Account',
  title: 'BASE Application',
  subtitle: 'Multi-Account Platform',
  description: {
    title: 'BASE Application',
    description: 'A multi-account platform for modern applications.',
    purpose: 'Enabling organizations to manage their workflows efficiently.'
  },
  copyrights: {
    year: new Date().getFullYear().toString(),
    holder: 'BASE Platform'
  },
  branding: {
    logo: '/assets/core/media/open/accounts/default/logo-dark.png',
    logoDark: '/assets/core/media/open/accounts/default/logo-light.png',
    logoSm: '/assets/core/media/open/accounts/default/logo-sm.png',
    theme: {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d'
    }
  },
  context: {
    developer: {
      title: 'BASE Development Team'
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
    // ============================================
    // Toolbar Icons - System Defaults
    // ============================================
    showSettingsIcon: false,        // Settings accessible via User Menu (not toolbar)
    showThemeSwitcher: true,        // Allow dark/light mode switching
    showFullscreenToggle: true,     // Allow fullscreen toggle
    showNotifications: true,        // Show notification bell
    showLanguageSelector: true,     // Show language picker
    showShoppingCart: false,        // E-commerce feature - off by default
    showTrashIcon: false,           // Trash/recycle bin - off by default
    showHelpIcon: true,             // Help icon in toolbar
    
    // ============================================
    // User Menu Items - System Defaults
    // ============================================
    showUserMenuFinances: true,     // Show Finances/Wallet in user menu
    showUserMenuMessages: true,     // Show Messages in user menu
    showUserMenuTasks: true,        // Show Tasks in user menu
    showUserMenuHelp: true,         // Show Help/Support in user menu
    
    // ============================================
    // Other Features - System Defaults
    // ============================================
    enableAnalytics: false,         // Analytics tracking - off by default (privacy)
    enableChat: false,              // Chat feature - off by default
    enableNotifications: true,      // Notification system enabled
    
    // Legacy (deprecated)
    enableSettingsIcon: false       // @deprecated - use showSettingsIcon
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
