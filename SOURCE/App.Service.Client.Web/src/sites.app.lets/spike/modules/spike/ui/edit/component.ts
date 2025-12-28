// Import Ag:
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// Configuration:
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// ✅ FIXED: Use local applet service
import { SpikeService } from '../../../../services/spike.service';
import { SpikeViewModel } from '../../../../models/view-models/spike.view-model';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-apps-spike-spikes-edit',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSpikesEditComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public appletConfiguration = appletsSpikesConfiguration;

  public viewModel: ViewModel = new ViewModel();
  public data?: SpikeViewModel;

  constructor(
    private route: ActivatedRoute,
    private defaultControllerServices: DefaultComponentServices,
    private spikeService: SpikeService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("Constructor");
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("Component OnInit");

    this.route.params.subscribe(params => {
      const id = params['id'];
      this.defaultControllerServices.diagnosticsTraceService.info('id: ' + id);
      this.data = this.spikeService.getById(id);
    });
  }
}
