// Ag:
import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BrowserModule } from "@angular/platform-browser";

// Configuration:
import { appsConfiguration } from '../../../apps/configuration/implementations/apps.configuration';
// Services:
import { TitleService } from '../../../core/services/title.service';
//import { SystemService } from '../../../core/services/system.service';



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
export class BaseRouterOutletComponent {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  //public appletConfiguration = ...

  //Not really a need to hold it as a property,
  // but it's done in order to run tests.
  public browserTitle: string = '';

  /**
   * Constructor.
   * @param titleService
   * @param systemService
   */
  constructor(private titleService: TitleService,
    /*private systemService: SystemService*/
    ) {
    this.setTheBrowserTitle(
      //this.browserTitle = this.systemService.system.title;

      
      `${appsConfiguration.context.sponsor.title} - ${appsConfiguration.description.title}`);
  }

  private setTheBrowserTitle(title:string='') {
    this.titleService.set(title);
    this.browserTitle = title;
  }
}
