// Ag:
import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
// Services:
import { AccountService } from "../../../../../core/services/account.service";
import { NavigationService } from "../../../../../core/services/navigation.service";
// Configuration:
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";
// Models:
import { ViewModel } from "../vm";

/**
 * Help Button Component
 * 
 * Appears in topbar beside settings gear.
 * Navigates to account's help page (showing FAQ and Wiki options).
 */
@Component({
    selector: 'app-base-common-components-topbar-help',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseCoreCommonComponentTopBarHelpComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public groupConfiguration = themesT1Configuration;
  public viewModel: ViewModel = new ViewModel();

  private router = inject(Router);
  private navigationService = inject(NavigationService);

  // Feature flag - controls visibility
  public isEnabled: boolean = true;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private accountService: AccountService
  ) {
    // Check feature flag from account config
    this.accountService.getConfigValue<boolean>('features.enableHelpIcon').subscribe(enabled => {
      this.isEnabled = enabled ?? true; // Default to true
      this.defaultControllerServices.diagnosticsTraceService.debug(
        `${this.constructor.name} - Help icon enabled: ${this.isEnabled}`
      );
    });
  }

  ngOnInit(): void {
  }

  /**
   * Navigate to help page
   */
  openHelp(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.openHelp()`);
    // Use NavigationService for account-aware routing
    this.navigationService.navigate('apps/system/help');
  }
}
