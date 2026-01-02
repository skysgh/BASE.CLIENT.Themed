/**
 * Maintenance App.Part Module
 * 
 * Platform applet for service status/maintenance views.
 * Lazy loaded - maintenance is rare, don't preload.
 * 
 * Path: /system/maintenance/*
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaintenanceRoutingModule } from './routing';
import { MaintenanceComponent } from './ui/views/maintenance/component';
import { ComingSoonComponent } from './ui/views/coming-soon/component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    MaintenanceRoutingModule,
    MaintenanceComponent,
    ComingSoonComponent
  ],
  exports: []
})
export class MaintenanceModule { }
