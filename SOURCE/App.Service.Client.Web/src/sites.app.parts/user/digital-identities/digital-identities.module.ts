import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Digital Identities Sub-Module
 * 
 * Manage linked identity providers (SSO/federation).
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./ui/views/linked-identities/component').then(m => m.LinkedIdentitiesComponent)
      }
    ])
  ],
  exports: [RouterModule]
})
export class DigitalIdentitiesModule { }
