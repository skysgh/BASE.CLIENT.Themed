import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { BaseCorePagesLandingIndexComponent } from "./index/component";
import { BaseCorePagesLandingPricingComponent } from './pricing/component';
import { BaseCorePagesLandingOpportunitiesComponent } from './opportunities/component';
import { DiagnosticsTraceService } from '../../../../shared/services/diagnostics.service';
import { BaseCorePagesLandingMaintenanceComponent } from './maintenance/component';
import { BaseCorePagesLandingComingSoonComponent } from './coming-soon/component';

const routes: Routes = [
  { path: "index", component: BaseCorePagesLandingIndexComponent, pathMatch: 'prefix' },
  { path: "coming-soon", component: BaseCorePagesLandingComingSoonComponent },
  { path: "maintenance", component: BaseCorePagesLandingMaintenanceComponent },
  { path: "opportunities", component: BaseCorePagesLandingOpportunitiesComponent },
  { path: "pricing", component: BaseCorePagesLandingPricingComponent },
  { path: "jobs", redirectTo: 'opportunities'},
  { path: "", redirectTo:'index', pathMatch: 'prefix' }
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
