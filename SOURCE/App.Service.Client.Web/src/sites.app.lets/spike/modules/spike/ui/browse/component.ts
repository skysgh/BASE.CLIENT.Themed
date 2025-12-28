import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';

// ✅ NEW: Use core Signal-based service
import { SpikeService } from '../../../../../../core/services/spike.service';
// ✅ NEW: Use ViewModel instead of old model
import { SpikeViewModel } from '../../../../../../core/models/view-models/spike.view-model';

import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { SummaryItemVTO } from '../../../../../../core/models/SummaryItem.vto.model';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-apps-spike-spikes-browse',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSpikesBrowseComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsSpikesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // ✅ UPDATED: Use ViewModel types
  public page:number = 1;
  public data: SpikeViewModel[] = [];
  public summaryItems: SummaryItemVTO[] = [];

  constructor(
    private route: ActivatedRoute,
    private defaultControllerServices: DefaultComponentServices,
    // ✅ NEW: Inject core Signal-based service
    private spikeService: SpikeService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("Constructor");
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("Component OnInit");
    
    // ✅ NEW: Use Signal-based service (data loads automatically in constructor)
    // Access data via signal: this.spikeService.spikes()
    this.data = this.spikeService.spikes();
    this.summaryItems = this.data.map(this.mapAway);
  }
  
  mapAway(i: SpikeViewModel) : SummaryItemVTO{
    var r :SummaryItemVTO = {
        id: i.id,
        enabled: true,
        typeId: '01',
        type: 'spike',
        typeImage: 'spike.png',
        category: 'unset...',
        title: i.title,
        description: i.description || '',
        more: '',
      values: [
        { title: 'primary', value: '123' },
        { title: 'seondary', value: '456' }
      ],
        operations: []
    };
    return r;
  }
}
