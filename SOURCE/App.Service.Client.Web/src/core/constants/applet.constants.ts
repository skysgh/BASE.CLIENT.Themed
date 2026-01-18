import { ROUTE_SEGMENTS } from './navigation.constants';

/**
 * Applet Registration Constants
 * 
 * Centralized constants for applet registration.
 * Used by account config and navigation wiring.
 */

/**
 * Applet identifiers - use these instead of strings
 */
export const APPLET_IDS = {
  // Service applets (always enabled)
  SETTINGS: 'service.settings',
  SEARCH: 'service.search',
  THEME: 'service.theme',
  OPERATE: 'service.operate',
  COMPLIANCE: 'service.compliance',
  
  // Business applets (enabled per account)
  SPIKE: 'spike',
  ASTRONOMY: 'astronomy',
  EDUCATION: 'education',
  ARCHITECTURE: 'architecture',
  PEOPLE: 'people',
  PRODUCTS: 'products',
  PLACES: 'places',
} as const;

/**
 * Applet type union
 */
export type AppletId = typeof APPLET_IDS[keyof typeof APPLET_IDS];

/**
 * Applet metadata for registration
 */
export interface AppletMetadata {
  id: AppletId;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  /** Route segment (e.g., 'spike' → /apps/spike) */
  routeSegment: string;
  /** Is this a service applet (always enabled)? */
  isService: boolean;
  /** Default enabled state (is functionality available?) */
  defaultEnabled: boolean;
  /** Default menu visibility (should it appear in nav?) */
  defaultMenuVisible: boolean;
  /** Menu location hint */
  menuLocation?: 'main' | 'footer' | 'settings' | 'hidden';
  /** Required feature flag (if any) */
  featureFlag?: string;
}

/**
 * Applet registry - metadata for all known applets
 */
export const APPLET_REGISTRY: Record<AppletId, AppletMetadata> = {
  // Service applets
  [APPLET_IDS.SETTINGS]: {
    id: APPLET_IDS.SETTINGS,
    displayName: 'Settings',
    description: 'System, account, and user settings',
    icon: 'bx-cog',
    color: '#6c757d',
    routeSegment: 'settings',
    isService: true,
    defaultEnabled: true,
    defaultMenuVisible: true,
    menuLocation: 'footer',
  },
  [APPLET_IDS.SEARCH]: {
    id: APPLET_IDS.SEARCH,
    displayName: 'Search',
    description: 'Universal search across all entities',
    icon: 'bx-search',
    color: '#299cdb',
    routeSegment: 'search',
    isService: true,
    defaultEnabled: true,
    defaultMenuVisible: true,
    menuLocation: 'main',
  },
  [APPLET_IDS.COMPLIANCE]: {
    id: APPLET_IDS.COMPLIANCE,
    displayName: 'Legal & Compliance',
    description: 'Privacy, terms, and compliance documents',
    icon: 'bx-shield-quarter',
    color: '#405189',
    routeSegment: 'compliance',
    isService: true,
    defaultEnabled: true,
    defaultMenuVisible: false, // Enabled but NOT in main menu
    menuLocation: 'settings', // Accessible via Settings > Legal
  },
  [APPLET_IDS.THEME]: {
    id: APPLET_IDS.THEME,
    displayName: 'Theme Reference',
    description: 'Theme documentation for developers',
    icon: 'bx-palette',
    color: '#f7b84b',
    routeSegment: 'theme',
    isService: true,
    defaultEnabled: false,
    defaultMenuVisible: false,
    menuLocation: 'hidden',
  },
  [APPLET_IDS.OPERATE]: {
    id: APPLET_IDS.OPERATE,
    displayName: 'Operations',
    description: 'System operations and maintenance',
    icon: 'bx-wrench',
    color: '#74788d',
    routeSegment: 'operate',
    isService: true,
    defaultEnabled: false,
    defaultMenuVisible: false,
    menuLocation: 'settings',
  },
  
  // Business applets
  [APPLET_IDS.SPIKE]: {
    id: APPLET_IDS.SPIKE,
    displayName: 'Spikes',
    description: 'Discovery and ideation tracking',
    icon: 'bx-bulb',
    color: '#3577f1',
    routeSegment: 'spike',
    isService: false,
    defaultEnabled: true,
    defaultMenuVisible: true,
    menuLocation: 'main',
  },
  [APPLET_IDS.ASTRONOMY]: {
    id: APPLET_IDS.ASTRONOMY,
    displayName: 'Astronomy',
    description: 'Explore star systems, planets, and moons',
    icon: 'bx-planet',
    color: '#f7b84b',
    routeSegment: 'astronomy',
    isService: false,
    defaultEnabled: true,
    defaultMenuVisible: true,
    menuLocation: 'main',
  },
  [APPLET_IDS.EDUCATION]: {
    id: APPLET_IDS.EDUCATION,
    displayName: 'Education',
    description: 'Learning and training management',
    icon: 'bx-book-open',
    color: '#0ab39c',
    routeSegment: 'education',
    isService: false,
    defaultEnabled: false,
    defaultMenuVisible: false,
    menuLocation: 'main',
  },
  [APPLET_IDS.ARCHITECTURE]: {
    id: APPLET_IDS.ARCHITECTURE,
    displayName: 'Architecture',
    description: 'System architecture documentation',
    icon: 'bx-sitemap',
    color: '#405189',
    routeSegment: 'architecture',
    isService: false,
    defaultEnabled: false,
    defaultMenuVisible: false,
    menuLocation: 'main',
  },
  [APPLET_IDS.PEOPLE]: {
    id: APPLET_IDS.PEOPLE,
    displayName: 'People',
    description: 'Contact and people management',
    icon: 'bx-group',
    color: '#f06548',
    routeSegment: 'people',
    isService: false,
    defaultEnabled: false,
    defaultMenuVisible: false,
    menuLocation: 'main',
  },
  [APPLET_IDS.PRODUCTS]: {
    id: APPLET_IDS.PRODUCTS,
    displayName: 'Products',
    description: 'Product catalog and inventory',
    icon: 'bx-box',
    color: '#f7b84b',
    routeSegment: 'products',
    isService: false,
    defaultEnabled: false,
    defaultMenuVisible: false,
    menuLocation: 'main',
  },
  [APPLET_IDS.PLACES]: {
    id: APPLET_IDS.PLACES,
    displayName: 'Places',
    description: 'Location and venue management',
    icon: 'bx-map',
    color: '#299cdb',
    routeSegment: 'places',
    isService: false,
    defaultEnabled: false,
    defaultMenuVisible: false,
    menuLocation: 'main',
  },
};

/**
 * Get applet metadata by ID
 */
export function getAppletMetadata(id: AppletId): AppletMetadata | undefined {
  return APPLET_REGISTRY[id];
}

/**
 * Get route path for an applet
 */
export function getAppletRoutePath(id: AppletId): string {
  const meta = APPLET_REGISTRY[id];
  return meta ? `/${ROUTE_SEGMENTS.APPS}/${meta.routeSegment}` : '';
}

/**
 * Get all business applets (non-service)
 */
export function getBusinessApplets(): AppletMetadata[] {
  return Object.values(APPLET_REGISTRY).filter(a => !a.isService);
}

/**
 * Get all service applets
 */
export function getServiceApplets(): AppletMetadata[] {
  return Object.values(APPLET_REGISTRY).filter(a => a.isService);
}

/**
 * Get applets that should appear in main menu
 */
export function getMainMenuApplets(): AppletMetadata[] {
  return Object.values(APPLET_REGISTRY).filter(a => 
    a.defaultEnabled && a.defaultMenuVisible && a.menuLocation === 'main'
  );
}

/**
 * Get applets that appear in footer
 */
export function getFooterApplets(): AppletMetadata[] {
  return Object.values(APPLET_REGISTRY).filter(a => 
    a.defaultEnabled && a.menuLocation === 'footer'
  );
}
