/**
 * Trash Module
 * 
 * System-level trash/recycle bin for soft-deleted items.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TrashHubComponent } from './ui/views/trash-hub/component';
import { TrashService } from './services/trash.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: TrashHubComponent },
    ]),
    
    // Standalone components
    TrashHubComponent,
  ],
  exports: [RouterModule],
  providers: [
    TrashService,
  ],
})
export class TrashModule { }
