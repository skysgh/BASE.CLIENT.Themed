/**
 * Central constants for the Sites.App tier (Authenticated application features).
 * Single source of truth for naming and paths.
 * 
 * ✅ UPDATED after tier restructuring:
 * - Old path: 'apps/'
 * - New path: 'sites.app/'
 * 
 * This affects:
 * - Asset URLs: /assets/sites.app/deployed/i18n/en.json
 * - API endpoints: /api/sites.app/...
 * - Navigation: /sites.app/...
 */

/**
 * Display name for this tier
 */
export const NAME = 'Sites.App';

/**
 * Machine file path (with trailing slash for safe concatenation)
 * ✅ UPDATED: Changed from 'apps/' to 'sites.app/' after restructuring
 * 
 * Example: `${ROOT_RELATIVE_PATH}assets` → "sites.app/assets"
 */
export const ROOT_RELATIVE_PATH = 'sites.app/';  // ✅ Trailing slash!

/**
 * Path fragment for URLs
 * ✅ UPDATED: Changed from 'apps' to 'sites.app' after restructuring
 */
export const PATHFRAGMENT = 'sites.app';
