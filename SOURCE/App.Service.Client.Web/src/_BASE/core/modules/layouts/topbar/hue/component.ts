import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SystemService } from "../../../../../shared/services/system.service";
import { System } from "../../../../../shared/constants/contracts/system";
import { EventService } from "../../../../../shared/services/event.service";

@Component({
  selector: 'app-frame-context-hue',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseLayoutTopBarContextHueComponent implements OnInit {

  system: System;

  mode: string | undefined;

  constructor(
    systemService: SystemService,
    public translate: TranslateService,
    private eventService: EventService
) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
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
