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
// Models:
import { ViewModel } from "../vm";

@Component({
  selector: 'app-base-common-components-topbar-languagehue',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarHueComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  mode: string | undefined;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private eventService: EventService
) {
    // Make system/env variables avaiable to view template (via singleton or service):
    
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
