// Import Ag:
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// Import Common:
import { DiagnosticsService } from '../../../../../../shared/services/diagnostics.service';
import { BaseAppsSpikeSpikesRepositoryService } from '../../../../services/repositories/spike-repository.service';
// Import Models:
import { Spike } from '../../../../models/spike.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-base-apps-spike-spikes-edit',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSpikesEditComponent implements OnInit {

  public data?: Spike;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private diagnosticsService: DiagnosticsService,
    private repositoryService: BaseAppsSpikeSpikesRepositoryService,
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
