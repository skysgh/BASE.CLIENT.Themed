// Import Ag:
import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import Common:
// Pipes:
import { BaseTranslatePipe } from '../../../common/pipes/basetranslate.pipe';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../services/system.diagnostics-trace.service';
import { ViewModel } from './vm';
// Import Module:


@Component({
  selector: 'app-base-core-pages-route-outlet',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseCorePagesROComponent implements OnInit {
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
