import { Component } from '@angular/core';

import { TitleService } from '../../../shared/services/title.service';
import { SystemService } from '../../../shared/services/system.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //title = 'velzon';

  constructor(private titleService: TitleService, systemService: SystemService) {
    this.titleService.set(`${systemService.system.sponsor.title}  ${systemService.system.title}`);
  }
}
