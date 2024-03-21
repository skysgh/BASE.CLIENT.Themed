// Ag:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
// Services:
import { DiagnosticsTraceService } from "../../shared/services/diagnostics.service";
// Modules:
import { CustomCommonModule } from "../../shared/custom-common.module";
import { BaseCommonComponmentsModule } from "../../core/modules/components/module";
import { BaseAppsEducationRoutingModule } from "./routing";
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
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    BaseCommonComponmentsModule,
    FormsModule,
    // Custom specific:
    CustomCommonModule,
    // Module specific:
    BaseAppsEducationRoutingModule
    // No components
  ],
  exports: [
    RouterModule
  ],
  declarations: [
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
  ]
})
export class BaseAppsEducationModule {
  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }
}

