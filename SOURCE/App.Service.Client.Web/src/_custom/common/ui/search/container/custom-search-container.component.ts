import { Component } from '@angular/core';
import { DiagnosticsService } from '../../../services/diagnostics.service';


@Component({
  selector: 'app-common-search',
  templateUrl: './common-search.component.html',
  styleUrls: ['./common-search.component.scss']
})

export class SearchContainerComponent {

  constructor(private diagnosticsService: DiagnosticsService) {
    this.diagnosticsService.info("SearchContainer Initialised");
  }
}
