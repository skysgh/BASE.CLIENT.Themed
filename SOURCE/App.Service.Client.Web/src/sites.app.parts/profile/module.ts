import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Profile Module
 * 
 * User identity and profile information hub.
 * Routes: /system/profile/*
 * 
 * This is conceptually different from Settings:
 * - Profile = "Who I am" (identity, bio, credentials)
 * - Settings = "How things work" (preferences, configuration)
 * 
 * Profile Sections:
 * - /system/profile           → Profile Hub (tile navigation)
 * - /system/profile/personal  → Avatar, name, bio
 * - /system/profile/security  → Password, MFA, sessions
 * - /system/profile/[custom]  → Applet-registered profile sections
 * 
 * Note: Profile is always user-scoped (no service/account levels).
 * Account admins can LOCK profile fields, but the data is always per-user.
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./ui/views/profile-hub/component').then(m => m.ProfileHubComponent)
      },
      {
        path: 'personal',
        loadComponent: () => import('./ui/views/personal-profile/component').then(m => m.PersonalProfileComponent)
      },
      {
        path: 'security',
        loadComponent: () => import('./ui/views/security-profile/component').then(m => m.SecurityProfileComponent)
      }
    ])
  ],
  exports: [RouterModule]
})
export class ProfileModule { }
