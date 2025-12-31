/**
 * Maintenance App.Part Module
 * 
 * Platform applet for service status/maintenance pages.
 * Lazy loaded - maintenance is rare, don't preload.
 * 
 * Path: /system/maintenance/*
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaintenanceRoutingModule } from './routing';
import { MaintenancePageComponent } from './views/maintenance-page/component';
import { ComingSoonPageComponent } from './views/coming-soon-page/component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    MaintenanceRoutingModule,
    MaintenancePageComponent,
    ComingSoonPageComponent
  ],
  exports: []
})
export class MaintenanceModule { }
