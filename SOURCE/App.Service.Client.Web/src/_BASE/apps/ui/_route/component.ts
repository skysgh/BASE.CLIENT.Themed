import { Component } from '@angular/core';

import { SystemService } from '../../../shared/services/system.service';
import { TitleService } from '../../../shared/services/title.service';


@Component({
  selector: 'apps-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class CustomAppsRouteComponent {

  constructor(private titleService: TitleService, systemService: SystemService) {
    // Set the desired title for your page
    this.titleService.set(`${systemService.system.sponsor.title}  ${systemService.system.title}`);
  }
}
