/**
 * Applet Path Builder
 * 
 * Centralizes path construction for applets to support:
 * - Current flat structure: sites.app.lets/spike/
 * - Future nested structure: sites.app.lets/service/billing/
 * 
 * Why this matters:
 * - Human nature: as the app grows, we WILL want to group applets
 * - Refactoring safety: one place to change, not scattered hardcoded paths
 * - Consistency: all applets use the same pattern
 * 
 * Usage in applet constants:
 * ```typescript
 * import { buildAppletPaths } from '../../../core/applets/applet-path.builder';
 * 
 * // Flat applet (current)
 * export const paths = buildAppletPaths('spike');
 * 
 * // Nested applet (future)
 * export const paths = buildAppletPaths('billing', 'service');
 * ```
 */

export interface AppletPaths {
  /**
   * Display name (e.g., 'Billing', 'Spike')
   */
  name: string;

  /**
   * Parent folder (empty string for flat, 'service' for service/billing)
   */
  parentFolder: string;

  /**
   * Full folder name (e.g., 'spike', 'service.billing')
   */
  folderName: string;

  /**
   * Physical path fragment for assets (with slashes)
   * e.g., 'sites.app.lets/spike' or 'sites.app.lets/service/billing'
   */
  assetPath: string;

  /**
   * API path fragment (with dots)
   * e.g., 'sites.app.lets.spike' or 'sites.app.lets.service.billing'
   */
  apiPath: string;

  /**
   * Route path fragment (for navigation)
   * e.g., 'spike' or 'service/billing'
   */
  routePath: string;

  /**
   * Full route from apps root
   * e.g., '/apps/spike' or '/apps/service/billing'
   */
  fullRoute: string;
}

/**
 * Build paths for an applet
 * 
 * @param name - Applet name (e.g., 'billing', 'spike')
 * @param parentFolder - Parent folder for grouping (e.g., 'service', 'social'). Empty for flat structure.
 * @param prefix - Prefix for folder name (e.g., 'service.' for service.billing). Auto-derived from parentFolder if not provided.
 */
export function buildAppletPaths(
  name: string,
  parentFolder: string = '',
  prefix?: string
): AppletPaths {
  // Derive prefix from parent folder if not explicitly provided
  const effectivePrefix = prefix ?? (parentFolder ? `${parentFolder}.` : '');
  
  // Full folder name (what the directory is named)
  const folderName = effectivePrefix ? `${effectivePrefix}${name}` : name;
  
  // Physical path (with slashes) - for assets
  const assetPath = parentFolder 
    ? `sites.app.lets/${parentFolder}/${folderName}`
    : `sites.app.lets/${folderName}`;
  
  // API path (with dots) - for API routes
  const apiPath = assetPath.replace(/\//g, '.');
  
  // Route path (navigation)
  const routePath = parentFolder 
    ? `${parentFolder}/${name}`
    : name;
  
  // Full route from apps root
  const fullRoute = `/apps/${routePath}`;

  return {
    name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
    parentFolder,
    folderName,
    assetPath,
    apiPath,
    routePath,
    fullRoute,
  };
}

/**
 * Applet base paths constant
 * Used as the root for all applet path calculations
 */
export const APPLET_BASE = {
  /** Physical folder where applets live */
  folder: 'sites.app.lets',
  /** Route prefix for all applets */
  routePrefix: '/apps',
};
