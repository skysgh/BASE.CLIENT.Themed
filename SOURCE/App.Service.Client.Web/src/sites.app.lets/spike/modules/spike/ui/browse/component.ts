import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
// Services:
import { BaseAppsSpikeSpikesRepositoryService } from '../../../../services/repositories/spike-repository.service';
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { Spike } from '../../../../models/spike.model';
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

  // TODO: Move these variables into it:
  public page:number = 1;
  public data: Spike[] = [];
  public summaryItems: Spike[] = [];

  constructor(
    private route: ActivatedRoute,
    private defaultControllerServices: DefaultComponentServices,
    private repositoryService: BaseAppsSpikeSpikesRepositoryService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("Constructor");
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("Component OnInit");
    // Load list of elements:
    // TODO page it.


      this.route.queryParams.subscribe(queryParams=> {
        this.defaultControllerServices.diagnosticsTraceService.info("params ready");
        this.page = queryParams['page'] | queryParams['pg'] | 1;
        this.defaultControllerServices.diagnosticsTraceService.info('page: ' + this.page);
        this.repositoryService.getPage(this.page).subscribe((x:any) => {
          this.defaultControllerServices.diagnosticsTraceService.info('got X: ' + x);
          this.data = x;
          this.summaryItems = x.map(this.mapAway);
        });
      });

  }
  mapAway(i: Spike) : SummaryItemVTO{
    var r :SummaryItemVTO = {
        id: i.id,
        enabled: true,
        typeId: '01',
        type: 'spike',
        typeImage: 'spike.png',
        category: 'unset...',
        title: i.title,
        description: i.description,
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
