/**
 * Service Billing Constants
 * 
 * Central constants for the Billing applet.
 * Handles: subscriptions, payment methods, invoices, transaction history.
 * 
 * NOTE: This is the BUSINESS domain of billing.
 * Payment GATEWAY integration (Stripe, PayPal APIs) belongs in a separate
 * service.payment-gateway applet to keep tech concerns separate from business.
 * 
 * Uses buildAppletPaths for future-proof nesting support.
 */
import { buildAppletPaths } from '../../../core/applets/applet-path.builder';

/**
 * Display name for this applet
 */
export const NAME = 'Billing';

/**
 * Parent folder for grouping (empty = flat, 'service' = nested under service/)
 * 
 * Current: flat (sites.app.lets/service.billing/)
 * Future:  could be nested (sites.app.lets/service/billing/)
 */
export const PARENT_FOLDER = '';  // Empty for now, 'service' when we group

/**
 * Folder prefix (e.g., 'service.' for service.billing folder name)
 */
export const FOLDER_PREFIX = 'service.';

/**
 * All computed paths for this applet
 */
export const PATHS = buildAppletPaths(
  'billing',           // name
  PARENT_FOLDER,       // parentFolder (empty for flat)
  FOLDER_PREFIX        // prefix for folder name
);

/**
 * Route prefix for navigation (relative from /apps/)
 */
export const ROUTE_PREFIX = 'payment-processing'; // TODO: rename folder to service.billing

/**
 * Legacy: URL path fragment (for backward compatibility during transition)
 * @deprecated Use PATHS.assetPath instead
 */
export const PATHFRAGMENT = 'sites.app.lets/service.payment-processing';
