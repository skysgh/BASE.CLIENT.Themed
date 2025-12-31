/**
 * Maintenance App.Part Routing
 * 
 * Routes for maintenance and coming-soon pages.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenancePageComponent } from './views/maintenance-page/component';
import { ComingSoonPageComponent } from './views/coming-soon-page/component';

const routes: Routes = [
  // Maintenance page
  {
    path: '',
    component: MaintenancePageComponent
  },
  // Coming soon page
  {
    path: 'coming-soon',
    component: ComingSoonPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
