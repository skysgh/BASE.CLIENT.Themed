// Ag:
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, InjectionToken, APP_INITIALIZER} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from '@angular/router';

// ✅ Config Registry Service
import { ConfigRegistryService } from "../core/services/config-registry.service";

// Services:
import { EnvConfigService } from "../core/services/env-config.service";

// Components:
import { BaseRouterOutletComponent } from "./components/_routerOutlet/component";
import { AppExtensionModule } from "../core.ag/_app_extension/module";

import { SystemConfigurationService } from "../core/services/configuration.service";
import { ObjectService } from "../core/services/object.service";

/**
 * Environment Configuration Initializer
 * 
 * Loads environment configuration BEFORE app renders.
 * Runs during APP_INITIALIZER phase.
 */
export function initializeEnvConfig(
  envConfig: EnvConfigService
): () => Promise<void> {
  return () => envConfig.initialize();
}

@NgModule({
  declarations: [
    BaseRouterOutletComponent
  ],
  providers: [
    ObjectService,

    SystemConfigurationService,

    // ✅ Configuration Registry Service
    // Modules self-register when they load
    ConfigRegistryService,

    // ✅ Initialize environment configuration before app starts
    {
      provide: APP_INITIALIZER,
      useFactory: initializeEnvConfig,
      deps: [EnvConfigService],
      multi: true
    },

    // ============================================================================
    // ✅ OLD PROVIDERS REMOVED!
    // 
    // Tokens now provided by tier modules themselves:
    // - DEPLOYED_RESOURCES: Provided by Apps.Main module
    // - UPLOADED_RESOURCES: Provided by Apps.Main module
    // - API_ENDPOINTS: Provided by Apps.Main module
    // - PUBLIC_NAVIGATION: Provided by Apps.Main module
    // - PRIVATE_NAVIGATION: Provided by Apps.Main module
    // 
    // This decouples Bootstrap from Sites/Apps tiers!
    // ============================================================================
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppExtensionModule
  ],
  exports: [
    RouterModule,
    AppExtensionModule,
    BaseRouterOutletComponent
  ],
  bootstrap: [
    BaseRouterOutletComponent
  ]
})
/**
 * Root AppModule (Bootstrap)
 * 
 * Purpose:
 * Ultra-thin bootstrap layer. Provides core services and initializers ONLY.
 * 
 * ✅ DECOUPLED: No imports from Sites/Apps tiers!
 * ✅ TOKEN PATTERN: Tokens provided by tier modules
 * ✅ CONFIG REGISTRY: Modules self-register configuration
 * 
 * Architecture:
 * - Bootstrap provides services only
 * - Apps.Main module provides tokens (DEPLOYED_RESOURCES, etc.)
 * - Each tier registers config via ConfigRegistryService
 * - Components inject tokens or use ConfigRegistryService
 * 
 * Benefits:
 * ✅ Zero coupling (Bootstrap doesn't know about tiers)
 * ✅ Lazy-load compatible (modules provide when loaded)
 * ✅ Type-safe (tokens have interfaces)
 * ✅ Testable (mock tokens or registry)
 */
export class AppModule {
  constructor(
    private configRegistryService: ConfigRegistryService
  ) {
    console.log('🚀 [AppModule] Bootstrap initialized');
    console.log('✅ [AppModule] ConfigRegistryService available');
    
    // ✅ REGISTER: Apps configuration
    // Note: This is a temporary measure until Apps.Main module registers itself
    // For now, register a minimal config to prevent AuthGuard errors
    this.configRegistryService.register('apps', {
      navigation: {
        auth: {
          login: '/auth/login'
        }
      },
      others: {
        core: {
          constants: {
            storage: {
              session: {
                currentUser: 'currentUser',
                authUser: 'authUser'
              }
            }
          }
        }
      }
    });
    
    console.log('✅ [AppModule] Registered minimal apps config (fallback)');
    console.log('✅ [AppModule] Zero coupling - No tier imports!');
  }
}

