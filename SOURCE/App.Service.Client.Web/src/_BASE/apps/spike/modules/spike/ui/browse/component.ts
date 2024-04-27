import { Component, OnInit } from '@angular/core';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
import { BaseAppsSpikeSpikesRepositoryService } from '../../../../services/repositories/spike-repository.service';
// Models:
import { Spike } from '../../../../models/spike.model';
import { ActivatedRoute } from '@angular/router';
import { SummaryItemVTO } from '../../../../../../core/models/SummaryItem.vto.model';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-apps-spike-spikes-browse',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSpikesBrowseComponent implements OnInit {

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // TODO: Move these variables into it:
  public page:number = 1;
  public data: Spike[] = [];
  public summaryItems: Spike[] = [];

  constructor(
    private route: ActivatedRoute,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private repositoryService: BaseAppsSpikeSpikesRepositoryService
  ) {
    this.diagnosticsTraceService.info("Constructor");
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.info("Component OnInit");
    // Load list of elements:
    // TODO page it.


      this.route.queryParams.subscribe(queryParams=> {
        this.diagnosticsTraceService.info("params ready");
        this.page = queryParams['page'] | queryParams['pg'] | 1;
        this.diagnosticsTraceService.info('page: ' + this.page);
        this.repositoryService.getPage(this.page).subscribe((x:any) => {
          this.diagnosticsTraceService.info('got X: ' + x);
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
