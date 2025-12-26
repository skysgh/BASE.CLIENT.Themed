/**
 * Site API Endpoint Injection Token
 * 
 * Provides Angular DI token for API endpoints consumed by Sites components.
 * 
 * ARCHITECTURE:
 * - Token defined in Sites (consumer defines contract)
 * - Values provided in Apps.Main (provider implements contract)
 * - Components inject token (loose coupling via DI)
 * 
 * TIER PLACEMENT:
 * Sites tier is the correct location because:
 * 1. Sites components make API calls (consumer ownership)
 * 2. Avoids CLI-managed apps/ directory (safer from overwrites)
 * 3. Enables Sites library extraction (self-contained contracts)
 * 4. Follows SOLID: consumer defines interface, provider implements
 * 
 * PROVIDER SETUP:
 * ```typescript
 * // apps.main/module.ts
 * import { API_ENDPOINTS } from '../sites/tokens';
 * import { sitesConstantsApis } from '../sites/constants/implementations/sites.constants.apis';
 * 
 * @NgModule({
 *   providers: [{
 *     provide: API_ENDPOINTS,
 *     useValue: {
 *       brochure: sitesConstantsApis.brochure,
 *       persons: sitesConstantsApis.persons,
 *       pricing: sitesConstantsApis.pricing,
 *       products: sitesConstantsApis.products,
 *       service: sitesConstantsApis.service
 *     }
 *   }]
 * })
 * ```
 * 
 * CONSUMER USAGE:
 * ```typescript
 * // sites/services/brochure.service.ts
 * import { API_ENDPOINTS, ApiEndpoints } from '../../tokens';
 * 
 * @Injectable()
 * export class BrochureService {
 *   constructor(
 *     @Inject(API_ENDPOINTS) private apis: ApiEndpoints,
 *     private http: HttpClient
 *   ) {}
 *   
 *   getCapabilities() {
 *     return this.http.get(this.apis.brochure.capabilities);
 *   }
 * }
 * ```
 */

import { InjectionToken } from '@angular/core';
import { ApiEndpoints } from '../contracts';

/**
 * Injection token for API endpoints.
 * 
 * Defined by Sites tier, provided by Apps.Main, consumed by Sites services.
 */
export const API_ENDPOINTS = new InjectionToken<ApiEndpoints>('api.endpoints');
