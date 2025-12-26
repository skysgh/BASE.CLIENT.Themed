/**
 * Central constants for the Transactions applet.
 * Single source of truth for naming and paths.
 */

/**
 * Display name for this applet (used in UI, logs, etc.)
 */
export const NAME = 'Transactions';

/**
 * URL path fragment for this applet.
 * Used for both assets (with slashes) and APIs (converted to dots).
 * 
 * Assets: /assets/app.lets/transactions/deployed/
 * APIs:    /api/app.lets.transactions/
 */
export const PATHFRAGMENT = 'app.lets/transactions';
