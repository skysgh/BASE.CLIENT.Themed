import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AppletSettingsRegistryService, AppletSettingsSchema } from '../../services/applet-settings-registry.service';
import { SettingsNavigationService, SettingsNavItem } from '../../services/settings-navigation.service';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

interface SettingsNavItemWithRoute extends SettingsNavItem {
  route: string;
}

/**
 * Settings Hub Component
 * 
 * Unified settings view with sidebar navigation.
 * Uses SettingsNavigationService as single source of truth for paths.
 */
@Component({
    selector: 'app-settings-hub',
    imports: [RouterModule],
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class SettingsHubComponent implements OnInit {
  // Core settings sections (from navigation service)
  coreNavItems: SettingsNavItemWithRoute[] = [];
  
  // Applet settings sections
  appletNavItems: SettingsNavItemWithRoute[] = [];

  constructor(
    private settingsNav: SettingsNavigationService,
    private appletRegistry: AppletSettingsRegistryService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  ngOnInit(): void {
    this.buildNavigation();
  }

  private buildNavigation(): void {
    // Get core nav items from the navigation service (single source of truth)
    this.coreNavItems = this.settingsNav.getNavItemsWithPaths();

    // Build applet navigation from registry
    this.appletNavItems = this.appletRegistry.getAll()
      .map((schema: AppletSettingsSchema) => ({
        id: schema.appletId,
        label: schema.displayName,
        icon: schema.icon,
        segment: `applets/${schema.appletId}`,
        visible: true,
        route: this.settingsNav.getAppletSettingsPath(schema.appletId)
      }));

    this.logger.debug(
      `Settings nav built: ${this.coreNavItems.length} core, ${this.appletNavItems.length} applets`
    );
  }

  get visibleCoreItems(): SettingsNavItemWithRoute[] {
    return this.coreNavItems.filter(i => i.visible);
  }
}
