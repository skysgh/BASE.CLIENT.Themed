import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SystemGroupsBrowseComponent } from './views/browse/component';
import { SystemGroupsReadComponent } from './views/read/component';
import { SystemGroupsAddComponent } from './views/add/component';
import { SystemGroupsEditComponent } from './views/edit/component';

/**
 * System Groups Module
 * 
 * Manages system-defined security groups (like AD Security Groups).
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: SystemGroupsBrowseComponent },
      { path: 'add', component: SystemGroupsAddComponent },
      { path: ':id', component: SystemGroupsReadComponent },
      { path: ':id/edit', component: SystemGroupsEditComponent },
    ]),
    SystemGroupsBrowseComponent,
    SystemGroupsReadComponent,
    SystemGroupsAddComponent,
    SystemGroupsEditComponent,
  ],
  exports: [RouterModule]
})
export class SystemGroupsModule { }
