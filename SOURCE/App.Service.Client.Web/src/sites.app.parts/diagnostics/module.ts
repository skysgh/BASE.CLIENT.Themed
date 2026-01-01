/**
 * Diagnostics App.Part Module
 * 
 * System diagnostics and log viewing.
 * Read-only - users cannot edit/add/delete logs.
 * 
 * Path: /system/diagnostics/*
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DiagnosticsRoutingModule } from './routing';

// Views - Hub & Dashboard
import { DiagnosticsHubComponent } from './views/diagnostics-hub/component';
import { DiagnosticsDashboardComponent } from './views/diagnostics-dashboard/component';

// Views - Logs D-BR (Browse, Read only)
import { LogListComponent } from './logs/views/log-list/component';
import { LogDetailComponent } from './logs/views/log-detail/component';

// Widgets
import { ErrorCountWidgetComponent } from './widgets/error-count/component';
import { LogVolumeWidgetComponent } from './widgets/log-volume/component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DiagnosticsRoutingModule,
    // Standalone components
    DiagnosticsHubComponent,
    DiagnosticsDashboardComponent,
    LogListComponent,
    LogDetailComponent,
    ErrorCountWidgetComponent,
    LogVolumeWidgetComponent
  ],
  exports: [
    ErrorCountWidgetComponent,
    LogVolumeWidgetComponent
  ]
})
export class DiagnosticsModule { }
