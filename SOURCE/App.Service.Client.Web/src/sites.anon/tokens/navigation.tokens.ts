/**
 * Site Navigation Path Injection Token
 * 
 * Provides Angular DI token for navigation paths consumed by Sites components.
 * 
 * ARCHITECTURE:
 * - Token defined in Sites (consumer defines contract)
 * - Values provided in Apps.Main (provider implements contract)
 * - Components inject token (loose coupling via DI)
 * 
 * TIER PLACEMENT:
 * Sites tier is the correct location because:
 * 1. Sites components navigate routes (consumer ownership)
 * 2. Avoids CLI-managed apps/ directory (safer from overwrites)
 * 3. Enables Sites library extraction (self-contained contracts)
 * 4. Follows SOLID: consumer defines interface, provider implements
 * 
 * PROVIDER SETUP:
 * ```typescript
 * // apps.main/module.ts
 * import { NAVIGATION_PATHS } from '../sites.anon/tokens';
 * import { sitesConfigurationNavigation } from '../sites.anon/configuration/implementation/sites.configuration.navigation';
 * 
 * @NgModule({
 *   providers: [{
 *     provide: NAVIGATION_PATHS,
 *     useValue: {
 *       root: sitesConfigurationNavigation.root,
 *       home: sitesConfigurationNavigation.home,
 *       up: sitesConfigurationNavigation.up,
 *       auth: sitesConfigurationNavigation.auth,
 *       dashboards: sitesConfigurationNavigation.dashboards,
 *       errors: sitesConfigurationNavigation.errors,
 *       information: sitesConfigurationNavigation.information,
 *       landings: sitesConfigurationNavigation.landings
 *     }
 *   }]
 * })
 * ```
 * 
 * CONSUMER USAGE:
 * ```typescript
 * // sites/components/header/component.ts
 * import { NAVIGATION_PATHS, NavigationPaths } from '../../tokens';
 * 
 * export class HeaderComponent {
 *   constructor(@Inject(NAVIGATION_PATHS) public navigation: NavigationPaths) {}
 * }
 * ```
 * 
 * TEMPLATE USAGE:
 * ```html
 * <!-- Before (hardcoded): -->
 * <a [routerLink]="appsConfiguration.navigation.auth.signin">Sign In</a>
 * 
 * <!-- After (injected): -->
 * <a [routerLink]="navigation.auth.signin">Sign In</a>
 * ```
 */

import { InjectionToken } from '@angular/core';
import { NavigationPaths } from '../contracts';

/**
 * Injection token for navigation paths.
 * 
 * Defined by Sites tier, provided by Apps.Main, consumed by Sites components.
 */
export const NAVIGATION_PATHS = new InjectionToken<NavigationPaths>('navigation.paths');
