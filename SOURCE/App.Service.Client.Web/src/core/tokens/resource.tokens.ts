import { InjectionToken } from '@angular/core';

/**
 * Deployed Resources Interface
 * 
 * Defines the shape of deployed static resources (logos, images, files)
 * that are bundled with the application at build time.
 * 
 * Architecture:
 * - Defined in: Core tier (lowest level - interface only)
 * - Provided in: Apps.Bootstrap tier (concrete paths)
 * - Consumed in: Theme/Sites tiers (via injection)
 * 
 * Benefits:
 * ✅ No cross-tier coupling (themes don't import from apps)
 * ✅ Testable (easy to mock in unit tests)
 * ✅ Flexible (different paths per environment)
 * ✅ Type-safe (TypeScript autocomplete works)
 */
export interface DeployedResources {
  /** Logo images used in navigation and branding */
  logos: {
    /** Light theme logo (for dark backgrounds) */
    light: string;
    /** Dark theme logo (for light backgrounds) */
    dark: string;
    /** Small logo (used in collapsed sidebars) */
    sm: string;
  };
  
  /** General images (backgrounds, icons, etc.) */
  images: {
    /** Root path for images */
    root: string;
    /** Trusted by / partner logos */
    trustedBy: string;
    /** Country/language flags */
    flags: string;
    /** Background images */
    backgrounds: string;
  };
  
  /** Static files (documents, PDFs, etc.) */
  files: {
    /** Root path for files */
    root: string;
    /** Markdown documentation files */
    markdown: string;
    /** PDF documents */
    pdf: string;
  };
}

/**
 * DEPLOYED_RESOURCES Injection Token
 * 
 * Use this token to inject deployed resource paths into components.
 * 
 * Convention-based default paths:
 * - Logos: /assets/apps.bootstrap/media/open/images/logos/
 * - Images: /assets/apps.bootstrap/media/open/images/
 * - Files: /assets/apps.bootstrap/media/open/files/
 * 
 * Override in apps.bootstrap module if custom paths needed.
 * 
 * Example usage in component:
 * ```typescript
 * constructor(@Inject(DEPLOYED_RESOURCES) public resources: DeployedResources) {}
 * ```
 * 
 * Example usage in template:
 * ```html
 * <img [src]="resources.logos.dark" alt="logo">
 * ```
 */
export const DEPLOYED_RESOURCES = new InjectionToken<DeployedResources>(
  'deployed.resources',
  {
    providedIn: 'root',
    factory: () => ({
      // ✅ Convention-based default paths
      // These match angular.json asset mappings
      logos: {
        light: '/assets/apps.bootstrap/media/open/images/logos/logo-light.png',
        dark: '/assets/apps.bootstrap/media/open/images/logos/logo-dark.png',
        sm: '/assets/apps.bootstrap/media/open/images/logos/logo-sm.png'
      },
      images: {
        root: '/assets/apps.bootstrap/media/open/images/',
        trustedBy: '/assets/apps.bootstrap/media/open/images/trustedBy/',
        flags: '/assets/core/deployed/images/flags/',
        backgrounds: '/assets/apps.bootstrap/media/open/images/backgrounds/'
      },
      files: {
        root: '/assets/apps.bootstrap/media/open/files/',
        markdown: '/assets/apps.bootstrap/media/open/files/markdown/',
        pdf: '/assets/apps.bootstrap/media/open/files/pdf/'
      }
    })
  }
);
