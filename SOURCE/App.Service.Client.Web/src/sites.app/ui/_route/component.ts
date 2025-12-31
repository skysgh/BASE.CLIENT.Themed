// Rx:
//
// Ag:
import { Component } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../configuration/implementations/apps.configuration';
// appletConfiguration...
// Services:
import { TitleService } from '../../../core/services/title.service';
import { DefaultComponentServices } from '../../../core/services/default-controller-services';
// Models:


@Component({
    selector: 'apps-route',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})

export class BaseAppsRouteComponent {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  //public appletConfiguration = ...

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private titleService: TitleService) {
    // Set the desired title for your page
    this.titleService.set(`${appsConfiguration.context.sponsor.title }  ${appsConfiguration.description.title}`);
  }
}
