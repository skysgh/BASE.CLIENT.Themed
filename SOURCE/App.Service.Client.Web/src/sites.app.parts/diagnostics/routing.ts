/**
 * Diagnostics App.Part Routing
 * 
 * Routes following D-BREAST pattern (read-only):
 * - Hub, Dashboard (H, D)
 * - Logs: Browse, Read only (B, R)
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiagnosticsHubComponent } from './ui/views/diagnostics-hub/component';
import { DiagnosticsDashboardComponent } from './ui/views/diagnostics-dashboard/component';
import { LogListComponent } from './logs/views/log-list/component';
import { LogDetailComponent } from './logs/views/log-detail/component';

const routes: Routes = [
  // Hub - central diagnostics
  {
    path: '',
    component: DiagnosticsHubComponent
  },
  
  // Dashboard - stats and widgets
  {
    path: 'dashboard',
    component: DiagnosticsDashboardComponent
  },
  
  // Logs - D-BR (Browse, Read only)
  {
    path: 'logs',
    children: [
      // Browse - list all
      { path: '', component: LogListComponent },
      { path: 'list', redirectTo: '', pathMatch: 'full' },
      
      // Read - view detail
      { path: ':id', component: LogDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagnosticsRoutingModule { }
