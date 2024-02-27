// Import Ag:
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// Import Common:
import { DiagnosticsService } from '../../../../../../common/services/diagnostics.service';
import { SpikeSpikesRepositoryService } from '../../../../services/spike-repository.service';
// Import Models:
import { Spike } from '../../../../models/spike.model';


@Component({
  selector: 'app-apps-spikes-spike-edit',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SpikesSpikeEditComponent implements OnInit {

  public data?: Spike;

  constructor(
    private route: ActivatedRoute,
    private diagnosticsService: DiagnosticsService,
    private repositoryService: SpikeSpikesRepositoryService,
  ) {
    this.diagnosticsService.info("Constructor");
  }

    ngOnInit(): void {
      this.diagnosticsService.info("Component OnInit");

      this.route.params.subscribe(params => {
        this.diagnosticsService.info("params ready");
        this.diagnosticsService.info('id: ' + params['id']);
        this.repositoryService.get(params['id']).subscribe(x => {
          this.diagnosticsService.info('got X: ' + x.title);
          this.data = x
        });
      });
  }
}
