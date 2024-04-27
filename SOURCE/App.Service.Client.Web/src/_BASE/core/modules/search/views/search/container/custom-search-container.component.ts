import { Component } from '@angular/core';
import { SystemDiagnosticsTraceService } from '../../../../../services/system.diagnostics-trace.service';
import { ViewModel } from './vm';


@Component({
  selector: 'app-common-search',
  templateUrl: './common-search.component.html',
  styleUrls: ['./common-search.component.scss']
})

export class SearchContainerComponent {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.info("SearchContainer Initialised");
  }
}
