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

// ✅ Sites DI Tokens (defined by Sites, provided by Apps)
import { 
  API_ENDPOINTS,
  DEPLOYED_RESOURCES,
  UPLOADED_RESOURCES,
  PUBLIC_NAVIGATION,
  PRIVATE_NAVIGATION 
} from '../sites/tokens';

// Other dependencies:
import { BaseThemesV1Module } from '../themes/t1/module';

// Services:
import { SystemDefaultServices } from '../core/services/system.default-services.service';
import { ServiceLanguagesRepositoryService } from '../core/services/services/repositories/service-languages.repository.service';
import { ServiceLanguagesService } from '../core/services/service.languages.service';
// Modules:
import { BaseAppsRoutingModule } from './routing';
//Components:
import { BaseAppsRouteComponent } from "../apps/ui/_route/component";
import { BaseCoreSitesModule } from '../sites/module';

// ✅ Import apps/sites constants for token values
import { appsConstants } from './constants/implementations/apps.constants';
import { appsConfiguration } from './configuration/implementations/apps.configuration';
import { appsMainConstants } from '../apps.bootstrap/constants/implementations/apps.main.constants';
import { sitesConstantsApis } from '../sites/constants/implementations/sites.constants.apis';
import { sitesConstantsResources } from '../sites/constants/implementations/sites.constants.resources';
import { sitesConfigurationNavigation } from '../sites/configuration/implementation/sites.configuration.navigation';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseAppsRouteComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    ServiceLanguagesRepositoryService,
    ServiceLanguagesService,

    // ============================================================================
    // ✅ DI TOKEN PROVIDERS
    // 
    // These tokens are defined by Sites tier (consumer defines interface)
    // and provided here by Apps tier (provider implements interface).
    // 
    // This follows SOLID principles:
    // - Sites defines what it needs (token + interface)
    // - Apps provides the actual values
    // - Loose coupling via Dependency Inversion
    // ============================================================================

    // DEPLOYED RESOURCES (Static assets - logos, images, files)
    {
      provide: DEPLOYED_RESOURCES,
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

    // UPLOADED RESOURCES (User-generated content - profiles, documents, media)
    {
      provide: UPLOADED_RESOURCES,
      useValue: {
        users: {
          root: sitesConstantsResources.sensitive.root,
          profiles: sitesConstantsResources.sensitive.images.users,
          avatars: sitesConstantsResources.sensitive.images.users
        },
        documents: {
          root: sitesConstantsResources.sensitive.root,
          attachments: sitesConstantsResources.sensitive.root + 'documents/attachments/',
          uploads: sitesConstantsResources.sensitive.root + 'documents/uploads/'
        },
        media: {
          root: sitesConstantsResources.sensitive.root + 'media/',
          photos: sitesConstantsResources.sensitive.root + 'media/photos/',
          videos: sitesConstantsResources.sensitive.root + 'media/videos/'
        }
      }
    },

    // API ENDPOINTS
    {
      provide: API_ENDPOINTS,
      useValue: {
        brochure: sitesConstantsApis.brochure,
        persons: sitesConstantsApis.persons,
        pricing: sitesConstantsApis.pricing,
        products: sitesConstantsApis.products,
        service: sitesConstantsApis.service
      }
    },

    // PUBLIC NAVIGATION (No auth required)
    {
      provide: PUBLIC_NAVIGATION,
      useValue: {
        root: sitesConfigurationNavigation.root,
        home: sitesConfigurationNavigation.home,
        auth: {
          root: sitesConfigurationNavigation.auth.root,
          signup: sitesConfigurationNavigation.auth.signup,
          signin: sitesConfigurationNavigation.auth.signin,
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

    // PRIVATE NAVIGATION (Auth required)
    {
      provide: PRIVATE_NAVIGATION,
      useValue: {
        up: sitesConfigurationNavigation.up,
        public: {
          root: sitesConfigurationNavigation.root,
          home: sitesConfigurationNavigation.home,
          auth: {
            root: sitesConfigurationNavigation.auth.root,
            signup: sitesConfigurationNavigation.auth.signup,
            signin: sitesConfigurationNavigation.auth.signin,
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
          signout: sitesConfigurationNavigation.auth.signout,
          lockscreen: sitesConfigurationNavigation.auth.lockscreen
        },
        dashboards: {
          root: sitesConfigurationNavigation.dashboards.root,
          main: sitesConfigurationNavigation.dashboards.main
        },
        settings: {
          root: sitesConfigurationNavigation.settings.root,
          user: sitesConfigurationNavigation.settings.user,
          account: sitesConfigurationNavigation.settings.account
        },
        messages: {
          root: sitesConfigurationNavigation.messages.root,
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
    // Upstream: on Sites, which imports Themes, which imports Core.Ag. 
    BaseCoreSitesModule
    // Import Parent Module:
    // N/A
    // Child Modules:
    // N/A
    // Child Components:
    // N/A
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
    
    console.log('✅ [BaseAppsModule] Tokens provided (DEPLOYED_RESOURCES, API_ENDPOINTS, etc.)');
  }
}


