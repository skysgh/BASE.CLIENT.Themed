/**
 * Site Navigation Path Contracts
 * 
 * Defines the interface for navigation routes needed by Sites tier components.
 * 
 * ARCHITECTURE:
 * - Sites tier defines contracts (what routes it needs)
 * - Apps.Main provides implementation (concrete URLs)
 * - Sites components consume via DI (injection)
 * 
 * RATIONALE FOR PLACEMENT:
 * - Sites components navigate routes, so Sites defines the contract
 * - Follows "consumer defines interface" SOLID principle
 * - Avoids CLI-managed apps/ directory (safe from scaffolding overwrites)
 * - Enables Sites extraction as reusable library
 * 
 * USAGE:
 * ```typescript
 * // In component:
 * import { NavigationPaths } from '../../contracts';
 * constructor(@Inject(NAVIGATION_PATHS) public navigation: NavigationPaths) {}
 * 
 * // In template:
 * <a [routerLink]="navigation.auth.signin">Sign In</a>
 * ```
 */

/**
 * Authentication/Authorization navigation paths
 */
export interface NavigationAuthPaths {
  /** Root auth path */
  root: string;
  /** Sign up page */
  signup: string;
  /** Sign in page */
  signin: string;
  /** Lock screen page */
  lockscreen: string;
  /** Sign out action */
  signout: string;
  /** User registration */
  register: string;
  /** Login page */
  login: string;
}

/**
 * Dashboard navigation paths
 */
export interface NavigationDashboardPaths {
  /** Root dashboard path */
  root?: string;
  // Add specific dashboard routes as needed
}

/**
 * Error page navigation paths
 */
export interface NavigationErrorPaths {
  /** Root error path */
  root?: string;
  /** 404 Not Found */
  notFound?: string;
  /** 500 Server Error */
  serverError?: string;
  // Add other error pages as needed
}

/**
 * Information/Content page navigation paths
 */
export interface NavigationInformationPaths {
  /** Root information path */
  root?: string;
  /** About page */
  about?: string;
  /** Contact page */
  contact?: string;
  // Add other information pages as needed
}

/**
 * Landing page navigation paths
 */
export interface NavigationLandingPaths {
  /** Root landing path */
  root?: string;
  /** Home/Main landing */
  home?: string;
  // Add other landing pages as needed
}

/**
 * Complete navigation structure.
 * Consumed by Sites components, provided by Apps.Main.
 */
export interface NavigationPaths {
  /** Site root path */
  root: string;
  /** Home page */
  home: string;
  /** Navigate up one level */
  up: string;
  
  /** Authentication routes */
  auth: NavigationAuthPaths;
  /** Dashboard routes */
  dashboards: NavigationDashboardPaths;
  /** Error page routes */
  errors: NavigationErrorPaths;
  /** Information/content routes */
  information: NavigationInformationPaths;
  /** Landing page routes */
  landings: NavigationLandingPaths;
}
