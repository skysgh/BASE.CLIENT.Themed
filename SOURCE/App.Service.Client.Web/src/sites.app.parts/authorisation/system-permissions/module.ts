import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SystemPermissionsBrowseComponent } from './views/browse/component';
import { SystemPermissionsAddComponent } from './views/add/component';

/**
 * System Permissions Module
 * 
 * Manages granular permissions that can be assigned to roles or users.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: SystemPermissionsBrowseComponent },
      { path: 'add', component: SystemPermissionsAddComponent },
    ]),
    SystemPermissionsBrowseComponent,
    SystemPermissionsAddComponent,
  ],
  exports: [RouterModule]
})
export class SystemPermissionsModule { }
