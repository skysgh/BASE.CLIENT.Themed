/**
 * Billing Applet Constants
 * 
 * Central constants for the Billing applet.
 * Handles: subscriptions, payment methods, invoices, transaction history.
 * 
 * NOTE: This is the BUSINESS domain of billing.
 * Payment GATEWAY integration (Stripe, PayPal APIs) belongs in a separate
 * sites.app.parts/gateway applet to keep tech concerns separate from business.
 * 
 * Uses buildAppletPaths for future-proof nesting support.
 */
import { buildAppletPaths, APPLET_CONTAINERS } from '../../../core/applets/applet-path.builder';

// Build paths using the path builder
const paths = buildAppletPaths('billing', { container: APPLET_CONTAINERS.parts });

/**
 * Billing applet constants
 */
export const BILLING_CONSTANTS = {
  name: 'billing',
  displayName: 'Billing',
  icon: 'bx-credit-card',
  description: 'Subscriptions, payment methods, and transaction history',
  version: '1.0.0',

  // Path information from builder
  paths,

  // Specific routes for this applet
  routes: {
    hub: paths.fullRoute,
    paymentMethods: `${paths.fullRoute}/payment-methods`,
    subscribe: `${paths.fullRoute}/subscribe`,
    transactions: `${paths.fullRoute}/transactions`,
    invoices: `${paths.fullRoute}/invoices`,
  }
};

/**
 * @deprecated Use BILLING_CONSTANTS.routes.hub instead
 */
export const ROUTE_PREFIX = 'billing';

/**
 * @deprecated Use BILLING_CONSTANTS.paths.assetPath instead
 */
export const PATHFRAGMENT = paths.assetPath;
