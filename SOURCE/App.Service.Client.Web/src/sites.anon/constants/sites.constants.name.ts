/**
 * Central constants for the Sites tier.
 * Single source of truth for naming and paths.
 */

/**
 * Display name for this tier
 */
export const NAME = 'Sites';

/**
 * Machine file path (with trailing slash for safe concatenation)
 * ✅ Example: `${ROOT_RELATIVE_PATH}assets` → "sites/assets"
 */
export const ROOT_RELATIVE_PATH = 'sites/';  // ✅ Trailing slash!

/**
 * Path fragment for URLs
 * Used in assets and media path construction
 */
export const PATHFRAGMENT = 'sites';
