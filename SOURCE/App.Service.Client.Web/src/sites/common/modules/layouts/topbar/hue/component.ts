// Ag:
import { Component, OnInit } from "@angular/core";
//  Misc:
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../../../core/constants/system';
// Services:
import { SystemService } from '../../../../../../core/services/system.service';
import { EventService } from '../../../../../../core/services/infrastructure/event.service';
import { ViewModel } from "../vm";

@Component({
  selector: 'app-base-common-components-topbar-languagehue',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarHueComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  mode: string | undefined;

  constructor(
    systemService: SystemService,
    public translate: TranslateService,
    private eventService: EventService
) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;
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
