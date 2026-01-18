// Ag:
import { Component, OnInit } from "@angular/core";
//  Misc:
//
// Configuration:
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { EventService } from '../../../../../core/services/infrastructure/event.service';
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";
import { AccountService } from "../../../../../core/services/account.service";
// Models:
import { ViewModel } from "../vm";

@Component({
    selector: 'app-base-common-components-topbar-languagehue',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
/**
 * Theme Switcher Component (Topbar)
 * 
 * Displays light/dark mode toggle in the topbar.
 * 
 * VISIBILITY:
 * Controlled by account feature flag: `features.showThemeSwitcher`
 * - System default: true
 * - Can be disabled per-account in config.json
 */
export class BaseCoreCommonComponentTopBarHueComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  /** Feature flag - controls visibility (default: true) */
  public isEnabled: boolean = true;

  mode: string | undefined;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private eventService: EventService,
    private accountService: AccountService
) {
    // Check feature flag from account config
    this.accountService.getConfigValue<boolean>('features.showThemeSwitcher').subscribe(enabled => {
      this.isEnabled = enabled ?? true; // Default to true
      this.defaultControllerServices.diagnosticsTraceService.debug(
        `${this.constructor.name} - Theme switcher enabled: ${this.isEnabled}`
      );
    });
  }

  ngOnInit(): void {
  }


  /**
  * Topbar Light-Dark Mode Change
  */
  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast('changeMode', mode);

    switch (mode) {
      case 'light':
        document.documentElement.setAttribute('data-bs-theme', "light");
        break;
      case 'dark':
        document.documentElement.setAttribute('data-bs-theme', "dark");
        break;
      default:
        document.documentElement.setAttribute('data-bs-theme', "light");
        break;
    }
  }
}
