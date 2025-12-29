import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Service Settings Applet Module
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
 * - /settings/service    → Platform settings
 * - /settings/account    → Account settings
 * - /settings/user       → User preferences
 * - /settings/applets/{appletId} → Applet-specific settings
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [CommonModule],
  exports: []
})
export class ServiceSettingsAppletModule { }
