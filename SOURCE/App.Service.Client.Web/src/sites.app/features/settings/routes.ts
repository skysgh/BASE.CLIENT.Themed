import { Routes } from '@angular/router';

/**
 * Settings Feature Routes
 * 
 * Thin routing layer - delegates to service.settings app.let views.
 * 
 * /apps/settings              → Settings hub with child router outlet
 * /apps/settings/service      → Platform-wide settings (super admin)
 * /apps/settings/account      → Account settings (account admin)
 * /apps/settings/user         → User preferences (all users)
 * /apps/settings/applets/:id  → Applet-specific settings (dynamic)
 */
export const settingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../../sites.app.lets/service.settings/views/settings-hub/component').then(m => m.SettingsHubComponent),
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
      },
      {
        path: 'service',
        loadComponent: () => import('../../../sites.app.lets/service.settings/views/service-settings/component').then(m => m.ServiceSettingsSectionComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('../../../sites.app.lets/service.settings/views/account-settings/component').then(m => m.AccountSettingsSectionComponent)
      },
      {
        path: 'user',
        loadComponent: () => import('../../../sites.app.lets/service.settings/views/user-settings/component').then(m => m.UserSettingsSectionComponent)
      },
      {
        path: 'applets/:appletId',
        loadComponent: () => import('../../../sites.app.lets/service.settings/views/applet-settings/component').then(m => m.AppletSettingsSectionComponent)
      }
    ]
  }
];
