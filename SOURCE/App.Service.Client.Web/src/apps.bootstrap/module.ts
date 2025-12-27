// Ag:
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, InjectionToken, APP_INITIALIZER} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';

// ✅ Config Registry Service
import { ConfigRegistryService } from "../core/services/config-registry.service";

// Services:
import { EnvConfigService } from "../core/services/env-config.service";
import { AccountService } from "../core/services/account.service";

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

/**
 * Account Configuration Initializer
 * 
 * Detects account from URL and loads account-specific configuration
 * BEFORE app renders. Runs during APP_INITIALIZER phase.
 * 
 * Multi-Account Support:
 * - Path-based: example.com/foo → account 'foo'
 * - Subdomain: foo.example.com → account 'foo'
 * - Default: example.com → account 'default'
 * 
 * Architecture:
 * 1. Detect account ID from URL
 * 2. Load /assets/config/default.json (base config)
 * 3. Load /assets/accounts/{accountId}/config.json (account overrides)
 * 4. Mark _accountNotFound if config not found
 * 5. ✅ AccountGuard handles redirect to 404-A (not here!)
 * 6. Cascade merge: default → account
 * 7. Make config available via AccountService
 */
export function initializeAccount(
  accountService: AccountService
): () => Promise<void> {
  return async () => {
    await accountService.initialize();
    
    // ✅ REMOVED: Redirect logic (now handled by AccountGuard)
    // AccountGuard runs when route activates and checks isAccountNotFound()
    // This allows proper Angular routing and guards to work
  };
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

    // ✅ Initialize account configuration before app starts
    // This MUST run early so components can access account config
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAccount,
      deps: [AccountService],
      multi: true
    },

    // ============================================================================
    // ✅ MULTI-ACCOUNT ARCHITECTURE:
    // 
    // Components no longer use static configuration!
    // Instead they inject AccountService for runtime account-aware config:
    // 
    // OLD (Static):
    //   public appsConfiguration = appsConfiguration  // ❌ Cross-tier coupling
    //   <img src="{{appsConfiguration.constants.resources.logos}}logo.png">
    // 
    // NEW (Multi-Account):
    //   constructor(private accountService: AccountService) {}
    //   this.logoUrl$ = this.accountService.getConfigValue('branding.logo')
    //   <img [src]="logoUrl$ | async">
    // 
    // Benefits:
    // ✅ Runtime account switching
    // ✅ URL-based account detection
    // ✅ Cascading configuration (default → account)
    // ✅ No cross-tier coupling
    // ✅ Testable (mock AccountService)
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
 * ✅ MULTI-ACCOUNT: AccountService provides runtime config
 * ✅ CONFIG REGISTRY: Modules self-register configuration
 * 
 * Architecture:
 * - Bootstrap provides core services (AccountService, EnvConfigService)
 * - AccountService loads account config at runtime from URL
 * - Components inject AccountService (not static config)
 * - Each account has isolated config (/assets/accounts/{accountId}/)
 * 
 * Benefits:
 * ✅ Zero coupling (Bootstrap doesn't know about tiers)
 * ✅ Multi-account support (runtime account detection)
 * ✅ Cascading config (default → account override)
 * ✅ Type-safe (AccountConfig interface)
 * ✅ Testable (mock AccountService)
 */
export class AppModule {
  constructor(
    private configRegistryService: ConfigRegistryService,
    private accountService: AccountService
  ) {
    console.log('🚀 [AppModule] Bootstrap initialized');
    console.log('✅ [AppModule] ConfigRegistryService available');
    console.log(`✅ [AppModule] Multi-account mode - Current account: ${accountService.getAccountId()}`);
    
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
          constants:
           {
              storage:
               {
                  session:
                   {
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

