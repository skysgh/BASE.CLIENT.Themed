/**
 * Sites.App.Dev Module
 * 
 * Developer tools and documentation hub.
 * 
 * Route Structure:
 * /dev/                     → Developer hub
 * /dev/theme/t1/            → Theme T1 reference (themes/t1.dev/)
 * /dev/integrations/        → Integration guides
 * /dev/integrations/auth/   → Authentication integration
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SitesAppDevRoutingModule } from './routing';
import { DevHubComponent } from './ui/views/dev-hub/component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    SitesAppDevRoutingModule,
    DevHubComponent
  ],
  exports: []
})
export class SitesAppDevModule { }
