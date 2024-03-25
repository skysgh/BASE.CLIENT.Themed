import { Component } from '@angular/core';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';


@Component({
  selector: 'app-common-search-edit',
  templateUrl: './common-search-edit.component.html',
  styleUrls: ['./common-search-edit.component.scss']
})

export class SearchContainerEditComponent {

  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.info("SearchContainerEdit Initialised");
  }
}
