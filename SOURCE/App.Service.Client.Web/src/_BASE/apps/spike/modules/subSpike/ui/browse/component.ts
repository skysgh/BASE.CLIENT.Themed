import { Component, OnInit } from '@angular/core';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
import { BaseAppsSpikeSubSpikesRepositoryService } from '../../../../services/repositories/subspike-repository.service';
// Models:
import { ActivatedRoute } from '@angular/router';
import { SubSpike } from '../../../../models/subspike.model';
import { TranslateService } from '@ngx-translate/core';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-apps-spike-subspikes-browse',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSubSpikesBrowseComponent implements OnInit {

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // TODO: Move these variables into it:
  public page: number = 1;
  public data?: SubSpike[] = [];

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private repositoryService: BaseAppsSpikeSubSpikesRepositoryService
  ) {
    this.diagnosticsTraceService.info("SubSpike:Constructor");
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.info("SubSpike:Component OnInit");
    // Load list of elements:
    // TODO page it.


    this.route.params.subscribe(params => {
      this.diagnosticsTraceService.info("params ready2");
      this.diagnosticsTraceService.info('id2: ' + params['id']);
      this.repositoryService.getPageAdChildrenOf(params['id']).subscribe((x:any) => {
        this.diagnosticsTraceService.info('got Y: ' + x.title);
        this.data = x
      });
    });

    //this.route.queryParams.subscribe(queryParams => {
    //  this.diagnosticsTraceService.info("params ready");
    //  this.page = queryParams['page'] | queryParams['pg'] | 1;
    //  this.diagnosticsTraceService.info('page: ' + this.page);
    //  this.repositoryService.getPage(this.page).subscribe((x: any) => {
    //    this.diagnosticsTraceService.info('got X: ' + x);
    //    this.data = x
    //  });
    //});

  }
}
