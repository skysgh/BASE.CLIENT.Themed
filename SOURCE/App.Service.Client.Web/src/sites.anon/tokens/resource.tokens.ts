/**
 * Site Resource Path Injection Token
 * 
 * Provides Angular DI token for resource paths consumed by Sites components.
 * 
 * ARCHITECTURE:
 * - Token defined in Sites (consumer defines contract)
 * - Values provided in Apps.Main (provider implements contract)
 * - Components inject token (loose coupling via DI)
 * 
 * TIER PLACEMENT:
 * Sites tier is the correct location because:
 * 1. Sites components consume resources (consumer ownership)
 * 2. Avoids CLI-managed apps/ directory (safer from overwrites)
 * 3. Enables Sites library extraction (self-contained contracts)
 * 4. Follows SOLID: consumer defines interface, provider implements
 * 
 * PROVIDER SETUP:
 * ```typescript
 * // apps.main/module.ts
 * import { RESOURCE_PATHS } from '../sites/tokens';
 * 
 * @NgModule({
 *   providers: [{
 *     provide: RESOURCE_PATHS,
 *     useValue: { logos: {...}, images: {...}, files: {...} }
 *   }]
 * })
 * ```
 * 
 * CONSUMER USAGE:
 * ```typescript
 * // sites/components/header/component.ts
 * import { RESOURCE_PATHS, ResourcePaths } from '../../tokens';
 * 
 * export class HeaderComponent {
 *   constructor(@Inject(RESOURCE_PATHS) public resources: ResourcePaths) {}
 * }
 * ```
 */

import { InjectionToken } from '@angular/core';
import { ResourcePaths } from '../contracts';

/**
 * Injection token for resource paths.
 * 
 * Defined by Sites tier, provided by Apps.Main, consumed by Sites components.
 */
export const RESOURCE_PATHS = new InjectionToken<ResourcePaths>('resource.paths');
