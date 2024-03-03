import { Component, OnInit } from '@angular/core';
// Services:
import { DiagnosticsService } from '../../../../../../common/services/diagnostics.service';
import { SpikeSpikesRepositoryService } from '../../../../services/spike-repository.service';
// Models:
import { Spike } from '../../../../models/spike.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-apps-spike-spikes-browse',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SpikeSpikesBrowseComponent implements OnInit {

  public page:number = 1;
  public data?: Spike[] = [];

  constructor(
    private route: ActivatedRoute,
    private diagnosticsService: DiagnosticsService,
    private repositoryService: SpikeSpikesRepositoryService
  ) {
    this.diagnosticsService.info("Constructor");
  }

  ngOnInit(): void {
    this.diagnosticsService.info("Component OnInit");
    // Load list of elements:
    // TODO page it.


      this.route.queryParams.subscribe(queryParams=> {
        this.diagnosticsService.info("params ready");
        this.page = queryParams['page'] | queryParams['pg'] | 1;
        this.diagnosticsService.info('page: ' + this.page);
        this.repositoryService.getAll(this.page).subscribe((x:any) => {
          this.diagnosticsService.info('got X: ' + x);
          this.data = x;
        });
      });

  }
}
