/**
 * Central constants for the Spike applet.
 * Single source of truth for naming and paths.
 */

/**
 * Display name for this applet (used in UI, logs, etc.)
 */
export const NAME = 'Spike';

/**
 * URL path fragment for this applet.
 * Used for both assets (with slashes) and APIs (converted to dots).
 * 
 * Assets: /assets/app.lets/spike/deployed/
 * APIs:    /api/app.lets.spike/
 */
export const PATHFRAGMENT = 'app.lets/spike';
