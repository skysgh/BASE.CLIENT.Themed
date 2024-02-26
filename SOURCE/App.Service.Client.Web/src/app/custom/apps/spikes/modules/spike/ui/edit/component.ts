// Import Ag:
import { Component, OnInit } from '@angular/core';
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

  constructor(
    private diagnosticsService: DiagnosticsService,
    private repositoryService: SpikeSpikesRepositoryService,
  ) {
    this.diagnosticsService.info("Constructor");
  }

    ngOnInit(): void {
    this.diagnosticsService.info("Component OnInit");
  }
}
