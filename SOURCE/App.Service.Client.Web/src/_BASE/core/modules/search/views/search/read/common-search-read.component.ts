import { Component } from '@angular/core';
import { DiagnosticsTraceService } from '../../../../../../shared/services/diagnostics.service';

@Component({
  selector: 'app-common-search-read',
  templateUrl: './common-search-read.component.html',
  styleUrls: ['./common-search-read.component.scss']
})

export class SearchContainerReadComponent {
  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.info("SearchContainerRead Initialised");
  }
}
