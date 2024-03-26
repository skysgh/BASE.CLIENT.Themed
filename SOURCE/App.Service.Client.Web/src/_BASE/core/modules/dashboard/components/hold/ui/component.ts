import { Component, OnInit } from '@angular/core';
import { DiagnosticsTraceService } from '../../../services/diagnostics.service';
import { DashboardService } from '../../../services/dashboard.service';
import { Stat } from '../../../models/data/stat.model';
import { Observable, of } from 'rxjs';
import { System } from '../../../constants/contracts/system';
import { SystemService } from '../../../services/system.service';



@Component({
  selector: 'apps-dashboard',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class DashboardComponent implements OnInit {

  public summaries$: Observable<Stat[]> = of([]);

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
