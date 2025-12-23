// This is the base module for
// applications.

// NOTE:
// REferenced from src/app-routing.module.ts
// which lazy loads it with `LayoutComponent`
// which essnetially is router-outlet embedded
// in a vertical/horizontal/other layout.


// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Other dependencies:
import { BaseThemesV1Module } from '../themes/t1/module';

// Services:
import { SystemDefaultServices } from '../core/services/system.default-services.service';
import { ServiceLanguagesRepositoryService } from '../core/services/services/repositories/service-languages.repository.service';
import { ServiceLanguagesService } from '../core/services/service.languages.service';
// Modules:
import { BaseAppsRoutingModule } from './routing';
//Components:
import { BaseAppsRouteComponent } from "../apps/ui/_route/component";
import { BaseCoreSitesModule } from '../sites/module';



@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseAppsRouteComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    ServiceLanguagesRepositoryService,
    ServiceLanguagesService
  ],
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    FormsModule,
    // Module specific:
    BaseAppsRoutingModule,
    // Upstream: on Sites, which imports Themes, which imports Core.Ag. 
    BaseCoreSitesModule
    // Import Parent Module:
    // N/A
    // Child Modules:
    // N/A
    // Child Components:
    // N/A
  ],
  exports: [
    RouterModule,
    // NO: Export Parent Module:
    // NO: ...
  ]
})
export class BaseAppsModule {

  /**
   * Constructor
   * @param defaultServices
   */
  constructor(private defaultServices: SystemDefaultServices) {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }
}


