/**
 * Central constants for the Apps.Bootstrap tier.
 * Single source of truth for naming and paths.
 * 
 * Pattern:
 * - NAME: Human-readable (display, logs)
 * - ROOT_RELATIVE_PATH: Machine path (with trailing slash for safe concatenation)
 * - PATHFRAGMENT: Legacy alias (backward compatibility)
 */

/**
 * Display name for this tier (used in UI, logs, etc.)
 */
export const NAME = 'Apps.Bootstrap';

/**
 * Machine file path (always lowercase, matches actual folder structure)
 * ✅ Includes trailing slash for safe concatenation
 * 
 * Usage:
 *   const path = `${ROOT_RELATIVE_PATH}assets`;  // → "apps.bootstrap/assets"
 *   const url = `${ROOT_RELATIVE_PATH}media`;    // → "apps.bootstrap/media"
 * 
 * Benefits:
 * - No scattered .toLowerCase() calls
 * - Can't forget the slash in concatenation
 * - Path is explicit and pre-computed
 */
export const ROOT_RELATIVE_PATH = 'apps.bootstrap/';  // ✅ Trailing slash!

/**
 * Legacy URL path fragment (backward compatibility)
 * TODO: Migrate all usages to ROOT_RELATIVE_PATH
 * 
 * Assets: /assets/apps.bootstrap/deployed/
 * APIs:    /api/apps.bootstrap/
 */
export const PATHFRAGMENT = 'apps.bootstrap';  // No trailing slash for backward compat
