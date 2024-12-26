import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { BaseCorePagesLandingIndexComponent } from "../../landing/index/component";
import { BaseCorePagesLandingPricingComponent } from '../../landing/pricing/component';
import { BaseCorePagesLandingOpportunitiesComponent } from '../../landing/opportunities/component';
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
import { BaseCorePagesLandingMaintenanceComponent } from '../../landing/maintenance/component';
import { BaseCorePagesLandingComingSoonComponent } from '../../landing/coming-soon/component';

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
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug("BaseCoreLandingRoutingModule.constructor()");
  }
}
