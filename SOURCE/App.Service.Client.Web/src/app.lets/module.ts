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

// Other dependencies:
import { BaseCoreCommonModule } from '../sites/common/modules/common/module';

// Module specific:
//import { CustomAppsRoutingModule } from "./routing.module";
import { BaseAppsRouteComponent } from "./ui/_route/component";
import { RouterModule, Routes } from '@angular/router';
import { BaseAppsRoutingModule } from './routing';
import { SystemDiagnosticsTraceService } from '../core/services/system.diagnostics-trace.service';
import { ServiceLanguagesRepositoryService } from '../core/services/services/repositories/service-languages.repository.service';
import { ServiceLanguagesService } from '../core/services/service.languages.service';
//Components:




@NgModule({
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    FormsModule,
    // Custom specific:
   // BaseCoreCommonModule,
    // Module specific:
    BaseAppsRoutingModule,
    // No components
    BaseCoreCommonModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    BaseAppsRouteComponent,

  ],
  providers: [
    // declare services to dependency inject into constructors.
    ServiceLanguagesRepositoryService,
    ServiceLanguagesService
  ]
})
export class BaseAppsModule {
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }
}


