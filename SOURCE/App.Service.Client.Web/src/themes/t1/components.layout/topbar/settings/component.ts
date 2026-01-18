// Ag:
import { Component, OnInit } from "@angular/core";
// Services:
import { AccountService } from "../../../../../core/services/account.service";
// Settings (now in sites.app.parts):
import { SettingsNavigationService } from "../../../../../sites.app.parts/settings/services/settings-navigation.service";
// Configuration:
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";
// Models:
import { ViewModel } from "../vm";

@Component({
    selector: 'app-base-common-components-topbar-settings',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
/**
 * Settings Icon Component (Topbar)
 * 
 * Displays a gear icon in the topbar that navigates to settings page.
 * 
 * VISIBILITY:
 * Controlled by account feature flag: `features.showSettingsIcon`
 * - System default: false (settings accessible via User Menu)
 * - Can be enabled per-account in config.json
 * 
 * RATIONALE for default=false:
 * - Settings are also in User Menu (expected location by users)
 * - Reduces toolbar clutter, especially on mobile
 * - Settings are infrequently accessed
 */
export class BaseCoreCommonComponentTopBarSettingsComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public groupConfiguration = themesT1Configuration;
  public viewModel: ViewModel = new ViewModel();

  /** Feature flag - controls visibility (default: false) */
  public isEnabled: boolean = false;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private accountService: AccountService,
    private settingsNav: SettingsNavigationService
  ) {
    // Check feature flag from account config
    // Uses new flag name, with fallback to legacy flag name
    this.accountService.getConfigValue<boolean>('features.showSettingsIcon').subscribe(enabled => {
      // If new flag is undefined, check legacy flag
      if (enabled === undefined) {
        this.accountService.getConfigValue<boolean>('features.enableSettingsIcon').subscribe(legacyEnabled => {
          this.isEnabled = legacyEnabled ?? false; // Default to false
        });
      } else {
        this.isEnabled = enabled;
      }
      
      this.defaultControllerServices.diagnosticsTraceService.debug(
        `${this.constructor.name} - Settings icon enabled: ${this.isEnabled}`
      );
    });
  }

  ngOnInit(): void {
  }

  /**
   * Navigate to settings page using SettingsNavigationService
   */
  openSettings(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.openSettings()`);
    this.settingsNav.navigateToSettings();
  }
}
