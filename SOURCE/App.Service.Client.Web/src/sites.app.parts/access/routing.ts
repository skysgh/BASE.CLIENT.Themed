/**
 * Access App.Part Routing
 * 
 * Routes following HARD BREAST pattern:
 * - Hub, Dashboard (H, D)
 * - Embargos: Browse, Read, Edit, Add, State Transition (B, R, E, A, S)
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccessHubComponent } from './views/access-hub/component';
import { AccessDashboardComponent } from './views/access-dashboard/component';
import { EmbargoListComponent } from './embargos/views/embargo-list/component';
import { EmbargoDetailComponent } from './embargos/views/embargo-detail/component';
import { EmbargoEditComponent } from './embargos/views/embargo-edit/component';
import { EmbargoAddComponent } from './embargos/views/embargo-add/component';

const routes: Routes = [
  // Hub - central access management
  {
    path: '',
    component: AccessHubComponent
  },
  
  // Dashboard - stats and widgets
  {
    path: 'dashboard',
    component: AccessDashboardComponent
  },
  
  // Embargos - D-BREAST
  {
    path: 'embargos',
    children: [
      // Browse - list all
      { path: '', component: EmbargoListComponent },
      { path: 'list', redirectTo: '', pathMatch: 'full' },
      
      // Add - create new
      { path: 'add', component: EmbargoAddComponent },
      
      // Read - view detail
      { path: ':id', component: EmbargoDetailComponent },
      
      // Edit - modify
      { path: ':id/edit', component: EmbargoEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessRoutingModule { }
