// Import Ag:
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
// Routing:
import { RouterModule, Routes } from '@angular/router';
// Import Auth:
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
// Import Language:
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// Import Store:
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// Import Effects:
//import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Core Env:
import { environment } from '../../environments/environment';

// Core Services:
import { SystemDefaultServices } from '../../core/services/system.default-services.service';

// Services:
import { CookieService } from '../../core/services/cookie.service';
import { TranslationService } from '../../core/services/translation.service';

// Modules:
import { BaseCoreAgModule } from '../module';
import { AppExtensionRoutingModule } from './routing';
import { BaseThemesModule } from '../../themes/module';
// ✅ UPDATED: Correct path depth (../../ not ../) after tier restructuring
import { BaseAppsModule } from '../../sites.app/module';

// Theme-specific state management
import { authenticationReducer } from '../../themes/t1/_state/authentication/authentication.reducer';


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    //BaseRouterOutletComponent
  ],
  providers: [
    CookieService,
    provideHttpClient(),
  ],
  imports: [
    // *******************************************************
    // *******************************************************
    // WARNING:
    // WHAT THIS MODULE DOESN'T DO IS IMPORT THE PARENT MODULE
    // (AppModule).
    // ie, this module is for all intents and purposes the
    // 'top/entry' point of the stack of modules.
    // *******************************************************
    // *******************************************************

    HttpClientModule,
    // NOTE: the root module is the only module that imports BrowserModule.
    // All other Modules import CommonModule (from which BrowserModule is derived).
    BrowserModule,
    // Extended version of BrowserModule:
    BrowserAnimationsModule,


    // Get presentation langauge packs sorted:
    TranslateModule.forRoot({
      // Set the first language
      // based on saved settings:
      defaultLanguage: getLanguageCode(),
      //defines the loader:
      loader: {
        provide: TranslateLoader,
        // use our method to create our custom multiloader:
        useFactory: (createTranslateLoader),
        // the method depends on services, etc. so
        // inject into createTranslateLoader, as first argument:
        deps: [HttpClient]
      }
    }),

    // Initialize root store
    StoreModule.forRoot({}),

    // Register theme-specific authentication feature state
    // (moved from CoreAg module to keep Core/CoreAg theme-independent)
    StoreModule.forFeature('authentication', authenticationReducer),

    // MUST be registered *after* storeModule has been registered.
    // BUT won't show state of lazy loaded modules until they are loaded.
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),


    // Import the routes module, which defines routes
    // and lazy loads feature modules as needed
    AppExtensionRoutingModule,

    BaseAppsModule

  ],
  exports: [
    RouterModule,
    BaseAppsModule
  ]
  // IMPORTANT:
  // The bootstrap attribute cannot be moved out of AppModule.
})
export class AppExtensionModule {

  /**
   * Constructor.
   *
   * Notice that one can already inject services
   * (this was setup earlier).
   * @param defaultServices
   * @param translationService
   */
  constructor(
    private defaultServices: SystemDefaultServices) {

    this.defaultServices.diagnosticsTraceService.debug("AppModule.constructor()");
  }

}


/**
 * Get initial language code from existing cookie,
 * falling back to the browser's navigator language settings
 * if not found.
 * Used to set the language pack.
 * 
 * Note that it is called by metadata
 * *before* class is instantiated, so must
 * be a static method outside the Module's class.
 * @returns
 */

function getLanguageCode() {

  const C_LANG = 'lang';

  var languageCookie: (string | undefined) = CookieService.getCookieValue(C_LANG);

  // ✅ FIXED: Use hardcoded default 'en' instead of cross-tier import
  var result = (languageCookie || navigator.language || 'en').split('-')[0];

  return result;
}


/**
 * ✅ FIXED: Convention-based i18n loader
 * 
 * Creates a MultiTranslateLoader that loads translation files from multiple tiers
 * following the convention: /assets/{tier}/deployed/i18n/{lang}.json
 * 
 * Architecture Benefits:
 * - ✅ No cross-tier imports (loosely coupled)
 * - ✅ Convention over configuration (predictable paths)
 * - ✅ Follows angular.json asset mapping structure
 * - ✅ Each tier can be removed without breaking others
 * - ✅ Cascading translations (later paths override earlier ones)
 * 
 * Path Convention:
 * - Core tier:       /assets/core/deployed/i18n/
 * - Theme tier:      /assets/deployed/i18n/           (themes/t1 → assets/)
 * - Sites.anon tier: /assets/sites.anon/deployed/i18n/
 * - Sites.app tier:  /assets/sites.app/deployed/i18n/
 * 
 * Note: MultiTranslateLoader is fault-tolerant - missing files return empty object (no error)
 * 
 * @param http HttpClient for loading translation files
 * @returns TranslateLoader instance configured with convention-based paths
 */
export function createTranslateLoader(http: HttpClient): any {

  // ✅ Convention-based paths (no configuration imports needed!)
  // These paths match the angular.json asset mappings
  const paths: string[] = [
    '/assets/core/deployed/i18n',           // Core tier (base translations)
    '/assets/deployed/i18n',                 // Theme tier (theme-specific translations)
    '/assets/sites.anon/deployed/i18n',     // Sites.anon tier (public site translations)
    '/assets/sites.app/deployed/i18n'      // Sites.app tier (authenticated site translations)
  ];

  // Call static method on service that will be part of all services later.
  return TranslationService.createTranslateLoader(http, paths);

}
