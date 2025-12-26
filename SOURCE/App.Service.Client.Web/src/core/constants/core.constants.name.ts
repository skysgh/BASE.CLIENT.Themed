/**
 * Central constants for the Core tier.
 * Single source of truth for naming and paths.
 */

/**
 * Display name for this tier (used in UI, logs, etc.)
 */
export const NAME = 'Core';

/**
 * URL path fragment for this tier.
 * 
 * Assets: /assets/core/deployed/
 * APIs:    /api/core/
 */
export const PATHFRAGMENT = 'core';

/**
 * Machine file path (with trailing slash for safe concatenation)
 * ✅ Example: `${ROOT_RELATIVE_PATH}assets` → "core/assets"
 */
export const ROOT_RELATIVE_PATH = 'core/';  // ✅ Trailing slash!
