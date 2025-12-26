/**
 * Private Navigation Injection Token
 * 
 * Provides Angular DI token for PRIVATE (authenticated) navigation routes.
 * 
 * SECURITY CLASSIFICATION: Private (authentication REQUIRED)
 * 
 * ✅ INCLUDES PUBLIC NAVIGATION:
 * The value provided by this token includes a .public property
 * that contains all public routes. This reflects reality: authenticated
 * users can still access public pages.
 * 
 * USE WHEN:
 * - Component requires authentication
 * - User context needed
 * - Application functionality (not marketing)
 * 
 * EXAMPLES:
 * - Dashboards
 * - User settings
 * - Team pages
 * - Messaging
 * - Admin panels
 * 
 * USAGE:
 * ```typescript
 * constructor(@Inject(PRIVATE_NAVIGATION) public nav: PrivateNavigationPaths) {}
 * 
 * // Private routes:
 * <a [routerLink]="nav.dashboards.main">Dashboard</a>
 * 
 * // Public routes (via .public):
 * <a [routerLink]="nav.public.information.about">About</a>
 * ```
 * 
 * @see public-navigation.tokens.ts for unauthenticated routes
 */

import { InjectionToken } from '@angular/core';
import { PrivateNavigationPaths } from '../contracts';

/**
 * Injection token for private (authenticated) navigation paths.
 * 
 * ⚠️ SECURITY: Authentication REQUIRED
 * - Route guards enforced
 * - User context available
 * - Not indexed by search engines
 * 
 * ✅ INCLUDES PUBLIC NAVIGATION:
 * Access public routes via nav.public.*
 */
export const PRIVATE_NAVIGATION = new InjectionToken<PrivateNavigationPaths>(
  'private.navigation'
);
