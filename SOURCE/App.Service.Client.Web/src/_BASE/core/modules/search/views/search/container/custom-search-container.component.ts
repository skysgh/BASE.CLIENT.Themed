import { Component } from '@angular/core';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';


@Component({
  selector: 'app-common-search',
  templateUrl: './common-search.component.html',
  styleUrls: ['./common-search.component.scss']
})

export class SearchContainerComponent {

  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.info("SearchContainer Initialised");
  }
}
