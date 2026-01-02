/**
 * Access App.Part Module
 * 
 * Geographical and compliance access control.
 * Manages embargo lists and country exclusions.
 * 
 * Path: /system/access/*
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccessRoutingModule } from './routing';

// Views - Hub & Dashboard
import { AccessHubComponent } from './ui/views/access-hub/component';
import { AccessDashboardComponent } from './ui/views/access-dashboard/component';

// Views - Embargo D-BREAST
import { EmbargoListComponent } from './embargos/ui/views/embargo-list/component';
import { EmbargoDetailComponent } from './embargos/ui/views/embargo-detail/component';
import { EmbargoEditComponent } from './embargos/ui/views/embargo-edit/component';
import { EmbargoAddComponent } from './embargos/ui/views/embargo-add/component';

// Widgets
import { EmbargoCountWidgetComponent } from './ui/widgets/embargo-count/component';
import { AvailableCountriesWidgetComponent } from './ui/widgets/available-countries/component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AccessRoutingModule,
    // Standalone components
    AccessHubComponent,
    AccessDashboardComponent,
    EmbargoListComponent,
    EmbargoDetailComponent,
    EmbargoEditComponent,
    EmbargoAddComponent,
    EmbargoCountWidgetComponent,
    AvailableCountriesWidgetComponent
  ],
  exports: [
    // Export widgets for use elsewhere
    EmbargoCountWidgetComponent,
    AvailableCountriesWidgetComponent
  ]
})
export class AccessModule { }
