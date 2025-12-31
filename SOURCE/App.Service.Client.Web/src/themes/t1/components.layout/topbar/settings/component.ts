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
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarSettingsComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public groupConfiguration = themesT1Configuration;
  public viewModel: ViewModel = new ViewModel();

  // Feature flag - controls visibility
  public isEnabled: boolean = true;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private accountService: AccountService,
    private settingsNav: SettingsNavigationService
  ) {
    // Check feature flag from account config
    this.accountService.getConfigValue<boolean>('features.enableSettingsIcon').subscribe(enabled => {
      this.isEnabled = enabled ?? true; // Default to true
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
