import { Component } from '@angular/core';
import { DiagnosticsService } from '../../../services/diagnostics.service';


@Component({
  selector: 'app-common-search-edit',
  templateUrl: './common-search-edit.component.html',
  styleUrls: ['./common-search-edit.component.scss']
})

export class SearchContainerEditComponent {

  constructor(private diagnosticsService: DiagnosticsService) {
    this.diagnosticsService.info("SearchContainerEdit Initialised");
  }
}
