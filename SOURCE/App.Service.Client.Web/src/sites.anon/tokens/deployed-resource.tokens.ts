/**
 * Deployed Resource Injection Token
 * 
 * Provides Angular DI token for STATIC/DEPLOYED resources.
 * 
 * ⚠️ **DEPRECATED FOR BRANDING (2025-12-27):**
 * Logos and account-specific branding should now use AccountService instead.
 * This token is still useful for non-account-specific assets (flags, backgrounds, etc.)
 * 
 * RESOURCE TYPE: Deployed (Static, CDN-safe, Public)
 * - Bundled with deployment
 * - No authentication required
 * - Safe for aggressive caching
 * - Examples: ~~logos~~ (use AccountService), flags, backgrounds, static documents
 * 
 * **Migration Guide:**
 * ```typescript
 * // ❌ OLD: DEPLOYED_RESOURCES for logos
 * constructor(@Inject(DEPLOYED_RESOURCES) deployed: DeployedResourcePaths) {
 *   this.logo = deployed.logos.light;
 * }
 * 
 * // ✅ NEW: AccountService for account-specific branding
 * constructor(private accountService: AccountService) {
 *   this.logo$ = this.accountService.getConfigValue('branding.logo');
 * }
 * ```
 * 
 * **Still Appropriate For:**
 * - Country/language flags (same for all accounts)
 * - Background patterns (same for all accounts)
 * - Static documents (terms, privacy - same for all accounts)
 * - UI decorations (not account-specific)
 * 
 * **NOT Appropriate For:**
 * - ❌ Account logos (use AccountService)
 * - ❌ Account titles/descriptions (use AccountService)
 * - ❌ Any branding that changes per account (use AccountService)
 * 
 * ARCHITECTURE:
 * - Token defined in Sites (consumer defines contract)
 * - Values provided in Sites.Anon module (provider implements contract)
 * - Components inject token (loose coupling via DI)
 * 
 * TIER PLACEMENT:
 * Sites tier is correct because:
 * 1. Sites components consume resources (consumer ownership)
 * 2. Avoids CLI-managed apps/ directory (safer from overwrites)
 * 3. Enables Sites library extraction (self-contained contracts)
 * 4. Follows SOLID: consumer defines interface, provider implements
 * 
 * @see deployed-resource.contracts.ts for interface definition
 * @see uploaded-resource.tokens.ts for user-generated content
 * @see _custom/documentation/patterns/deployed-resources-migration-complete.md
 * @see _custom/documentation/patterns/multi-account-i18n-support.md
 */

import { InjectionToken } from '@angular/core';
import { DeployedResourcePaths } from '../contracts';

/**
 * Injection token for deployed (static) resource paths.
 * 
 * ✅ BEST PRACTICE: Provided by parent module (BaseCoreSitesModule)
 * Child modules inherit by importing parent module.
 * 
 * ❌ ANTI-PATTERN: Using providedIn: 'root' (global pollution, no tree-shaking)
 * 
 * Pattern:
 * - Token defined here (contract)
 * - BaseCoreSitesModule provides values
 * - Lazy-loaded modules import BaseCoreSitesModule
 * - Components inject token
 * 
 * SECURITY: LOW RISK
 * - Static content reviewed by team
 * - Bundled with deployment
 * - Safe for public CDN distribution
 * - No authentication required
 * 
 * ⚠️ NOTE: For account-specific branding, use AccountService instead!
 */
export const DEPLOYED_RESOURCES = new InjectionToken<DeployedResourcePaths>(
  'deployed.resources'
  // ✅ No providedIn - explicit provider in module (best practice)
);
