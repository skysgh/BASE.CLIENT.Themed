import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Authentication Module
 * 
 * Parent module for the identity domain.
 * Contains nested sub-modules:
 * - users: Core user identity (thin entity)
 * - digital-identities: IdP trust relationships
 * - system-profiles: Cross-account user settings
 * - account-profiles: Per-account user settings
 * 
 * Routes: /system/authentication/*
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full'
          },
          // Users management (admin)
          {
            path: 'users',
            loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
          },
          // Linked identities (IdP management)
          {
            path: 'identities',
            loadChildren: () => import('./digital-identities/digital-identities.module').then(m => m.DigitalIdentitiesModule)
          },
          // Current user's system profile
          {
            path: 'profile',
            loadChildren: () => import('./system-profiles/system-profiles.module').then(m => m.SystemProfilesModule)
          },
          // Account-specific profile
          {
            path: 'account-profile',
            loadChildren: () => import('./account-profiles/account-profiles.module').then(m => m.AccountProfilesModule)
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AuthenticationModule { }
