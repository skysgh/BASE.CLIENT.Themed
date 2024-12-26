import { Component } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../../core.ui/pipes/basetranslate.pipe';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../../../core/services/system.diagnostics-trace.service';
import { ViewModel } from './vm';


@Component({
  selector: 'app-common-search-edit',
  templateUrl: './common-search-edit.component.html',
  styleUrls: ['./common-search-edit.component.scss']
})

export class SearchContainerEditComponent {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.info("SearchContainerEdit Initialised");
  }
}
