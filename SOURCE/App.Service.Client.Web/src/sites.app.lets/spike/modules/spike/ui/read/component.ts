// Rx:
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// ✅ FIXED: Use local applet service
import { SpikeService } from '../../../../services/spike.service';
import { SpikeViewModel } from '../../../../models/view-models/spike.view-model';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-apps-spike-spikes-read',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSpikesReadComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public appletConfiguration = appletsSpikesConfiguration;

  public viewModel: ViewModel = new ViewModel();
  public data?: SpikeViewModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllServices: DefaultComponentServices,
    private spikeService: SpikeService
  ) {
    this.defaultControllServices.diagnosticsTraceService.info("Constructor");
  }

  ngOnInit(): void {
    this.defaultControllServices.diagnosticsTraceService.info("Component OnInit");

    this.route.params.subscribe(params => {
      const id = params['id'];
      this.defaultControllServices.diagnosticsTraceService.info(`params ready. id:${id}`);
      this.data = this.spikeService.getById(id);
    });
  }

  public DoSomething() {
    this.defaultControllServices.diagnosticsTraceService.info("blah");
  }
}
