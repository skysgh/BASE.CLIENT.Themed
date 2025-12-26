/**
 * Central constants for the Apps tier (Private application features).
 * Single source of truth for naming and paths.
 */

/**
 * Display name for this tier
 */
export const NAME = 'Apps';

/**
 * Machine file path (with trailing slash for safe concatenation)
 * ✅ Example: `${ROOT_RELATIVE_PATH}assets` → "apps/assets"
 */
export const ROOT_RELATIVE_PATH = 'apps/';  // ✅ Trailing slash!

/**
 * Path fragment for URLs
 */
export const PATHFRAGMENT = 'apps';
