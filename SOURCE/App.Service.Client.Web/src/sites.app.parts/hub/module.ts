/**
 * Hub Module
 * 
 * Central hub page with widgets from enabled applets.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HubComponent } from './ui/views/hub/component';
import { HubService } from './services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: HubComponent },
    ]),
    
    // Standalone components
    HubComponent,
  ],
  exports: [RouterModule],
  providers: [HubService],
})
export class HubModule {}
