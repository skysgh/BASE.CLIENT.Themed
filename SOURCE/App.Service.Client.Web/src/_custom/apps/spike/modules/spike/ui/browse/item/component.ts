import { Component, Input } from '@angular/core';
import { DiagnosticsService } from '../../../../../../../common/services/diagnostics.service';
import { Spike } from '../../../../../models/spike.model';


@Component({
  selector: 'app-apps-spike-spike-browse-item',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class SpikeSpikesBrowseItemComponent {

  @Input()
  data: any;
  constructor(
    private diagnosticsService: DiagnosticsService) {
  }
}
