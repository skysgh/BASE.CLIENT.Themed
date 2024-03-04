import { Component, Input } from '@angular/core';
import { DiagnosticsService } from '../../../../../../../common/services/diagnostics.service';
import { Spike } from '../../../../../models/spike.model';


@Component({
  selector: 'app-base-apps-spike-spikes-browse-item',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsSpikeSpikesBrowseItemComponent {

  @Input()
  data: any;
  constructor(
    private diagnosticsService: DiagnosticsService) {
  }
}
