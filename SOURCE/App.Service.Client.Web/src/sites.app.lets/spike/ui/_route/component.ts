// Rx:
// 
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../configuration/implementations/app.lets.spikes.configuration';
// Services:
import { DefaultComponentServices } from '../../../../core/services/default-controller-services';
// Modules:
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-apps-spikes-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsSpikeRouteOutletComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsSpikesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // TODO: Move these variables into it.

  constructor(
    private defaultControllerServices: DefaultComponentServices
    ) {

  }
  ngOnInit(): void {
  }
}
