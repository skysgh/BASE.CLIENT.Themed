import { Component } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../common/pipes/basetranslate.pipe';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../services/system.diagnostics-trace.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-common-search-read',
  templateUrl: './common-search-read.component.html',
  styleUrls: ['./common-search-read.component.scss']
})

export class SearchContainerReadComponent {

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.info("SearchContainerRead Initialised");
  }
}
