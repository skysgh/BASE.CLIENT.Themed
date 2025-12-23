// Ag:
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, InjectionToken, APP_INITIALIZER} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from '@angular/router';

// Services:
// ...Keep thin.
// Modules:
//import { AppExtensionModule } from "../../core.ag/_app_extension/module";
// Components:
import { BaseRouterOutletComponent } from "./components/_routerOutlet/component";
import { AppExtensionModule } from "../core.ag/_app_extension/module";
//import { SystemService } from "../core/services/system.service";


//export const SYSTEM_CONFIG = new InjectionToken<ISystem>('System');

import { SystemConfigurationService } from "../core/services/configuration.service";
import { ObjectService } from "../core/services/object.service";

import { appsConfiguration } from "../apps/configuration/implementations/apps.configuration";
import { TAppsConfiguration } from "../apps/configuration/t.apps.configuration";



@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseRouterOutletComponent
  ],
  providers: [

    ObjectService,

    SystemConfigurationService,
    // Clarifying the type points to a generic, that
    // specified this AppsConfiguration
    {
      provide: SystemConfigurationService,
      useExisting: SystemConfigurationService<TAppsConfiguration>, // Set the config type
      // Which depends on ObjectService and DiagnosticsService.
    },

    ////{
    ////  provide: SystemService,
    ////  useExisting: SystemService<TAppsConfiguration>, // Set the config type
    ////  deps: [SystemConfigurationService],
    ////},
    //// IMPORTANT:
    //// This ensures that the configuration is loaded from the
    //// server before the app runs
    //{
    //  provide: APP_INITIALIZER,
    //  useFactory: SystemConfigurationService.loadConfig,
    //  deps: [SystemConfigurationService],
    //  multi: true
    //},

    
  ],
  imports: [
    BrowserModule,
    RouterModule,
    // NOTE: This is the important line, that quickly moves logic
    // to a library module, so it's less likely to be inadvertently
    // replaced by a template refresh.
    //AppExtensionModule
  ],
  exports: [
    RouterModule,

    AppExtensionModule,
    
    BaseRouterOutletComponent
  ],
  // Since we are pushing this down to AppSupportModule, we remove this declaration from here.
  bootstrap: [
    BaseRouterOutletComponent
  ]
})
/**
 * Root AppModule.
 *
 * Note: this class is invoked from `src/main.ts`
 * 
 * Recommendation:
 * keep it named as the convention (`AppModule`),
 * but from here, it calls other modules and components that all start with
 * 'Base...'
 *
 * Specifically, one core.ui module (`AppSupportModule`), which
 * does the heavier lifting of setting up basic services, etc.
 * *outside of this class* which *could* be inadvertently replaced
 * (has happened before).
 */
export class AppModule {
  constructor() {

  }

}

