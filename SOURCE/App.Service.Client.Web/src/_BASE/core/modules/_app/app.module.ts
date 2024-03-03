// Import Ag:
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Import Template:
import { AuthGuard } from '../../../../app/core/guards/auth.guard';


//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
import { LayoutComponent } from '../../../../app/layouts/layout.component';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

if (environment.defaultauth === 'firebase') {
  initFirebaseBackend(environment.firebaseConfig);
} else {
  FakeBackendInterceptor;
}

const routes: Routes = [
  /* TODO: REPLACED: { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] }, */
  { path: '', component: LayoutComponent, loadChildren: () => import('../../../apps/module').then(m => m.CustomAppsModule), canActivate: [AuthGuard] },
  // while above is displayed within the layout,
  // the following are displayed directly without a frame:
  { path: 'auth', loadChildren: () => import('../../modules/account/account.module').then(m => m.AccountModule) },
  { path: 'pages', loadChildren: () => import('../../../../app/extraspages/extraspages.module').then(m => m.ExtraspagesModule), canActivate: [AuthGuard] },
  // only pages that are open
  { path: 'landing', loadChildren: () => import('../../../../app/landing/landing.module').then(m => m.LandingModule) }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot(routes),

    TranslateModule.forRoot({
      defaultLanguage: 'en',
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
    //AppRoutingModule,
    LayoutsModule
    //PagesModule
  ],
  //exports: [
  //  RouterModule
  //],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
