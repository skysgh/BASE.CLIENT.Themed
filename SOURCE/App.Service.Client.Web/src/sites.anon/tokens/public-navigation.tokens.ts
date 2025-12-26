/**
 * Public Navigation Injection Token
 * 
 * Provides Angular DI token for PUBLIC (unauthenticated) navigation routes.
 * 
 * SECURITY CLASSIFICATION: Public (no auth required)
 * 
 * USE WHEN:
 * - Component shown to anonymous users
 * - Marketing/landing pages
 * - Public information pages
 * - No authentication context needed
 * 
 * EXAMPLES:
 * - Landing page header
 * - Public footer
 * - Marketing pages
 * - Sign in/up pages
 * 
 * @see private-navigation.tokens.ts for authenticated routes
 */

import { InjectionToken } from '@angular/core';
import { PublicNavigationPaths } from '../contracts';

/**
 * Injection token for public (unauthenticated) navigation paths.
 * 
 * ✅ BEST PRACTICE: Provided by parent module (BaseCoreSitesModule)
 * Child modules inherit by importing parent module.
 * 
 * SECURITY: No authentication required
 * - Safe for anonymous users
 * - SEO-friendly routes
 * - Marketing/informational content
 */
export const PUBLIC_NAVIGATION = new InjectionToken<PublicNavigationPaths>(
  'public.navigation'
  // ✅ No providedIn - explicit provider in module (best practice)
);
