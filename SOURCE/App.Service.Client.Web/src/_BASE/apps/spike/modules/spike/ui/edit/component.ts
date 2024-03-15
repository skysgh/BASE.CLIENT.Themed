// Import Ag:
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// Import Common:
import { DiagnosticsTraceService } from '../../../../../../shared/services/diagnostics.service';
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
    private diagnosticsTraceService: DiagnosticsTraceService,
    private repositoryService: BaseAppsSpikeSpikesRepositoryService,
  ) {
    this.diagnosticsTraceService.info("Constructor");
  }

    ngOnInit(): void {
      this.diagnosticsTraceService.info("Component OnInit");

      this.route.params.subscribe(params => {
        this.diagnosticsTraceService.info("params ready");
        this.diagnosticsTraceService.info('id: ' + params['id']);
        this.repositoryService.get(params['id']).subscribe(x => {
          this.diagnosticsTraceService.info('got X: ' + x!.title);
          this.data = x!
        });
      });
  }
}
