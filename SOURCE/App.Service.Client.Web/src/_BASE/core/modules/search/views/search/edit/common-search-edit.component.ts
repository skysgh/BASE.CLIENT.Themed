import { Component } from '@angular/core';
import { SystemDiagnosticsTraceService } from '../../../../../services/system.diagnostics-trace.service';


@Component({
  selector: 'app-common-search-edit',
  templateUrl: './common-search-edit.component.html',
  styleUrls: ['./common-search-edit.component.scss']
})

export class SearchContainerEditComponent {

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.info("SearchContainerEdit Initialised");
  }
}
