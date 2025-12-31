import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Views
import { SettingsHubComponent } from './views/settings-hub/component';
import { ServiceSettingsSectionComponent } from './views/service-settings/component';
import { AccountSettingsSectionComponent } from './views/account-settings/component';
import { UserSettingsSectionComponent } from './views/user-settings/component';
import { AppletSettingsSectionComponent } from './views/applet-settings/component';

/**
 * Settings Applet Module
 * 
 * Unified settings hub for all configuration scopes:
 * - ServiceSetting: Platform-wide settings (super admin)
 * - AccountSetting: Per-tenant settings (account admin)
 * - UserSetting: Per-user preferences (all users)
 * 
 * Also hosts dynamic applet settings via AppletSettingsRegistry.
 * Each applet can register its settings schema, which this module
 * renders dynamically based on permissions.
 * 
 * Routes:
 * - /system/settings/          → Settings hub
 * - /system/settings/service   → Platform settings
 * - /system/settings/account   → Account settings
 * - /system/settings/user      → User preferences
 * - /system/settings/applets/{appletId} → Applet-specific settings
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: SettingsHubComponent },
      { path: 'service', component: ServiceSettingsSectionComponent },
      { path: 'account', component: AccountSettingsSectionComponent },
      { path: 'user', component: UserSettingsSectionComponent },
      { path: 'applets/:appletId', component: AppletSettingsSectionComponent },
    ]),
    // Standalone components
    SettingsHubComponent,
    ServiceSettingsSectionComponent,
    AccountSettingsSectionComponent,
    UserSettingsSectionComponent,
    AppletSettingsSectionComponent,
  ],
  exports: [RouterModule]
})
export class SettingsModule { }
