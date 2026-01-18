// Rx:
//
// Ag:
import { Component, Inject, OnInit, DOCUMENT } from "@angular/core";

// Configuration:
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { EventService } from '../../../../../core/services/infrastructure/event.service';
import { AccountService } from "../../../../../core/services/account.service";
// Models:
import { ViewModel } from "../vm";
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
// Services:
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";

@Component({
    selector: 'app-base-common-components-topbar-languagefullscreen',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
/**
 * Fullscreen Toggle Component (Topbar)
 * 
 * Displays a fullscreen toggle button in the topbar.
 * 
 * VISIBILITY:
 * Controlled by account feature flag: `features.showFullscreenToggle`
 * - System default: true
 * - Can be disabled per-account in config.json
 */
export class BaseCoreCommonComponentTopBarFullScreenComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  /** Feature flag - controls visibility (default: true) */
  public isEnabled: boolean = true;

  mode: string | undefined;
  element: any = null; //HTMLElement

  /**
   * Constructor
   */
  constructor(
    @Inject(DOCUMENT) private document: any,
    private defaultControllerServices: DefaultComponentServices,
    private eventService: EventService,
    private accountService: AccountService
  ) {
    // Check feature flag from account config
    this.accountService.getConfigValue<boolean>('features.showFullscreenToggle').subscribe(enabled => {
      this.isEnabled = enabled ?? true; // Default to true
      this.defaultControllerServices.diagnosticsTraceService.debug(
        `${this.constructor.name} - Fullscreen toggle enabled: ${this.isEnabled}`
      );
    });
  }

  ngOnInit(): void {
    this.element = document.documentElement;
}

  /**
  * Fullscreen method
  */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}
