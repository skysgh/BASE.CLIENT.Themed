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
 * ✅ UPDATED: Now uses providedIn: 'root' for automatic availability
 * 
 * SECURITY: No authentication required
 * - Safe for anonymous users
 * - SEO-friendly routes
 * - Marketing/informational content
 */
export const PUBLIC_NAVIGATION = new InjectionToken<PublicNavigationPaths>(
  'public.navigation',
  {
    providedIn: 'root',
    factory: () => {
      // Default public navigation paths
      return {
        root: '/',
        home: '/',
        auth: {
          root: '/auth',
          signup: '/auth/signup',
          signin: '/auth/signin',
          forgotPassword: '/auth/forgot-password',
          resetPassword: '/auth/reset-password',
          verifyEmail: '/auth/verify-email'
        },
        landing: {
          root: '/landing',
          home: '/landing',
          pricing: '/landing/pricing',
          features: '/landing/features',
          testimonials: '/landing/testimonials',
          faq: '/landing/faq',
          contact: '/landing/contact'
        },
        information: {
          root: '/information',
          about: '/information/about',
          terms: '/information/terms',
          privacy: '/information/privacy',
          cookies: '/information/cookies',
          accessibility: '/information/accessibility',
          contact: '/information/contact'
        },
        support: {
          root: '/support',
          faq: '/support/faq',
          contact: '/support/contact',
          status: '/support/status'
        },
        errors: {
          notFound: '/errors/404',
          serverError: '/errors/500',
          forbidden: '/errors/403'
        }
      };
    }
  }
);
