// Rx:

// Ag:
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// ✅ MIGRATED: Use applet-local Signal-based service (moved from core)
import { SubSpikeService } from '../../../../services/sub-spike.service';
// ✅ MIGRATED: Use applet-local ViewModel (moved from core)
import { SubSpikeViewModel } from '../../../../models/view-models/sub-spike.view-model';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-apps-spike-subspikes-browse',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSubSpikesBrowseComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsSpikesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // ✅ UPDATED: Use ViewModel types
  public page: number = 1;
  public data: SubSpikeViewModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private defaultControllerServices: DefaultComponentServices,
    // ✅ MIGRATED: Use applet-local Signal-based service
    private subSpikeService: SubSpikeService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike:Constructor");
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike:Component OnInit");

    this.route.params.subscribe(params => {
      this.defaultControllerServices.diagnosticsTraceService.info("params ready2");
      this.defaultControllerServices.diagnosticsTraceService.info('id2: ' + params['id']);
      
      // ✅ UPDATED: Use Signal-based service method
      this.data = this.subSpikeService.getByParentId(params['id']);
    });
  }
}
