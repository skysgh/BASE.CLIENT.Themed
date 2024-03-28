import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';
import { SystemService } from '../../../../../services/system.service';
import { System } from '../../../../../constants/contracts/system';
import { DashboardService } from '../../../../../services/dashboard.service';
import { Stat } from '../../../../../models/data/stat.model';
import { StatOneVTO } from '../../../../../models/view/stat-on.vto';



@Component({
  selector: 'apps-dashboard',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class DashboardComponent implements OnInit {

  public summaries$: Observable<StatOneVTO[]> = of([]);

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
    this.dashboardService.getSummaries().subscribe(x => this.summaries$ = of(x));

    }
}
