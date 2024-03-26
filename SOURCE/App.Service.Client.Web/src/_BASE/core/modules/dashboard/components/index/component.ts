import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SystemService } from '../../../../services/system.service';
import { System } from '../../../../constants/contracts/system';
import { DiagnosticsTraceService } from '../../../../services/diagnostics.service';
import { DashboardService } from '../../../../services/dashboard.service';
import { StatOneVTO } from '../../../../models/view/stat-on.vto';

@Component({
  selector: 'base-core-dashboard-index',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreDashboardsIndexComponent implements OnInit {

  stats$: Observable<StatOneVTO[]> = of([]);

  system: System;

  constructor(
    private systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    private dashboardService: DashboardService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor`);

    this.system = this.systemService.system;
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);
    this.dashboardService.getSummaries().subscribe(l =>this.stats$ = of(l));
  }
}
