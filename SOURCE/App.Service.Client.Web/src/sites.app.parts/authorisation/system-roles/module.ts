import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SystemRolesBrowseComponent } from './views/browse/component';
import { SystemRolesReadComponent } from './views/read/component';
import { SystemRolesAddComponent } from './views/add/component';

/**
 * System Roles Module
 * 
 * Manages roles which are collections of permissions assigned to users.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: SystemRolesBrowseComponent },
      { path: 'add', component: SystemRolesAddComponent },
      { path: ':id', component: SystemRolesReadComponent },
    ]),
    SystemRolesBrowseComponent,
    SystemRolesReadComponent,
    SystemRolesAddComponent,
  ],
  exports: [RouterModule]
})
export class SystemRolesModule { }
