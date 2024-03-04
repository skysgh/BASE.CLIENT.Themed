import { Component } from '@angular/core';

import { TitleService } from '../../../../shared/services/title.service';
import { SystemService } from '../../../../shared/services/system.service';

@Component({
  selector: 'app-root',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class AppROComponent {

  public readonly title: string;
  constructor(private titleService: TitleService, systemService: SystemService) {
    this.title = systemService.system.title;
    this.titleService.set(`${systemService.system.sponsor.title}  ${systemService.system.title}`);
  }
}
