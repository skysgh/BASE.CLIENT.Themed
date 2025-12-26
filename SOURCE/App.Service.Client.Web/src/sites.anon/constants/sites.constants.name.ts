/**
 * Central constants for the Sites.Anon tier (Public/anonymous pages).
 * Single source of truth for naming and paths.
 * 
 * ✅ UPDATED after tier restructuring:
 * - Old path: 'sites/'
 * - New path: 'sites.anon/'
 * 
 * This affects:
 * - Asset URLs: /assets/sites.anon/deployed/i18n/en.json
 * - API endpoints: /api/sites.anon/...
 * - Navigation: /sites.anon/... (or just / for public root)
 */

/**
 * Display name for this tier
 */
export const NAME = 'Sites.Anon';

/**
 * Machine file path (with trailing slash for safe concatenation)
 * ✅ UPDATED: Changed from 'sites/' to 'sites.anon/' after restructuring
 * 
 * Example: `${ROOT_RELATIVE_PATH}assets` → "sites.anon/assets"
 */
export const ROOT_RELATIVE_PATH = 'sites.anon/';  // ✅ Trailing slash!

/**
 * Path fragment for URLs
 * ✅ UPDATED: Changed from 'sites' to 'sites.anon' after restructuring
 */
export const PATHFRAGMENT = 'sites.anon';
