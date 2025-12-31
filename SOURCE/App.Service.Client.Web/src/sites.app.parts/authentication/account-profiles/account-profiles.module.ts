import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Account Profiles Sub-Module
 * 
 * User's per-account profile settings.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./views/account-profile-edit/component').then(m => m.AccountProfileEditComponent)
      }
    ])
  ],
  exports: [RouterModule]
})
export class AccountProfilesModule { }
