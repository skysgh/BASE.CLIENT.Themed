import { Component } from '@angular/core';
import { SystemDiagnosticsTraceService } from '../../../../../services/system.diagnostics-trace.service';


@Component({
  selector: 'app-common-search',
  templateUrl: './common-search.component.html',
  styleUrls: ['./common-search.component.scss']
})

export class SearchContainerComponent {

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.info("SearchContainer Initialised");
  }
}
