/**
 * Maintenance App.Part Routing
 * 
 * Routes for maintenance and coming-soon views.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceComponent } from './views/maintenance/component';
import { ComingSoonComponent } from './views/coming-soon/component';

const routes: Routes = [
  // Maintenance view
  {
    path: '',
    component: MaintenanceComponent
  },
  // Coming soon view
  {
    path: 'coming-soon',
    component: ComingSoonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
