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
import { BaseAppsModule } from '../sites.app/module';
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';

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

  var result = (languageCookie || navigator.language || appsConfiguration.others.core.defaultLanguageCode).split('-')[0];

  return result;
}


/**
 * Method called from within Module metadata to create a loader
 * of the json files required.
 * 
 * Does not need langCode yet as it doesn't load them, just defines
 * the directories where to retrieve from.
 *
 * the function is `export`ed because it is called from outside the module
 * at one point (forget where).
 *
 *  TODO: TO REDO IN THE FUTURE.
 * This bugs me in that this method needs to know where the assets are
 * so it defeats pluggability. 
 * 
 * Note that it is called by metadata
 * *before* class is instantiated, so must
 * be a static method outside the Module's class.
 * @param http
 * @returns
 */
export function createTranslateLoader(http: HttpClient): any {

  // Specify paths where to look for resources:
  let path: string = appsConfiguration.others.core.constants.assets.i18n;
  let path2: string = appsConfiguration.others.themes.current.constants.assets.i18n;
  let path3: string = appsConfiguration.constants.assets.i18n!;
  let path4: string = appsConfiguration.others.sites.constants.assets.i18n || '';

  let paths: string[] = [path, path2, path3];
  
  // Only add sites i18n if it exists
  if (path4) {
    paths.push(path4);
  }

  // Call static method on service that will be part of all services later.
  return TranslationService.createTranslateLoader(http, paths);

}
