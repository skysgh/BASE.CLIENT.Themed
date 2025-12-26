import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// ✅ Config Registry
import { ConfigRegistryService } from "../core/services/config-registry.service";

// ✅ Import DI tokens to provide
import { DEPLOYED_RESOURCES } from "./tokens/deployed-resource.tokens";
import { PUBLIC_NAVIGATION } from "./tokens/public-navigation.tokens";

// Parent Module:
import { BaseThemesModule } from "../themes/module";
import { sitesConfiguration } from "./configuration/implementation/sites.configuration";

// ✅ Import sites constants for registration and token values
import { sitesConstants } from "./constants/implementations/sites.constants";


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
  ],
  providers: [
    // ============================================================================
    // ✅ DI TOKEN PROVIDERS
    // 
    // NOTE: DEPLOYED_RESOURCES now uses providedIn: 'root' in its token definition
    // so it's automatically available everywhere. No explicit provider needed here.
    // 
    // If you need to override default values, provide it here:
    // {
    //   provide: DEPLOYED_RESOURCES,
    //   useValue: { /* custom values */ }
    // }
    // ============================================================================
    {
      provide: DEPLOYED_RESOURCES,
      useValue: {
        logos: {
          // ✅ Use bracket notation for properties from index signature
          light: sitesConstants.assets['deployed'].images.logos + 'logo-light.png',
          dark: sitesConstants.assets['deployed'].images.logos + 'logo-dark.png'
        },
        images: {
          root: sitesConstants.assets['deployed'].images.root,
          trustedBy: sitesConstants.assets['deployed'].images.trustedBy,
          flags: sitesConstants.assets['deployed'].images.flags,
          backgrounds: sitesConstants.assets['deployed'].images.backgrounds
        },
        files: {
          root: sitesConstants.assets['deployed'].files.root,
          markdown: sitesConstants.assets['deployed'].files.markdownDir || sitesConstants.assets['deployed'].files.root + 'markdown/',
          pdf: sitesConstants.assets['deployed'].files.pdfDir || sitesConstants.assets['deployed'].files.root + 'pdf/'
        }
      }
    },
    
    {
      provide: PUBLIC_NAVIGATION,
      useValue: {
        root: sitesConfiguration.navigation.root,
        home: sitesConfiguration.navigation.home,
        auth: {
          root: sitesConfiguration.navigation.auth.root,
          signup: sitesConfiguration.navigation.auth.signup,
          signin: sitesConfiguration.navigation.auth.signin,
          forgotPassword: '/auth/forgot-password',
          resetPassword: '/auth/reset-password',
          verifyEmail: '/auth/verify-email'
        },
        landing: {
          root: '/landing',
          home: '/landing',
          pricing: '/landing/pricing',
          features: '/landing/features',
          testimonials: '/landing/testimonials',
          faq: '/landing/faq',
          contact: '/landing/contact'
        },
        information: {
          root: '/information',
          about: '/information/about',
          terms: '/information/terms',
          privacy: '/information/privacy',
          cookies: '/information/cookies',
          accessibility: '/information/accessibility',
          contact: '/information/contact'
        },
        support: {
          root: '/support',
          faq: '/support/faq',
          contact: '/support/contact',
          status: '/support/status'
        },
        errors: {
          notFound: '/errors/404',
          serverError: '/errors/500',
          forbidden: '/errors/403'
        }
      }
    }
  ],
  imports: [
    CommonModule,
    BaseThemesModule,
  ],
  exports: [
    BaseThemesModule,
  ]

})
/**
 * Base Sites Module
 * 
 * ✅ DECOUPLED: No longer imports appsConfiguration
 * 
 * Breaking change: Removed public appsConfiguration property.
 * Components should use ConfigRegistryService instead.
 * 
 * Benefits:
 * ✅ No circular dependency (Sites no longer imports Apps)
 * ✅ Proper tier architecture
 * ✅ Modules are not config providers
 */
export class BaseCoreSitesModule {
  // ❌ REMOVED: public appsConfiguration = appsConfiguration
  // Components should use ConfigRegistryService instead
  
  // ✅ KEEP: Expose parent configuration (Sites owns this)
  public groupConfiguration = sitesConfiguration

  /**
   * ✅ Register Sites config
   * 
   * Registers sites configuration including:
   * - Navigation paths
   * - API endpoints
   * - Resource paths (deployed/uploaded)
   * - Assets
   */
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('sites', {
      constants: sitesConstants,
      configuration: sitesConfiguration
    });
  }
}
