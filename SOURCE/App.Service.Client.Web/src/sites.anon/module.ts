import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// ✅ Config Registry
import { ConfigRegistryService } from "../core/services/config-registry.service";

// ✅ Import DI tokens to provide
import { DEPLOYED_RESOURCES } from "./tokens/deployed-resource.tokens";
import { PUBLIC_NAVIGATION } from "./tokens/public-navigation.tokens";
import { UPLOADED_RESOURCES } from "./tokens/uploaded-resource.tokens";

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
          // ✅ Direct access - structure is flat, not nested under 'deployed'
          light: (sitesConstants.assets.images.pages?.home?.root || sitesConstants.assets.images.root) + 'logos/logo-light.png',
          dark: (sitesConstants.assets.images.pages?.home?.root || sitesConstants.assets.images.root) + 'logos/logo-dark.png'
        },
        images: {
          root: sitesConstants.assets.images.root,
          trustedBy: sitesConstants.assets.images.pages?.home?.trustedBy || sitesConstants.assets.images.root + 'trustedby/',
          flags: sitesConstants.assets.images.root + 'flags/',
          backgrounds: sitesConstants.assets.images.root + 'backgrounds/'
        },
        files: {
          root: sitesConstants.assets.root + 'files/',
          markdown: sitesConstants.assets.root + 'files/markdown/',
          pdf: sitesConstants.assets.root + 'files/pdf/'
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
    },
    
    {
      provide: UPLOADED_RESOURCES,
      useValue: {
        users: {
          root: '/assets/media/sensitive/',
          profiles: '/assets/media/sensitive/images/users/',
          avatars: '/assets/media/sensitive/images/users/'
        },
        documents: {
          root: '/assets/media/sensitive/documents/',
          attachments: '/assets/media/sensitive/documents/attachments/',
          uploads: '/assets/media/sensitive/documents/uploads/'
        },
        media: {
          root: '/assets/media/sensitive/media/',
          photos: '/assets/media/sensitive/media/photos/',
          videos: '/assets/media/sensitive/media/videos/'
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
