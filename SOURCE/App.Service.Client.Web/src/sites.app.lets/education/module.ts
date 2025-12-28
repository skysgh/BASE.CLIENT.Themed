// Ag:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

// Core utilities only (not domain-specific)
import { ConfigRegistryService } from "../../core/services/config-registry.service";
import { SystemDiagnosticsTraceService } from "../../core/services/system.diagnostics-trace.service";

// Routes:
import { BaseAppsEducationRoutingModule } from "./routing";

// Applet constants
import { appletsEducationConstants } from "./constants/implementations/app.lets.education.constants";

// Controls:
import { BaseAppsEducationProductsComponent } from "./areas/products/component";
import { BaseAppsEducationPeopleComponent } from "./areas/people/component";
import { BaseAppsEducationPlacesComponent } from "./areas/places/component";
import { BaseAppsEducationEnrollmentComponent } from "./areas/enrollment/component";
import { BaseAppsEducationFinancesComponent } from "./areas/finances/component";
import { BaseAppsEducationParticipationComponent } from "./areas/participation/component";
import { BaseAppsEducationPresenceComponent } from "./areas/presence/component";
import { BaseAppsEducationAssessmentsComponent } from "./areas/assessments/component";
import { BaseAppsEducationProgressComponent } from "./areas/progress/component";
import { BaseAppsEducationAccomplishmentsComponent } from "./areas/accomplishments/component";


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseAppsEducationProductsComponent,
    BaseAppsEducationPeopleComponent,
    BaseAppsEducationPlacesComponent,
    BaseAppsEducationFinancesComponent,
    BaseAppsEducationEnrollmentComponent,
    BaseAppsEducationParticipationComponent,
    BaseAppsEducationPresenceComponent,
    BaseAppsEducationAssessmentsComponent,
    BaseAppsEducationProgressComponent,
    BaseAppsEducationAccomplishmentsComponent
  ],
  providers: [
    // ...not yet...
  ],
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    FormsModule,
    // Routes:
    BaseAppsEducationRoutingModule,
    // Components
    // ...not yet...
    // Import Parent Module:
    // BaseAppsModule
   ],
  exports: [
    // TODO: Why???
    RouterModule,
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseAppsModule,
    // Declared Components:
    BaseAppsEducationProductsComponent,
    BaseAppsEducationPeopleComponent,
    BaseAppsEducationPlacesComponent,
    BaseAppsEducationFinancesComponent,
    BaseAppsEducationEnrollmentComponent,
    BaseAppsEducationParticipationComponent,
    BaseAppsEducationPresenceComponent,
    BaseAppsEducationAssessmentsComponent,
    BaseAppsEducationProgressComponent,
    BaseAppsEducationAccomplishmentsComponent
  ]
})
export class BaseAppsEducationModule {
  /**
   * Constructor
   * @param diagnosticsTraceService
   * @param configRegistryService - ✅ NEW: Config registry
   */
  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    configRegistryService: ConfigRegistryService  // ✅ NEW
  ) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    
    // ✅ NEW: Register Education applet config
    // This happens when the module is lazy-loaded!
    configRegistryService.register('applets.education', {
      constants: appletsEducationConstants,
      // Future: Add education-specific configuration here
    });
  }
}

