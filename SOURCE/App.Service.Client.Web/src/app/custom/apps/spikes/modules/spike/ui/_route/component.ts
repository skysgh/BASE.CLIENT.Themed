// Import Ag:
import { Component, OnInit } from '@angular/core';
// Import Common:
import { DiagnosticsService } from '../../../../../../common/services/diagnostics.service';
import { ExampleService } from '../../../../../../common/services/example.service';
// Import Module:
import { SpikeSpikesRepositoryService } from '../../../../services/spike-repository.service';


@Component({
  selector: 'app-apps-spikes-spike-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class SpikesSpikeRouteComponent implements OnInit {

  constructor(
    private diagnosticsService: DiagnosticsService,
    private exampleService: ExampleService,
    private spikeRepositoryService: SpikeSpikesRepositoryService,
  ) {

  }
  ngOnInit(): void {
  }
}
