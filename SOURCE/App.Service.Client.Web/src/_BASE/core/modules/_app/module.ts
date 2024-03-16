// Import Ag:
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Import Template:
import { AppRoutingModule } from './routing.module';
import { AppROComponent } from './ui/component';

import { LayoutsModule } from "../../../../app/layouts/layouts.module";
//import { PagesModule } from "./pages/pages.module";

// Auth
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../../../../environments/environment';
import { initFirebaseBackend } from '../../../../app/authUtils';
import { FakeBackendInterceptor } from '../../../../app/core/helpers/fake-backend';
import { ErrorInterceptor } from '../../../../app/core/helpers/error.interceptor';
import { JwtInterceptor } from '../../../../app/core/helpers/jwt.interceptor';

// Language
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// Store
import { rootReducer } from '../../../../app/store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';


import { AuthenticationEffects } from '../../../../app/store/Authentication/authentication.effects';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from '../../../../app/layouts/layout.component';
import { CookieService } from 'ngx-cookie-service';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader( http, 'assets/i18n/', '.json');
}

if (environment.defaultauth === 'firebase') {
  initFirebaseBackend(environment.firebaseConfig);
} else {
  FakeBackendInterceptor;
}
export function defaultLanguageFactory(cookieService: CookieService): string {
  const languageCode = cookieService.get('languageCode') || 'en'; // Retrieve language code from cookie, default to 'en'
  return languageCode;
}


@NgModule({
  declarations: [
    AppROComponent
  ],
  imports: [

    TranslateModule.forRoot({
      defaultLanguage: '__',
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
    LayoutsModule
    //PagesModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
    { provide: 'defaultLanguage', useFactory: defaultLanguageFactory, deps: [CookieService] },
    CookieService,
  ],
  bootstrap: [AppROComponent]
})
export class AppModule {
  constructor(private cookieService: CookieService) {
    // Get the language code from the cookie
    //const languageCode = this.cookieService.get('languageCode') || 'en';
    //TranslateModule.forRoot().providers.push({ provide: 'defaultLanguageCode', useValue: languageCode});

  }
}
