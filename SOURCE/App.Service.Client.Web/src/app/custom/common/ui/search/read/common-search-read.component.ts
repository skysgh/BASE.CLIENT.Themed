import { Component } from '@angular/core';
import { DiagnosticsService } from '../../../services/diagnostics.service';

@Component({
  selector: 'app-common-search-read',
  templateUrl: './common-search-read.component.html',
  styleUrls: ['./common-search-read.component.scss']
})

export class SearchContainerReadComponent {
  constructor(private diagnosticsService: DiagnosticsService) {
    this.diagnosticsService.info("SearchContainerRead Initialised");
  }
}
