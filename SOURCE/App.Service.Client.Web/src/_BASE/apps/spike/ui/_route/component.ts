// Import Ag:
import { Component, OnInit } from '@angular/core';
// Import Common:
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
import { ViewModel } from './vm';
// Import Module:


@Component({
  selector: 'app-base-apps-spikes-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsSpikeRouteOutletComponent implements OnInit {
  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // TODO: Move these variables into it.

  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService
  ) {

  }
  ngOnInit(): void {
  }
}
