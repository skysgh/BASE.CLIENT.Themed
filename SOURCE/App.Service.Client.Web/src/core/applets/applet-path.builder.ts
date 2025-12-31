/**
 * Applet Path Builder
 * 
 * Centralizes path construction for applets to support:
 * - Domain applets: sites.app.lets/spike/ → /app/spike
 * - Platform applets: sites.app.parts/billing/ → /system/billing
 * - Nested applets: sites.app.lets/social/people/ → /app/social/people
 * 
 * Why this matters:
 * - Human nature: as the app grows, we WILL want to group applets
 * - Refactoring safety: one place to change, not scattered hardcoded paths
 * - Consistency: all applets use the same pattern
 * 
 * Usage in applet constants:
 * ```typescript
 * import { buildAppletPaths, APPLET_CONTAINERS } from '../../../core/applets/applet-path.builder';
 * 
 * // Domain applet (user features) - /app/spike
 * export const paths = buildAppletPaths('spike');
 * 
 * // Platform applet (system parts) - /system/billing
 * export const paths = buildAppletPaths('billing', { container: APPLET_CONTAINERS.parts });
 * 
 * // Nested domain applet - /app/social/people
 * export const paths = buildAppletPaths('people', { parent: 'social' });
 * 
 * // Nested platform applet - /system/gateway/stripe
 * export const paths = buildAppletPaths('stripe', { container: APPLET_CONTAINERS.parts, parent: 'gateway' });
 * ```
 */

/**
 * Container definitions for applet organization
 */
export const APPLET_CONTAINERS = {
  /** Domain applets - what users came for (business features) */
  lets: {
    folder: 'sites.app.lets',
    urlPrefix: '/app',
  },
  /** Platform applets - system support (infrastructure with UI) */
  parts: {
    folder: 'sites.app.parts',
    urlPrefix: '/system',
  },
} as const;

export type AppletContainer = typeof APPLET_CONTAINERS[keyof typeof APPLET_CONTAINERS];

export interface AppletPathOptions {
  /**
   * Container for the applet (default: APPLET_CONTAINERS.lets)
   * - lets: Domain applets (sites.app.lets, /app/...)
   * - parts: Platform applets (sites.app.parts, /system/...)
   */
  container?: AppletContainer;

  /**
   * Parent folder for grouping (empty string for flat structure)
   * e.g., 'social' for sites.app.lets/social/people
   */
  parent?: string;
}

export interface AppletPaths {
  /**
   * Display name (e.g., 'Billing', 'Spike')
   */
  name: string;

  /**
   * Container folder (e.g., 'sites.app.lets', 'sites.app.parts')
   */
  containerFolder: string;

  /**
   * URL prefix (e.g., '/app', '/system')
   */
  urlPrefix: string;

  /**
   * Parent folder (empty string for flat, 'social' for social/people)
   */
  parentFolder: string;

  /**
   * Applet folder name (e.g., 'spike', 'billing')
   */
  folderName: string;

  /**
   * Physical path fragment for assets (with slashes)
   * e.g., 'sites.app.lets/spike' or 'sites.app.parts/billing'
   */
  assetPath: string;

  /**
   * API path fragment (with dots)
   * e.g., 'sites.app.lets.spike' or 'sites.app.parts.billing'
   */
  apiPath: string;

  /**
   * Route path fragment (for navigation, without prefix)
   * e.g., 'spike' or 'billing' or 'social/people'
   */
  routePath: string;

  /**
   * Full route from root (with prefix)
   * e.g., '/app/spike' or '/system/billing'
   */
  fullRoute: string;

  /**
   * Data path for loading applet-specific data files
   * e.g., 'assets/data/app/spike' or 'assets/data/system/billing'
   */
  dataPath: string;
}

/**
 * Build paths for an applet
 * 
 * @param name - Applet name (e.g., 'billing', 'spike')
 * @param options - Configuration options for container and parent folder
 */
export function buildAppletPaths(
  name: string,
  options: AppletPathOptions = {}
): AppletPaths {
  const container = options.container ?? APPLET_CONTAINERS.lets;
  const parent = options.parent ?? '';

  // Physical path (with slashes) - for assets
  const assetPath = parent
    ? `${container.folder}/${parent}/${name}`
    : `${container.folder}/${name}`;

  // API path (with dots) - for API routes
  const apiPath = assetPath.replace(/\//g, '.');

  // Route path (navigation, without prefix)
  const routePath = parent ? `${parent}/${name}` : name;

  // Full route from root (with prefix)
  const fullRoute = `${container.urlPrefix}/${routePath}`;

  // Data path for loading applet-specific data
  const dataPathSegment = container.urlPrefix.replace('/', ''); // 'app' or 'system'
  const dataPath = parent
    ? `assets/data/${dataPathSegment}/${parent}/${name}`
    : `assets/data/${dataPathSegment}/${name}`;

  return {
    name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
    containerFolder: container.folder,
    urlPrefix: container.urlPrefix,
    parentFolder: parent,
    folderName: name,
    assetPath,
    apiPath,
    routePath,
    fullRoute,
    dataPath,
  };
}

/**
 * @deprecated Use APPLET_CONTAINERS instead
 * Kept for backward compatibility during migration
 */
export const APPLET_BASE = {
  /** Physical folder where domain applets live */
  folder: 'sites.app.lets',
  /** Route prefix for domain applets */
  routePrefix: '/app',
};
