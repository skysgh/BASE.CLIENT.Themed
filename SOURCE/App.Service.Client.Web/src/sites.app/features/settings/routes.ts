import { Routes } from '@angular/router';

/**
 * Settings Feature Routes
 * 
 * @deprecated This route is now at /system/settings via sites.app.parts/settings
 * Kept for backward compatibility - redirects to new location.
 */
export const settingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../../sites.app.parts/settings/ui/views/settings-hub/component').then(m => m.SettingsHubComponent),
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
      },
      {
        path: 'service',
        loadComponent: () => import('../../../sites.app.parts/settings/ui/views/service-settings/component').then(m => m.ServiceSettingsSectionComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('../../../sites.app.parts/settings/ui/views/account-settings/component').then(m => m.AccountSettingsSectionComponent)
      },
      {
        path: 'user',
        loadComponent: () => import('../../../sites.app.parts/settings/ui/views/user-settings/component').then(m => m.UserSettingsSectionComponent)
      },
      {
        path: 'applets/:appletId',
        loadComponent: () => import('../../../sites.app.parts/settings/ui/views/applet-settings/component').then(m => m.AppletSettingsSectionComponent)
      }
    ]
  }
];
