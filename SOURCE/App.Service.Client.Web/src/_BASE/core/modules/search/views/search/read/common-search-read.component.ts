import { Component } from '@angular/core';
import { SystemDiagnosticsTraceService } from '../../../../../services/system.diagnostics-trace.service';

@Component({
  selector: 'app-common-search-read',
  templateUrl: './common-search-read.component.html',
  styleUrls: ['./common-search-read.component.scss']
})

export class SearchContainerReadComponent {
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.info("SearchContainerRead Initialised");
  }
}
