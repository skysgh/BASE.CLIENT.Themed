import { Component, Input } from '@angular/core';
import { DiagnosticsService } from '../../../../../../../shared/services/diagnostics.service';
import { Spike } from '../../../../../models/spike.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-apps-spike-spike-browse-item',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class SpikeSpikesBrowseItemComponent {

  @Input()
  data: any;
  constructor(
    private translate: TranslateService,
    private diagnosticsService: DiagnosticsService) {
  }
}
