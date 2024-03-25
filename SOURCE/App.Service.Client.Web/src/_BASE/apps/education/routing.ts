import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DiagnosticsTraceService } from '../../core/services/diagnostics.service';
import { BaseAppsEducationProductsComponent } from './areas/products/component';
import { BaseAppsEducationPlacesComponent } from './areas/places/component';
import { BaseAppsEducationPeopleComponent } from './areas/people/component';
import { BaseAppsEducationFinancesComponent } from './areas/finances/component';
import { BaseAppsEducationSchedulingComponent } from './areas/scheduling/component';
import { BaseAppsEducationProgressComponent } from './areas/progress/component';
import { BaseAppsEducationPresenceComponent } from './areas/presence/component';
import { BaseAppsEducationParticipationComponent } from './areas/participation/component';
import { BaseAppsEducationAssessmentsComponent } from './areas/assessments/component';
import { BaseAppsEducationAccomplishmentsComponent } from './areas/accomplishments/component';
import { BaseAppsEducationEnrollmentComponent } from './areas/enrollment/component';

const routes: Routes = [
  { path: 'products', component: BaseAppsEducationProductsComponent },
  { path: 'people', component: BaseAppsEducationPeopleComponent },
  { path: 'places', component: BaseAppsEducationPlacesComponent },

  { path: 'finances', component: BaseAppsEducationFinancesComponent },
  { path: 'enrollment', component: BaseAppsEducationEnrollmentComponent },

  { path: 'scheduling', component: BaseAppsEducationSchedulingComponent },

  { path: 'presence', component: BaseAppsEducationPresenceComponent },
  { path: 'participation', component: BaseAppsEducationParticipationComponent },
  { path: 'assessments', component: BaseAppsEducationAssessmentsComponent },
  { path: 'progress', component: BaseAppsEducationProgressComponent },
  { path: 'accomplishments', component: BaseAppsEducationAccomplishmentsComponent },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
  ],
  exports: [
    RouterModule
  ]
})

export class BaseAppsEducationRoutingModule {
  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }
}
