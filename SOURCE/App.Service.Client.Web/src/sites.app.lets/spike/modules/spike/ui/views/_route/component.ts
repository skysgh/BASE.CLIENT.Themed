// Import Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appletsSpikesConfiguration } from '../../../../../configuration/implementations/app.lets.spikes.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { SpikeService } from '../../../../../services/spike.service';

/**
 * Route Outlet Component for Spike Module
 * 
 * NOTE: This is a legacy component that may not be needed.
 * Modern routing uses standalone components or direct lazy loading.
 */
@Component({
  selector: 'app-base-apps-spike-spikes-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSpikesRouteComponent implements OnInit {
  // Expose applet configuration:
  public appletConfiguration = appletsSpikesConfiguration;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private spikeService: SpikeService
  ) {
  }
  
  ngOnInit(): void {
  }
}
