/**
 * Public Navigation Path Contracts
 * 
 * Defines interfaces for PUBLIC (unauthenticated) navigation routes.
 * 
 * SECURITY CLASSIFICATION:
 * ========================
 * 
 * PUBLIC NAVIGATION (This file):
 * - No authentication required
 * - Accessible to anonymous users
 * - SEO-friendly (indexed by search engines)
 * - Marketing and informational pages
 * - No route guards needed
 * - Examples: Landing pages, sign in/up, about, contact
 * 
 * vs.
 * 
 * PRIVATE NAVIGATION (See: private-navigation.contracts.ts):
 * - Authentication REQUIRED
 * - Route guards enforced (AuthGuard)
 * - User context available
 * - Not indexed by search engines
 * - Examples: Dashboards, settings, messages
 * 
 * ARCHITECTURE:
 * - Sites tier defines contracts (what routes it needs)
 * - Apps.Main provides implementation (concrete URLs)
 * - Sites components consume via DI (injection)
 * 
 * DESIGN DECISION:
 * Private navigation INCLUDES public navigation as a property.
 * This reflects reality: authenticated users can still access public routes.
 * 
 * USAGE:
 * ```typescript
 * // Public component (header, footer):
 * import { PUBLIC_NAVIGATION, PublicNavigationPaths } from '../../tokens';
 * constructor(@Inject(PUBLIC_NAVIGATION) public nav: PublicNavigationPaths) {}
 * 
 * // In template:
 * <a [routerLink]="nav.auth.signin">Sign In</a>
 * <a [routerLink]="nav.landing.pricing">Pricing</a>
 * ```
 * 
 * @see private-navigation.contracts.ts for authenticated routes
 * @see _custom/documentation/patterns/navigation-security-split-guide.md
 */

/**
 * Authentication routes (public - sign in/up/forgot password)
 */
export interface PublicAuthPaths {
  /** Auth root path */
  root: string;
  /** Sign up/Register page */
  signup: string;
  /** Sign in/Login page */
  signin: string;
  /** Forgot password page */
  forgotPassword: string;
  /** Reset password page (with token in URL) */
  resetPassword: string;
  /** Email verification page */
  verifyEmail: string;
}

/**
 * Landing/Marketing page routes
 */
export interface PublicLandingPaths {
  /** Landing root */
  root: string;
  /** Home/Main landing page */
  home: string;
  /** Pricing page */
  pricing: string;
  /** Features showcase */
  features: string;
  /** Customer testimonials/reviews */
  testimonials: string;
  /** Frequently asked questions */
  faq: string;
  /** Contact form */
  contact: string;
}

/**
 * Public information/content page routes
 */
export interface PublicInformationPaths {
  /** Information root */
  root: string;
  /** About us page */
  about: string;
  /** Terms of service */
  terms: string;
  /** Privacy policy */
  privacy: string;
  /** Cookie policy */
  cookies: string;
  /** Accessibility statement */
  accessibility: string;
  /** Contact page */
  contact: string;
}

/**
 * Public support page routes
 */
export interface PublicSupportPaths {
  /** Support root */
  root: string;
  /** FAQ/Help center */
  faq: string;
  /** Contact support form */
  contact: string;
  /** System status page */
  status: string;
}

/**
 * Error page routes (public - no auth required)
 */
export interface PublicErrorPaths {
  /** 404 Not Found */
  notFound: string;
  /** 500 Server Error */
  serverError: string;
  /** 403 Forbidden */
  forbidden: string;
}

/**
 * Public (unauthenticated) navigation paths.
 * 
 * All routes in this interface are:
 * - Accessible without authentication
 * - Safe for anonymous users
 * - SEO-friendly (can be indexed)
 * - Marketing/informational content
 * - No route guards required
 * 
 * SECURITY: LOW RISK
 * - No user data exposure
 * - No sensitive functionality
 * - Public by design
 */
export interface PublicNavigationPaths {
  /** Site root path */
  root: string;
  /** Home/Landing page */
  home: string;
  
  /** Authentication routes (public - sign in/up) */
  auth: PublicAuthPaths;
  
  /** Landing/Marketing pages */
  landing: PublicLandingPaths;
  
  /** Public information pages */
  information: PublicInformationPaths;
  
  /** Public support pages */
  support: PublicSupportPaths;
  
  /** Error pages */
  errors: PublicErrorPaths;
}
