// Ag:
import { Component, OnInit } from '@angular/core';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
import { DashboardService } from '../../services/service.dashboard.service';
// Models/Data:
import { ViewModel } from './vm';

@Component({
    selector: 'base-core-dashboard-index',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseCoreDashboardsIndexComponent implements OnInit {
  public viewModel: ViewModel = new ViewModel();

  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public dashboardService: DashboardService
  ) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor`);
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);
    // Stats automatically loaded by service
    // Access via dashboardService.enabledStats() signal
  }
}
