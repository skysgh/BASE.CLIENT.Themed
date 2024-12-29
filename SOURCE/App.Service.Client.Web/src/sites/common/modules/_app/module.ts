// Import Ag:
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Routing:
import { RouterModule, Routes } from '@angular/router';
// Import Auth:
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
// Import Language:
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// Cookies:
import { CookieService } from 'ngx-cookie-service';
// Import Store:
import { rootReducer } from '../../store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// Import Effects:
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { PagesModule } from "./pages/pages.module";
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { PdfViewerModule } from 'ng2-pdf-viewer';


// Import Template:
import { AppRoutingModule } from './routing';
import { BaseRouterOutletComponent } from './components/_routerOutlet/component';

import { BaseCoreLayoutsModule } from "../layouts/layouts.module";


// Core Env:
import { environment } from '../../../../environments/environment';
// Core Constants:
import { system } from '../../../../core/constants/system';
// Core Utilities:
import { initFirebaseBackend } from '../../../../core/utilities/authUtils';
// Core Helpers:
import { FakeBackendInterceptor } from '../../../../core.ui/interceptors/fake-backend.interceptor';
import { ErrorInterceptor } from '../../../../core.ui/interceptors/http-response-error.interceptor';
import { JwtInterceptor } from '../../../../core.ui/interceptors/jwt-bearertoken.interceptor';
// Core Store:
import { AuthenticationEffects } from '../../store/Authentication/authentication.effects';
// Core Services:
import { SystemService } from '../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

// Theme Layouts:
import { AppLayoutComponent } from '../layouts/layout.component';

// Nested Modules:
import { BaseCoreCommonModule } from '../common/module';
// import { BaseCoreCommonComponentsModule } from '../common/components/module';
import { TranslationService } from '../../../../core/services/translation.service';
import { LoggingInterceptor } from '../../../../core.ui/interceptors/logger.interceptor';

// export function createTranslateLoader(http: HttpClient): any {
//   let path :string = system.sources.assets.public.static.core.i18n;
// 
//   return new TranslateHttpLoader(http, path , '.json');
// }
export function createTranslateLoader(http: HttpClient): any {

  // Note:
  // This method is *outside* the class!
  // This is presumably because it is referenced and invoked by the
  // metadata describing the class, as oppossed to its
  // constructor

  // Specify paths where to look for resources:
  let path: string = system.sources.assets.public.static.core.i18n;
  let path2: string = system.sources.assets.public.static.template.i18n;
  let path3: string = system.sources.assets.public.static.app.i18n;
  let paths: string[] = [path, path2, path3];

  // As it is outside the class
  // there is no instance yet of TranslationService
  // and can't invoke it's constructor which depends on
  // other services that are as yet not instantiated.
  // Same for the SystemService from which one derives
  // constants, which in turn describe where assets are.
  // So:
  // Call static method on service that will be part of all services later.
  return TranslationService.createTranslateLoader(http, paths);

}

// By default, the method invokes 
if (environment.defaultauth === 'firebase') {
  initFirebaseBackend(environment.firebaseConfig);
} else {
  FakeBackendInterceptor;
}



@NgModule({
  declarations: [
    BaseRouterOutletComponent
  ],
  imports: [

    TranslateModule.forRoot({
      // Set the first language
      // based on saved settings:
      defaultLanguage: getLanguageCode(),
      
      loader: {
        provide: TranslateLoader,
        // use our custom multiloader:
        useFactory: (createTranslateLoader),
        // inject into createTranslateLoader, as first argument:
        deps: [HttpClient]
      }
    }),

    StoreModule.forRoot(rootReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([
      AuthenticationEffects,
    ]),
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    //PdfViewerModule,
    // BaseCoreCommonModule in turn drags in BaseCoreUIModule.
    BaseCoreCommonModule,
    // BaseCoreCommonComponentsModule,
    BaseCoreLayoutsModule,
    //PagesModule


  ],
  exports: [
    RouterModule
  ],
  providers: [
    // This core.ui interceptor traces calls and their responses.
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },

    CookieService,
    provideHttpClient(),
    provideMarkdown({ loader: HttpClient }),
  ],
  bootstrap: [BaseRouterOutletComponent]
})
/**
 * Root AppModule.
 * 
 * Recommendation:
 * keep it named as the convention (AppModule),
 * but from here, it calls other modules and components that all start with
 * 'Base...'
 */
export class AppModule {
  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private translationService: TranslationService,
    private systemService: SystemService) {

    // Get the language code from the cookie
    this.diagnosticsTraceService.debug("AppModule.constructor()");


  }

}

function getLanguageCode() {
  const C_LANG = 'lang';

  var languageCookie:(string|undefined) = document.cookie
    .split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(C_LANG + '='));
  if (languageCookie) {
    // Extract the language value after "lang="
    languageCookie = languageCookie.substring(C_LANG.length+1); // "lang=".length = 5
  }
  var result = (languageCookie || navigator.language || system.dynamic.configuration.defaultLanguageCode).split('-')[0];
  return result;
}
