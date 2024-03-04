import { Component, OnInit } from '@angular/core';
// Services:
import { DiagnosticsService } from '../../../../../../common/services/diagnostics.service';
import { SpikeSubSpikesRepositoryService } from '../../../../services/subspike-repository.service';
// Models:
import { ActivatedRoute } from '@angular/router';
import { SubSpike } from '../../../../models/subspike.model';


@Component({
  selector: 'app-base-apps-spike-subspikes-browse',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikesSubSpikeBrowseComponent implements OnInit {

  public page: number = 1;
  public data?: SubSpike[] = [];

  constructor(
    private route: ActivatedRoute,
    private diagnosticsService: DiagnosticsService,
    private repositoryService: SpikeSubSpikesRepositoryService
  ) {
    this.diagnosticsService.info("SubSpike:Constructor");
  }

  ngOnInit(): void {
    this.diagnosticsService.info("SubSpike:Component OnInit");
    // Load list of elements:
    // TODO page it.


    this.route.params.subscribe(params => {
      this.diagnosticsService.info("params ready2");
      this.diagnosticsService.info('id2: ' + params['id']);
      this.repositoryService.getAllChildren(params['id']).subscribe((x:any) => {
        this.diagnosticsService.info('got Y: ' + x.title);
        this.data = x
      });
    });

    //this.route.queryParams.subscribe(queryParams => {
    //  this.diagnosticsService.info("params ready");
    //  this.page = queryParams['page'] | queryParams['pg'] | 1;
    //  this.diagnosticsService.info('page: ' + this.page);
    //  this.repositoryService.getAll(this.page).subscribe((x: any) => {
    //    this.diagnosticsService.info('got X: ' + x);
    //    this.data = x
    //  });
    //});

  }
}
