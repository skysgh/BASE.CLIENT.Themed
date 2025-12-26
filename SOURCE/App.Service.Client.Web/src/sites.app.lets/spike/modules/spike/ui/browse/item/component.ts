// Ag:
import { Component, Input } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../../configuration/implementations/app.lets.spikes.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// Models:
import { Spike } from '../../../../../models/spike.model';


@Component({
  selector: 'app-base-apps-spike-spikes-browse-item',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsSpikeSpikesBrowseItemComponent {

  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsSpikesConfiguration

  @Input()
  data: any;
  constructor(private defaultControllerServices: DefaultComponentServices) {
  }
}
