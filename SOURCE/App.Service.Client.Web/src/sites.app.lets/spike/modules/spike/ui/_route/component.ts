// Import Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
// Services:
import { BaseAppsSpikeSpikesRepositoryService } from '../../../../services/repositories/spike-repository.service';
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:

@Component({
  selector: 'app-base-apps-spike-spikes-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsSpikeSpikesRouteComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletsEducationConfiguration = appletsSpikesConfiguration

  /**
   * Controller
   * @param defaultControllerServices
   * @param spikeRepositoryService
   */
  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private spikeRepositoryService: BaseAppsSpikeSpikesRepositoryService
  ) {
    
  }
  ngOnInit(): void {
  }
}
