// Import Ag:
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Import Template:
import { AppRoutingModule } from './routing';
import { BaseRouterOutletComponent } from './components/_routerOutlet/component';

import { BaseCoreLayoutsModule } from "../layouts/layouts.module";
//import { PagesModule } from "./pages/pages.module";
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
// Auth
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../../../../environments/environment';
import { initFirebaseBackend } from '../../../../app/authUtils';
import { FakeBackendInterceptor } from '../../helpers/fake-backend';
import { ErrorInterceptor } from '../../helpers/error.interceptor';
import { JwtInterceptor } from '../../helpers/jwt.interceptor';

// Language
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// Store
import { rootReducer } from '../../store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';


import { AuthenticationEffects } from '../../store/Authentication/authentication.effects';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from '../layouts/layout.component';
import { CookieService } from 'ngx-cookie-service';
import { SystemService } from '../../services/system.service';
import { DiagnosticsTraceService } from '../../services/diagnostics.service';

import { system } from '../../constants/system';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BaseCoreCommonModule } from '../common/module';
import { BaseCoreCommonComponentsModule } from '../common/components/module';
import { TranslationService } from '../../services/translation.service';
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader( http, 'assets/i18n/', '.json');
}

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
      defaultLanguage: getLanguageCode(),
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
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
    BaseCoreCommonModule,
    BaseCoreCommonComponentsModule,
    BaseCoreLayoutsModule,
    //PagesModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
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
    private diagnosticsTraceService: DiagnosticsTraceService,
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
  var result = (languageCookie || navigator.language || system.configuration.defaultLanguageCode).split('-')[0];
  return result;
}
