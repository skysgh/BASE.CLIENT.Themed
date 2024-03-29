import { Component } from '@angular/core';

import { SystemService } from '../../../core/services/system.service';
import { TitleService } from '../../../core/services/title.service';


@Component({
  selector: 'apps-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsRouteComponent {

  constructor(private titleService: TitleService, systemService: SystemService) {
    // Set the desired title for your page
    this.titleService.set(`${systemService.system.dynamic.sponsor.title}  ${systemService.system.title}`);
  }
}
