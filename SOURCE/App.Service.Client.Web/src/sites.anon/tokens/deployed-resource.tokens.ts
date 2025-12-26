/**
 * Deployed Resource Injection Token
 * 
 * Provides Angular DI token for STATIC/DEPLOYED resources.
 * 
 * RESOURCE TYPE: Deployed (Static, CDN-safe, Public)
 * - Bundled with deployment
 * - No authentication required
 * - Safe for aggressive caching
 * - Examples: logos, flags, backgrounds, static documents
 * 
 * ARCHITECTURE:
 * - Token defined in Sites (consumer defines contract)
 * - Values provided in Apps.Main (provider implements contract)
 * - Components inject token (loose coupling via DI)
 * 
 * TIER PLACEMENT:
 * Sites tier is correct because:
 * 1. Sites components consume resources (consumer ownership)
 * 2. Avoids CLI-managed apps/ directory (safer from overwrites)
 * 3. Enables Sites library extraction (self-contained contracts)
 * 4. Follows SOLID: consumer defines interface, provider implements
 * 
 * PROVIDER SETUP:
 * ```typescript
 * // apps.main/module.ts
 * import { DEPLOYED_RESOURCES } from '../sites.anon/tokens';
 * 
 * @NgModule({
 *   providers: [{
 *     provide: DEPLOYED_RESOURCES,
 *     useValue: {
 *       logos: { 
 *         light: '/assets/images/logos/logo-light.png',
 *         dark: '/assets/images/logos/logo-dark.png'
 *       },
 *       images: { ... },
 *       files: { ... }
 *     }
 *   }]
 * })
 * ```
 * 
 * CONSUMER USAGE:
 * ```typescript
 * // sites/components/header/component.ts
 * import { DEPLOYED_RESOURCES, DeployedResourcePaths } from '../../tokens';
 * 
 * export class HeaderComponent {
 *   constructor(
 *     @Inject(DEPLOYED_RESOURCES) public deployed: DeployedResourcePaths
 *   ) {}
 * }
 * ```
 * 
 * TEMPLATE USAGE:
 * ```html
 * <!-- Direct access - no auth needed, safe for caching -->
 * <img [src]="deployed.logos.light" alt="Company Logo">
 * ```
 * 
 * @see deployed-resource.contracts.ts for interface definition
 * @see uploaded-resource.tokens.ts for user-generated content
 * @see _custom/documentation/patterns/resource-injection-pattern.md
 */

import { InjectionToken } from '@angular/core';
import { DeployedResourcePaths } from '../contracts';

/**
 * Injection token for deployed (static) resource paths.
 * 
 * ✅ UPDATED: Now uses providedIn: 'root' for automatic availability
 * in lazy-loaded modules without explicit provider setup.
 * 
 * Pattern:
 * - Token provides default factory values
 * - Modules can override by providing their own values
 * - Lazy-loaded modules inherit root value automatically
 * 
 * SECURITY: LOW RISK
 * - Static content reviewed by team
 * - Bundled with deployment
 * - Safe for public CDN distribution
 * - No authentication required
 */
export const DEPLOYED_RESOURCES = new InjectionToken<DeployedResourcePaths>(
  'deployed.resources',
  {
    providedIn: 'root',
    factory: () => {
      // Default values (can be overridden by module providers)
      // These use relative paths that work in development
      return {
        logos: {
          light: '/assets/sites.anon/deployed/images/logos/logo-light.png',
          dark: '/assets/sites.anon/deployed/images/logos/logo-dark.png'
        },
        images: {
          root: '/assets/sites.anon/deployed/images/',
          trustedBy: '/assets/sites.anon/deployed/images/trustedby/',
          flags: '/assets/sites.anon/deployed/images/flags/',
          backgrounds: '/assets/sites.anon/deployed/images/backgrounds/'
        },
        files: {
          root: '/assets/sites.anon/deployed/files/',
          markdown: '/assets/sites.anon/deployed/files/markdown/',
          pdf: '/assets/sites.anon/deployed/files/pdf/'
        }
      };
    }
  }
);
