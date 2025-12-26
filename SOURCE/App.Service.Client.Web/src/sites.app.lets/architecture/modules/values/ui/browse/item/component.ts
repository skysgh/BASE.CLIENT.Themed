// Rx:

// Ag:
import { Component, Input } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
import { appletsArchitectureConfiguration } from '../../../../../configuration/implementations/app.lets.architecture.configuration';

// Import Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// Models:
import { Value } from '../../../../../models/value.model';


@Component({
  selector: 'app-apps-architecture-values-browse-item',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class ArchitectureValuesBrowseItemComponent {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsArchitectureConfiguration

  @Input()
  data: any;
  constructor(private defaultControllerServices: DefaultComponentServices) {
  }
}
