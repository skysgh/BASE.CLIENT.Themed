import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Views
import { SettingsHubComponent } from './ui/views/settings-hub/component';
import { UniversalSettingsViewComponent } from './ui/views/universal-settings-view/component';
import { AppearanceSettingsPanelComponent } from './ui/views/appearance-settings/component';
import { ColorEditorPageComponent } from './ui/views/color-editor-page/component';

// Applet settings panels
import { SpikeSettingsPanelComponent } from '../../sites.app.lets/spike/ui/controls/settings-panel/component';

/**
 * Settings Applet Module
 * 
 * Unified settings hub for all configuration scopes:
 * - ServiceSetting: Platform-wide settings (super admin)
 * - AccountSetting: Per-tenant settings (account admin)
 * - UserSetting: Per-user preferences (all users)
 * 
 * Routes:
 * - /system/settings/          → Settings hub (defaults to user)
 * - /system/settings/{level}   → UniversalSettingsView
 * - /system/settings/{level}/appearance → Appearance settings
 * - /system/settings/{level}/appearance/colors/:tier → Color editor (mobile)
 * - /system/settings/{level}/apps/spike → Spike settings
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { 
        path: '', 
        component: SettingsHubComponent,
        children: [
          // Default to user settings
          { path: '', redirectTo: 'user', pathMatch: 'full' },
          
          // Service level settings
          { 
            path: 'service', 
            data: { level: 'service' },
            children: [
              { path: '', component: UniversalSettingsViewComponent, data: { level: 'service' } },
              { path: 'appearance', component: AppearanceSettingsPanelComponent, data: { level: 'service' } },
              { path: 'appearance/colors/:tier', component: ColorEditorPageComponent, data: { level: 'service' } },
              { path: 'apps/spike', component: SpikeSettingsPanelComponent, data: { level: 'service' } },
            ]
          },
          
          // Account level settings
          { 
            path: 'account', 
            data: { level: 'account' },
            children: [
              { path: '', component: UniversalSettingsViewComponent, data: { level: 'account' } },
              { path: 'appearance', component: AppearanceSettingsPanelComponent, data: { level: 'account' } },
              { path: 'appearance/colors/:tier', component: ColorEditorPageComponent, data: { level: 'account' } },
              { path: 'apps/spike', component: SpikeSettingsPanelComponent, data: { level: 'account' } },
            ]
          },
          
          // User level settings
          { 
            path: 'user', 
            data: { level: 'user' },
            children: [
              { path: '', component: UniversalSettingsViewComponent, data: { level: 'user' } },
              { path: 'appearance', component: AppearanceSettingsPanelComponent, data: { level: 'user' } },
              { path: 'appearance/colors/:tier', component: ColorEditorPageComponent, data: { level: 'user' } },
              { path: 'apps/spike', component: SpikeSettingsPanelComponent, data: { level: 'user' } },
            ]
          },
        ]
      },
    ]),
    // Standalone components
    SettingsHubComponent,
    UniversalSettingsViewComponent,
    AppearanceSettingsPanelComponent,
    ColorEditorPageComponent,
    SpikeSettingsPanelComponent,
  ],
  exports: [RouterModule]
})
export class SettingsModule { }
