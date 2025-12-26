/**
 * Private Navigation Path Contracts
 * 
 * Defines interfaces for PRIVATE (authenticated) navigation routes.
 * 
 * SECURITY CLASSIFICATION:
 * ========================
 * 
 * PRIVATE NAVIGATION (This file):
 * - Authentication REQUIRED
 * - Route guards enforced (AuthGuard, RoleGuard)
 * - User context available
 * - Not indexed by search engines
 * - Application functionality
 * - Examples: Dashboards, settings, messages, teams
 * 
 * vs.
 * 
 * PUBLIC NAVIGATION (See: public-navigation.contracts.ts):
 * - No authentication required
 * - Accessible to anonymous users
 * - SEO-friendly
 * - Marketing pages
 * - Examples: Landing, about, contact
 * 
 * ARCHITECTURE DECISION:
 * ======================
 * 
 * ✅ Private navigation INCLUDES public navigation as a property!
 * 
 * WHY?
 * - Authenticated users can still access public routes
 * - Reflects real-world hierarchy: Private ⊃ Public
 * - Components only need ONE injection (simpler)
 * - Type safety: Full navigation tree available
 * 
 * USAGE:
 * ```typescript
 * // Authenticated component:
 * import { PRIVATE_NAVIGATION, PrivateNavigationPaths } from '../../tokens';
 * constructor(@Inject(PRIVATE_NAVIGATION) public nav: PrivateNavigationPaths) {}
 * 
 * // Access private routes:
 * <a [routerLink]="nav.dashboards.main">Dashboard</a>
 * <a [routerLink]="nav.settings.user">Settings</a>
 * 
 * // Access public routes (via .public property):
 * <a [routerLink]="nav.public.information.about">About Us</a>
 * <a [routerLink]="nav.public.support.faq">FAQ</a>
 * ```
 * 
 * @see public-navigation.contracts.ts for unauthenticated routes
 * @see _custom/documentation/patterns/navigation-security-split-guide.md
 */

import { PublicNavigationPaths } from './public-navigation.contracts';

/**
 * Authentication routes (private - sign out, lock screen)
 */
export interface PrivateAuthPaths {
  /** Sign out action */
  signout: string;
  /** Lock screen page */
  lockscreen: string;
}

/**
 * Dashboard routes (requires auth)
 */
export interface PrivateDashboardPaths {
  /** Dashboard root */
  root: string;
  /** Main/default dashboard */
  main: string;
  /** Analytics dashboard */
  analytics?: string;
  /** Overview dashboard */
  overview?: string;
}

/**
 * User settings routes (requires auth)
 */
export interface PrivateSettingsPaths {
  /** Settings root */
  root: string;
  /** User profile */
  user: string;
  /** Account settings */
  account: string;
  /** User preferences */
  preferences?: string;
  /** Security settings (password, 2FA) */
  security?: string;
  /** Notification preferences */
  notifications?: string;
}

/**
 * Messaging/Communication routes (requires auth)
 */
export interface PrivateMessagesPaths {
  /** Messages root */
  root: string;
  /** Inbox */
  inbox: string;
  /** Sent items */
  sent?: string;
  /** Compose new message */
  compose?: string;
  /** Archived messages */
  archived?: string;
  /** Drafts */
  drafts?: string;
}

/**
 * Team/Collaboration routes (requires auth)
 */
export interface PrivateTeamsPaths {
  /** Teams root */
  root: string;
  /** Team members list */
  members?: string;
  /** Team invitations */
  invitations?: string;
  /** Team settings */
  settings?: string;
  /** Team projects */
  projects?: string;
}

/**
 * Purchases/E-commerce routes (requires auth)
 */
export interface PrivatePurchasesPaths {
  /** Purchases root */
  root: string;
  /** Order history */
  orders?: string;
  /** Shopping cart */
  cart?: string;
  /** Checkout */
  checkout?: string;
  /** Payment methods */
  paymentMethods?: string;
}

/**
 * Admin routes (requires auth + admin role)
 */
export interface PrivateAdminPaths {
  /** Admin root */
  root: string;
  /** User management */
  users?: string;
  /** System settings */
  settings?: string;
  /** Audit logs */
  logs?: string;
  /** Reports */
  reports?: string;
}

/**
 * Private (authenticated) navigation paths.
 * 
 * ⚠️ SECURITY WARNING:
 * All routes in this interface require:
 * - User authentication (AuthGuard)
 * - Valid session/token
 * - Some may require additional role checks (RoleGuard)
 * 
 * ✅ INCLUDES PUBLIC NAVIGATION:
 * The .public property provides access to all public routes.
 * This reflects reality: authenticated users can still access public pages.
 * 
 * USAGE PATTERNS:
 * 
 * 1. Access private routes directly:
 *    nav.dashboards.main
 *    nav.settings.user
 * 
 * 2. Access public routes via .public:
 *    nav.public.information.about
 *    nav.public.landing.pricing
 * 
 * 3. Navigate up:
 *    nav.up
 */
export interface PrivateNavigationPaths {
  /** Navigate up one level */
  up: string;
  
  /**
   * ✅ PUBLIC NAVIGATION ACCESS
   * 
   * Authenticated users can still access all public routes.
   * This property provides the complete public navigation tree.
   * 
   * Example:
   * - nav.public.information.about (About Us page)
   * - nav.public.landing.pricing (Pricing page)
   * - nav.public.support.faq (FAQ page)
   */
  public: PublicNavigationPaths;
  
  /** Authentication actions (private - sign out, lock) */
  auth: PrivateAuthPaths;
  
  /** Dashboard routes */
  dashboards: PrivateDashboardPaths;
  
  /** User settings */
  settings: PrivateSettingsPaths;
  
  /** Messaging/Communications */
  messages: PrivateMessagesPaths;
  
  /** Team/Collaboration */
  teams: PrivateTeamsPaths;
  
  /** Purchases/E-commerce */
  purchases: PrivatePurchasesPaths;
  
  /** Admin routes (requires additional role check) */
  admin?: PrivateAdminPaths;
}
