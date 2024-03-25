////Ag:
//import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';

//import { AppComponent } from './app.component';

//import { BaseCoreLayoutsModule } from "./layouts/layouts.module";
////  import { AppRoutingModule } from '../_BASE/core/modules/_app/app-routing.module';
////import { PagesModule } from "./pages/pages.module";

//// Auth
//import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { initFirebaseBackend } from './authUtils';
//import { FakeBackendInterceptor } from './core/helpers/fake-backend';
//import { ErrorInterceptor } from './core/helpers/error.interceptor';
//import { JwtInterceptor } from './core/helpers/jwt.interceptor';
//// Language
//import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
//// Store
//import { rootReducer } from './store';
//import { StoreModule } from '@ngrx/store';
//import { StoreDevtoolsModule } from '@ngrx/store-devtools';
//import { EffectsModule } from '@ngrx/effects';
//import { AuthenticationEffects } from './store/Authentication/authentication.effects'; //'src/_BASE/core/store'

//import { CookieService } from 'ngx-cookie-service';

//// Constants:
//import { environment } from '../environments/environment';
//import { system } from '../_BASE/shared/constants/system'
//// BASE Services:
//import { DiagnosticsTraceService } from '../_BASE/shared/services/diagnostics.service';



//if (environment.defaultauth === 'firebase') {
//  initFirebaseBackend(environment.firebaseConfig);
//} else {
//  FakeBackendInterceptor;
//}

//export function createTranslateLoader(http: HttpClient): any {
//  return new TranslateHttpLoader(http, system.sources.assets.i18n, '.json');
//}
//export function defaultLanguageFactory(cookieService: CookieService): string {
//  const languageCode = cookieService.get('languageCode') || 'en'; // Retrieve language code from cookie, default to 'en'
//  return languageCode;
//}

//@NgModule({
//  declarations: [
//    AppComponent
//  ],
//  imports: [
//    TranslateModule.forRoot({
//      defaultLanguage: '',
//      loader: {
//        provide: TranslateLoader,
//        useFactory: (createTranslateLoader),
//        deps: [HttpClient]
//      }
//    }),

//    StoreModule.forRoot(rootReducer),
//    StoreDevtoolsModule.instrument({
//      maxAge: 25, // Retains last 25 states
//      logOnly: environment.production, // Restrict extension to log-only mode
//    }),
//    EffectsModule.forRoot([
//      AuthenticationEffects,
//  ]),
//    BrowserAnimationsModule,
//    HttpClientModule,
//    BrowserModule,
//    //AppRoutingModule,
//    BaseCoreLayoutsModule,
//    //PagesModule
//  ],
//  providers: [
//    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
//    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
//    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
//    { provide: 'defaultLanguageCode', useFactory: defaultLanguageFactory, deps: [CookieService] },
//    CookieService,
//  ],
//  // This identifies which component to render first:
//  bootstrap: [AppComponent]
//})
///**
// * The SPA's root module.
// */
//export class AppModule {

//  public environment: any;

//  constructor(
//    private diagnosticsTraceService: DiagnosticsTraceService,
//    private cookieService: CookieService) {

//    diagnosticsTraceService.debug("AppModule.constructor()");

//    // Get the language code from the cookie,
//    // and if not found, fallback to the configured default:
//    const languageCode = this.cookieService.get('languageCode')||system.configuration.defaultLanguageCode;

//    //TranslateModule.forRoot().providers.push({ provide: 'defaultLanguageCode', useValue: languageCode});

//  }
//}


