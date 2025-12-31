/**
 * Central constants for the System applet.
 * Single source of truth for naming and paths.
 */

/**
 * Display name for this applet (used in UI, logs, etc.)
 */
export const NAME = 'System';

/**
 * URL path fragment for this applet.
 * Used for both assets (with slashes) and APIs (converted to dots).
 * 
 * Assets: /assets/app.lets/system/deployed/
 * APIs:    /api/app.lets.system/
 */
export const PATHFRAGMENT = 'app.lets/system';
