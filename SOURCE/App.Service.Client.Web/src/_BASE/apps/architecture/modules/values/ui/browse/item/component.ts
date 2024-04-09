// Import Ag:
import { Component, Input } from '@angular/core';

// Import Module:
import { SystemDiagnosticsTraceService } from '../../../../../../../core/services/system.diagnostics-trace.service';

import { Value } from '../../../../../models/value.model';


@Component({
  selector: 'app-apps-architecture-values-browse-item',
  templateUrl: './spike-browse-item.component.html',
  styleUrls: ['./spike-browse-item.component.scss']
})

export class ArchitectureValuesBrowseItemComponent {

  @Input()
  data: any;
  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService) {
  }
}
