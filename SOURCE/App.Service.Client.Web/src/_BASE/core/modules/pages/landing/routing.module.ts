import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { BaseCoreLandingIndexComponent } from "./index/component";
import { BaseCoreLandingJobComponent } from './job/component';
import { BaseCoreLandingPricingComponent } from './pricing/component';
import { DiagnosticsTraceService } from '../../../../shared/services/diagnostics.service';

const routes: Routes = [
  {path: "",    component: BaseCoreLandingIndexComponent, pathMatch:'prefix'},
  {path: "pricing", component: BaseCoreLandingPricingComponent},
  { path: "jobs", component: BaseCoreLandingJobComponent },
  { path: "job", redirectTo: 'jobs'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BaseCoreLandingRoutingModule {
  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug("BaseCoreLandingRoutingModule.constructor()");
  }
}