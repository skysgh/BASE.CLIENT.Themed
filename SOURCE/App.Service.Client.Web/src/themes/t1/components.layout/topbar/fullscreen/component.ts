// Rx:
//
// Ag:
import { Component, Inject, OnInit, DOCUMENT } from "@angular/core";

// Configuration:
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { EventService } from '../../../../../core/services/infrastructure/event.service';
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
export class BaseCoreCommonComponentTopBarFullScreenComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  mode: string | undefined;
  element: any = null; //HTMLElement

  /**
   * Constructor
   * 
   * @param document
   * @param translate
   * @param eventService
   */
  constructor(@Inject(DOCUMENT)
  private document: any,
    private defaultControllerServices: DefaultComponentServices,
    private eventService: EventService
) {
    // Make system/env variables avaiable to view template (via const or service):
    
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
