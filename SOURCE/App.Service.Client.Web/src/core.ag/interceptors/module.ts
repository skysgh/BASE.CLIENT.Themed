// Ag:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
// Interceptors:
import { FakeBackendInterceptor } from "./fake-backend.interceptor";
import { JwtInterceptor } from "./jwt-bearertoken.interceptor";
import { ErrorInterceptor } from "./http-response-error.interceptor";
import { LoggingInterceptor } from "./logger.interceptor";

// NO: Parent Module:
// import { BaseCoreAgModule } from "../module";

// Core Env:
import { environment } from '../../environments/environment';
// Core Utilities:
import { initFirebaseBackend } from '../../core/utilities/authUtils';


//// While loading (ie, outside of class):
//initialiseAuthorisationInterceptorAsRequire();


///** Method called prior to developing Metadata for module, or module itself */
//function initialiseAuthorisationInterceptorAsRequire() {
//  if (environment.defaultauth === 'firebase') {
//    initFirebaseBackend(environment.firebaseConfig);
//  } else {
//    FakeBackendInterceptor;
//  }
//}


/**
 * Module to manage and import interceptors all in one go.
 *
 * Note:
 * Usually won't be invoked directly, but can be a dependency of another module.
 * Right now AppSupportModule imports the interceptors *directly*.
 */
@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    // declare services to dependency inject into constructors.
    // Interceptors: are NOT Declared or Exported.
    // N/A: FakeBackendInterceptor,
    // N/A: ErrorInterceptor,
    // N/A: JwtInterceptor,
    // N/A: LoggingInterceptor
  ],
  providers: [
    // declare services to dependency inject into constructors.
    // Interceptors: are Services. So ARE provided here:
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
  ],
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    // NO: Import Parent Module:
    // NO: BaseCoreAgModule,
    // No Child Modules:
    // N/A
    // Interceptors:
    //FakeBackendInterceptor,
    //ErrorInterceptor,
    //JwtInterceptor,
    //LoggingInterceptor

    //Note: There isn't a Module for Portable Core Services, Constants, etc.
    //So no importing of BaseCoreModule
  ],
  exports: [
    // NO: Import Parent Module:
    // NO: BaseCoreAgSupportModule
    // Interceptors: are NOT Declared or Exported.
    // N/A: FakeBackendInterceptor,
    // N/A: ErrorInterceptor,
    // N/A: JwtInterceptor,
    // N/A: LoggingInterceptor
  ]
})
export class BaseCoreAgInterceptorsModule { }
