/**
 * Central constants for the Template applet.
 * Single source of truth for naming and paths.
 */

/**
 * Display name for this applet (used in UI, logs, etc.)
 */
export const NAME = 'Template';

/**
 * URL path fragment for this applet.
 * Used for both assets (with slashes) and APIs (converted to dots).
 * 
 * Assets: /assets/app.lets/template/deployed/
 * APIs:    /api/app.lets.template/
 */
export const PATHFRAGMENT = 'app.lets/template';
