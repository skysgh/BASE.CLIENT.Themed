import { Component, OnInit } from '@angular/core';
// Services:
import { DiagnosticsService } from '../../../../../../common/services/diagnostics.service';
import { SpikeSpikesRepositoryService } from '../../../../services/spike-repository.service';
// Models:
import { Spike } from '../../../../models/spike.model';


@Component({
  selector: 'app-apps-spikes-spike-browse',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SpikesSpikeBrowseComponent implements OnInit {

  public data?: Spike[] = [];

  constructor(
    private diagnosticsService: DiagnosticsService,
    private repositoryService: SpikeSpikesRepositoryService
  ) {
    this.diagnosticsService.info("Constructor");
  }

  ngOnInit(): void {
    this.diagnosticsService.info("Component OnInit");
    // Load list of elements:
    // TODO page it.
    this.repositoryService
      .getAll()
      .subscribe((x: any) => { this.data = x; });
  }
}
