import { Component, OnInit } from '@angular/core';
// Services:
import { DiagnosticsTraceService } from '../../../../../../shared/services/diagnostics.service';
import { BaseAppsSpikeSpikesRepositoryService } from '../../../../services/repositories/spike-repository.service';
// Models:
import { Spike } from '../../../../models/spike.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-base-apps-spike-spikes-browse',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSpikesBrowseComponent implements OnInit {

  public page:number = 1;
  public data?: Spike[] = [];

  constructor(
    private route: ActivatedRoute,
    private diagnosticsTraceService: DiagnosticsTraceService,
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
        });
      });

  }
}
