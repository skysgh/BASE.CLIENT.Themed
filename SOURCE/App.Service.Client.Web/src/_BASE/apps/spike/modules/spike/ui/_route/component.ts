// Import Ag:
import { Component, OnInit } from '@angular/core';
// Import Common:
import { DiagnosticsService } from '../../../../../../shared/services/diagnostics.service';
import { ExampleService } from '../../../../../../shared/services/example.service';
// Import Module:
import { SpikeSpikesRepositoryService } from '../../../../services/spike-repository.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-apps-spike-spikes-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class SpikeSpikesRouteComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private diagnosticsService: DiagnosticsService,
    private exampleService: ExampleService,
    private spikeRepositoryService: SpikeSpikesRepositoryService,
  ) {
    
  }
  ngOnInit(): void {
  }
}
