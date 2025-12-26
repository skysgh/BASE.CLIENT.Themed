// Import Ag:
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// Configuration:
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { BaseAppsSpikeSpikesRepositoryService } from '../../../../services/repositories/spike-repository.service';
// Import Models:
import { Spike } from '../../../../models/spike.model';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-apps-spike-spikes-edit',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSpikesEditComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsSpikesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // TODO: Move these variables into it:
  public data?: Spike;

  constructor(
    private route: ActivatedRoute,
    private defaultControllerServices: DefaultComponentServices,
    private repositoryService: BaseAppsSpikeSpikesRepositoryService,
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("Constructor");
  }

    ngOnInit(): void {
      this.defaultControllerServices.diagnosticsTraceService.info("Component OnInit");

      this.route.params.subscribe(params => {
        this.defaultControllerServices.diagnosticsTraceService.info("params ready");
        this.defaultControllerServices.diagnosticsTraceService.info('id: ' + params['id']);
        this.repositoryService.getSingle(params['id']).subscribe(x => {
          this.defaultControllerServices.diagnosticsTraceService.info('got X: ' + x!.title);
          this.data = x!
        });
      });
  }
}
