// Rx:

// Ag:
import { Component } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
import { appletsArchitectureConfiguration } from '../../../../configuration/implementations/app.lets.architecture.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';


@Component({
  // Make unique per app:
  selector: 'app-base-apps-architecture-value-edit',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsArchitectureValuesEditComponent {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsArchitectureConfiguration

  controller(defaultControllerService: DefaultComponentServices) {

  }

}
