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
import { CustomCommonModule } from "../shared/custom-common.module";

// Module specific:
//import { CustomAppsRoutingModule } from "./routing.module";
import { BaseAppsRouteComponent } from "./ui/_route/component";
import { RouterModule, Routes } from '@angular/router';
import { BaseAppsRoutingModule } from './routing.module';
import { SystemLanguagesRepositoryService } from '../shared/services/repositories/system.languages.repository.service';
import { LanguageService } from '../shared/services/language.service';
import { DiagnosticsTraceService } from '../shared/services/diagnostics.service';




@NgModule({
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    FormsModule,
    // Custom specific:
    CustomCommonModule,
    // Module specific:
    BaseAppsRoutingModule
    // No components
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    // define what Components belong to this Module (i.e., are not `standalone`)
    BaseAppsRouteComponent
  ],
  providers: [
    // declare services to dependency inject into constructors.
    SystemLanguagesRepositoryService,
    LanguageService
  ]
})
export class BaseAppsModule {

  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug("BaseAppsModule.constructor()");
  }
}


