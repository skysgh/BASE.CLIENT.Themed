/**
 * Core Navigation Route Segments
 * 
 * Single source of truth for route segment strings.
 * Used by all tiers (core, sites, app.lets) to build paths.
 * 
 * WHY:
 * - No hardcoded strings scattered across codebase
 * - Refactoring-safe (change once, affects everywhere)
 * - Type-safe (IDE autocomplete)
 * 
 * USAGE:
 * ```typescript
 * import { ROUTE_SEGMENTS } from 'core/constants/navigation.constants';
 * const path = `/${ROUTE_SEGMENTS.APPS}/${ROUTE_SEGMENTS.SETTINGS}`;
 * ```
 */

/**
 * Top-level route segments
 */
export const ROUTE_SEGMENTS = {
  // Site types
  PAGES: 'pages',
  APPS: 'apps',
  AUTH: 'auth',
  ERRORS: 'errors',
  
  // System namespace (platform applets under /apps/system/*)
  SYSTEM: 'system',
  
  // Common actions (BREAD)
  BROWSE: 'browse',
  READ: 'read',
  EDIT: 'edit',
  ADD: 'add',
  DELETE: 'delete',
  
  // Alternative action names
  LIST: 'list',
  VIEW: 'view',
  CREATE: 'create',
  NEW: 'new',
  
  // Features
  HUB: 'hub',
  SETTINGS: 'settings',
  DASHBOARD: 'dashboard',
  SEARCH: 'search',
  
  // Applets
  APPLETS: 'applets',
  SPIKE: 'spike',
} as const;

/**
 * Settings-specific route segments
 */
export const SETTINGS_SEGMENTS = {
  SERVICE: 'service',
  ACCOUNT: 'account',
  USER: 'user',
  APPLETS: 'applets',
} as const;

/**
 * Auth-specific route segments
 */
export const AUTH_SEGMENTS = {
  SIGNIN: 'signin',
  SIGNUP: 'signup',
  SIGNOUT: 'signout',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  LOCKSCREEN: 'lockscreen',
  TWO_STEP: 'two-step',
} as const;

/**
 * Error-specific route segments
 */
export const ERROR_SEGMENTS = {
  NOT_FOUND: '404',
  SERVER_ERROR: '500',
  FORBIDDEN: '403',
  MAINTENANCE: 'maintenance',
} as const;

/**
 * Type for route segment values
 */
export type RouteSegment = typeof ROUTE_SEGMENTS[keyof typeof ROUTE_SEGMENTS];
export type SettingsSegment = typeof SETTINGS_SEGMENTS[keyof typeof SETTINGS_SEGMENTS];
export type AuthSegment = typeof AUTH_SEGMENTS[keyof typeof AUTH_SEGMENTS];
export type ErrorSegment = typeof ERROR_SEGMENTS[keyof typeof ERROR_SEGMENTS];
