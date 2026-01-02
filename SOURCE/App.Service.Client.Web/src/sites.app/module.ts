// This is the base module for
// applications.

// NOTE:
// REferenced from src/app-routing.module.ts
// which lazy loads it with `LayoutComponent`
// which essnetially is router-outlet embedded
// in a vertical/horizontal/other layout.


// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// ✅ Config Registry
import { ConfigRegistryService } from '../core/services/config-registry.service';

// ✅ Sites.App DI Tokens (own tier tokens, not cross-tier import)
import { 
  APP_API_ENDPOINTS,
  APP_DEPLOYED_RESOURCES,
  APP_UPLOADED_RESOURCES,
  APP_PUBLIC_NAVIGATION,
  APP_PRIVATE_NAVIGATION 
} from './tokens';

// Other dependencies:
import { BaseThemesV1Module } from '../themes/t1/module';

// Services:
import { SystemDefaultServices } from '../core/services/system.default-services.service';
// Modules:
import { BaseAppsRoutingModule } from './routing';
//Components:
import { BaseAppsRouteComponent } from "./ui/_route/component";

// ✅ Use own tier constants (not cross-tier imports)
import { appsConstants } from './constants/implementations/apps.constants';
import { appsConfiguration } from './configuration/implementations/apps.configuration';
import { appsMainConstants } from '../apps.bootstrap/constants/implementations/apps.main.constants';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    BaseAppsRouteComponent
  ],
  providers: [
    // ✅ Language service now from system applet (providedIn: 'root')

    // ============================================================================
    // ✅ DI TOKEN PROVIDERS
    // 
    // Uses APP_ prefixed tokens (own tier, not cross-tier imports).
    // Implements interfaces defined in parent sites/types/tokens.types.ts
    // ============================================================================

    // DEPLOYED RESOURCES
    {
      provide: APP_DEPLOYED_RESOURCES,
      useValue: {
        logos: {
          light: `${appsMainConstants.resources.open.images.logos}logo-light.png`,
          dark: `${appsMainConstants.resources.open.images.logos}logo-dark.png`
        },
        images: {
          root: appsMainConstants.resources.open.images.root,
          trustedBy: appsMainConstants.resources.open.images.trustedBy,
          flags: appsMainConstants.resources.open.images.flags,
          backgrounds: appsMainConstants.resources.open.images.backgrounds
        },
        files: {
          root: appsMainConstants.resources.open.files.root,
          markdown: appsMainConstants.resources.open.files.markdownDir,
          pdf: appsMainConstants.resources.open.files.pdfDir
        }
      }
    },

    // UPLOADED RESOURCES
    {
      provide: APP_UPLOADED_RESOURCES,
      useValue: {
        users: {
          root: appsConstants.resources.sensitive.root,
          // ✅ Use bracket notation for properties from index signature
          profiles: appsConstants.resources.sensitive.images['users'],
          avatars: appsConstants.resources.sensitive.images['users']
        },
        documents: {
          root: appsConstants.resources.sensitive.root,
          attachments: appsConstants.resources.sensitive.root + 'documents/attachments/',
          uploads: appsConstants.resources.sensitive.root + 'documents/uploads/'
        },
        media: {
          root: appsConstants.resources.sensitive.root + 'media/',
          photos: appsConstants.resources.sensitive.root + 'media/photos/',
          videos: appsConstants.resources.sensitive.root + 'media/videos/'
        }
      }
    },

    // API ENDPOINTS
    {
      provide: APP_API_ENDPOINTS,
      useValue: {
        brochure: appsConstants.apis.root,
        persons: appsConstants.apis.root,
        pricing: appsConstants.apis.root,
        products: appsConstants.apis.root,
        service: appsConstants.apis.root
      }
    },

    // PUBLIC NAVIGATION
    {
      provide: APP_PUBLIC_NAVIGATION,
      useValue: {
        root: appsConfiguration.navigation.root,
        home: appsConfiguration.navigation.home,
        auth: {
          root: appsConfiguration.navigation.auth.root,
          signup: appsConfiguration.navigation.auth.signup,
          signin: appsConfiguration.navigation.auth.signin,
          forgotPassword: '/auth/forgot-password',
          resetPassword: '/auth/reset-password',
          verifyEmail: '/auth/verify-email'
        },
        landing: {
          root: '/',
          home: '/',
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

    // PRIVATE NAVIGATION
    {
      provide: APP_PRIVATE_NAVIGATION,
      useValue: {
        up: appsConfiguration.navigation.up,
        public: {
          root: appsConfiguration.navigation.root,
          home: appsConfiguration.navigation.home,
          auth: {
            root: appsConfiguration.navigation.auth.root,
            signup: appsConfiguration.navigation.auth.signup,
            signin: appsConfiguration.navigation.auth.signin,
            forgotPassword: '/auth/forgot-password',
            resetPassword: '/auth/reset-password',
            verifyEmail: '/auth/verify-email'
          },
          landing: {
            root: '/',
            home: '/',
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
        },
        auth: {
          signout: appsConfiguration.navigation.auth.signout,
          lockscreen: appsConfiguration.navigation.auth.lockscreen
        },
        dashboards: {
          root: appsConfiguration.navigation.dashboards.root,
          main: appsConfiguration.navigation.dashboards.main
        },
        settings: {
          root: appsConfiguration.navigation.settings.root,
          user: appsConfiguration.navigation.settings.user,
          account: appsConfiguration.navigation.settings.account
        },
        messages: {
          root: appsConfiguration.navigation.messages.root,
          inbox: '/messages/inbox'
        },
        teams: {
          root: '/teams'
        },
        purchases: {
          root: '/purchases'
        }
      }
    },
  ],
  imports: [
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    // Module specific:
    BaseAppsRoutingModule,
    // ❌ REMOVED: BaseCoreSitesModule (was cross-tier import from sites.anon)
    // sites.app should not depend on sites.anon
    // If shared functionality needed, put in parent sites/ tier
  ],
  exports: [
    RouterModule,
    // NO: Export Parent Module:
    // NO: ...
  ]
})
export class BaseAppsModule {

  /**
   * Constructor
   * @param defaultServices
   * @param configRegistryService - Config registry
   */
  constructor(
    private defaultServices: SystemDefaultServices,
    configRegistryService: ConfigRegistryService
  ) {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    
    // ✅ Register Apps config in registry
    configRegistryService.register('apps', {
      constants: appsConstants,
      configuration: appsConfiguration
    });
    
    console.log('✅ [BaseAppsModule] Tokens provided (APP_DEPLOYED_RESOURCES, APP_API_ENDPOINTS, etc.)');
  }
}


