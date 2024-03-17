import { Component } from '@angular/core';

import { TitleService } from '../../../../shared/services/title.service';
import { SystemService } from '../../../../shared/services/system.service';

@Component({
  selector: 'app-root',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
/**
 * Root Component,
 * defined as the bootstrap component
 * by AppModule.
 * 
 * It just is a Route-Outlet.
 */
export class AppROComponent {

  //Not really a need to hold it as a property,
  // but it's done in order to run tests.
  public readonly browserTitle: string;

  /**
   * Constructor.
   * @param titleService
   * @param systemService
   */
  constructor(private titleService: TitleService, systemService: SystemService) {

    // Set the Browser's title:
    this.browserTitle = systemService.system.title;
    this.titleService.set(`${systemService.system.sponsor.title}  ${systemService.system.title}`);
  }
}
