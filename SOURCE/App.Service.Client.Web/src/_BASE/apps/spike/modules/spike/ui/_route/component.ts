// Import Ag:
import { Component, OnInit } from '@angular/core';
// Import Common:
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
import { ExampleService } from '../../../../../../core/services/example.service';
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
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private exampleService: ExampleService,
    private spikeRepositoryService: BaseAppsSpikeSpikesRepositoryService,
  ) {
    
  }
  ngOnInit(): void {
  }
}
