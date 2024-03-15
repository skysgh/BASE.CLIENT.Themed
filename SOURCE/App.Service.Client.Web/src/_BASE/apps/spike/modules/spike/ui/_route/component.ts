// Import Ag:
import { Component, OnInit } from '@angular/core';
// Import Common:
import { DiagnosticsTraceService } from '../../../../../../shared/services/diagnostics.service';
import { ExampleService } from '../../../../../../shared/services/example.service';
// Import Module:
import { BaseAppsSpikeSpikesRepositoryService } from '../../../../services/repositories/spike-repository.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-base-apps-spike-spikes-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsSpikeSpikesRouteComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    private exampleService: ExampleService,
    private spikeRepositoryService: BaseAppsSpikeSpikesRepositoryService,
  ) {
    
  }
  ngOnInit(): void {
  }
}
