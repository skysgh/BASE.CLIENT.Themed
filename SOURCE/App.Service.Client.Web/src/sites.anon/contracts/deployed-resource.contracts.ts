/**
 * Deployed Resource Path Contracts
 * 
 * Defines interfaces for STATIC resources deployed with the application.
 * 
 * RESOURCE CLASSIFICATION:
 * ========================
 * 
 * DEPLOYED RESOURCES (This file):
 * - Static assets bundled with deployment
 * - Safe, public, CDN-friendly
 * - No authentication required
 * - Aggressive caching allowed
 * - Examples: logos, flags, backgrounds, static documents
 * 
 * vs.
 * 
 * UPLOADED RESOURCES (See: uploaded-resource.contracts.ts):
 * - User-generated content at runtime
 * - Requires authentication/authorization
 * - May need signed URLs (time-limited access)
 * - Needs virus scanning
 * - Examples: profile photos, attachments, user documents
 * 
 * ARCHITECTURE:
 * - Sites tier defines contracts (what it needs)
 * - Apps.Main provides implementation (concrete paths)
 * - Sites components consume via DI (injection)
 * 
 * SECURITY CONSIDERATIONS:
 * - Deployed resources are LOW RISK (static, reviewed, bundled)
 * - Can be served from CDN without authentication
 * - Can use aggressive caching (immutable if versioned)
 * - Safe for public access
 * 
 * USAGE:
 * ```typescript
 * // In component:
 * import { DeployedResourcePaths } from '../../contracts';
 * import { DEPLOYED_RESOURCES } from '../../tokens';
 * 
 * constructor(@Inject(DEPLOYED_RESOURCES) public deployed: DeployedResourcePaths) {}
 * 
 * // In template:
 * <img [src]="deployed.logos.light" alt="Company Logo">
 * ```
 * 
 * @see uploaded-resource.contracts.ts for user-generated content
 * @see _custom/documentation/patterns/resource-injection-pattern.md
 */

/**
 * Deployed (static) resource paths.
 * 
 * All paths in this interface represent resources that are:
 * - Bundled with the application deployment
 * - Safe for public CDN distribution
 * - Do not require authentication
 * - Can be cached aggressively
 */
export interface DeployedResourcePaths {
  /**
   * Application logo images (light/dark variants)
   * 
   * USAGE: Brand identity, headers, authentication pages
   * SECURITY: Public, safe (reviewed by team)
   * CACHING: Aggressive (version in filename)
   */
  logos: {
    /** Light theme logo (for use on dark backgrounds) */
    light: string;
    /** Dark theme logo (for use on light backgrounds) */
    dark: string;
  };
  
  /**
   * Static image paths organized by category
   * 
   * USAGE: UI decorations, backgrounds, partner logos
   * SECURITY: Public, safe (reviewed by team)
   * CACHING: Aggressive
   */
  images: {
    /** Root images directory */
    root: string;
    /** Trusted partner/sponsor logos */
    trustedBy: string;
    /** Country/language flag icons */
    flags: string;
    /** Decorative background images */
    backgrounds: string;
  };
  
  /**
   * Static file resource paths (documents, PDFs, markdown)
   * 
   * USAGE: Terms of service, privacy policy, help docs
   * SECURITY: Public, safe (legal/business reviewed)
   * CACHING: Moderate (may update occasionally)
   */
  files: {
    /** Root files directory */
    root: string;
    /** Static markdown documents */
    markdown: string;
    /** Static PDF documents (terms, privacy, etc.) */
    pdf: string;
  };
}
