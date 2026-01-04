import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * System Profiles Sub-Module
 * 
 * User's system-wide profile (cross-account preferences).
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./ui/views/system-profile-edit/component').then(m => m.SystemProfileEditComponent)
      }
    ])
  ],
  exports: [RouterModule]
})
export class SystemProfilesModule { }
