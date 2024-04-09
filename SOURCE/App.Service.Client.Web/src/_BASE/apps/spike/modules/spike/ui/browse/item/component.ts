import { Component, Input } from '@angular/core';
import { SystemDiagnosticsTraceService } from '../../../../../../../core/services/system.diagnostics-trace.service';
import { Spike } from '../../../../../models/spike.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-base-apps-spike-spikes-browse-item',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsSpikeSpikesBrowseItemComponent {

  @Input()
  data: any;
  constructor(
    private translate: TranslateService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService) {
  }
}
