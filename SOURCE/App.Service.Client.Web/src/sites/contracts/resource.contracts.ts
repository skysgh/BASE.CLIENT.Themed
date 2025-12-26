/**
 * Site Resource Path Contracts
 * 
 * Defines the interface for resource paths needed by Sites tier components.
 * 
 * ARCHITECTURE:
 * - Sites tier defines contracts (what it needs)
 * - Apps.Main provides implementation (concrete paths)
 * - Sites components consume via DI (injection)
 * 
 * RATIONALE FOR PLACEMENT:
 * - Sites components consume resources, so Sites defines the contract
 * - Follows "consumer defines interface" SOLID principle
 * - Avoids CLI-managed apps/ directory (safe from scaffolding overwrites)
 * - Enables Sites extraction as reusable library
 * 
 * USAGE:
 * ```typescript
 * // In component:
 * import { ResourcePaths } from '../../contracts';
 * constructor(@Inject(RESOURCE_PATHS) public resources: ResourcePaths) {}
 * 
 * // In template:
 * <img src="{{resources.logos.light}}" alt="logo">
 * ```
 */

/**
 * Resource paths for logos, images, and files.
 * 
 * Consumed by Sites components, provided by Apps.Main.
 */
export interface ResourcePaths {
  /**
   * Logo image paths (light/dark variants)
   */
  logos: {
    /** Light theme logo (on dark background) */
    light: string;
    /** Dark theme logo (on light background) */
    dark: string;
  };
  
  /**
   * Common image paths organized by category
   */
  images: {
    /** Root images directory */
    root: string;
    /** Trusted by / partner logos */
    trustedBy: string;
    /** Country/language flags */
    flags: string;
    /** Background images */
    backgrounds: string;
  };
  
  /**
   * File resource paths (PDFs, markdown, etc.)
   */
  files: {
    /** Root files directory */
    root: string;
    /** Markdown documents */
    markdown: string;
    /** PDF documents */
    pdf: string;
  };
}
