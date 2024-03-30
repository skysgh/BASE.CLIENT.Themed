// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Services:
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';
import { SystemService } from '../../../../../services/system.service';
import { DashboardService } from '../../../../../services/dashboard.service';
// Models:
import { Stat } from '../../../../../models/data/stat.model';
import { StatOneVTO } from '../../../../../models/view/stat-on.vto';
// Data:


@Component({
  selector: 'apps-dashboard',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class DashboardComponent implements OnInit {
  // make system/env config accessible by markup:
  system = importedSystemConst;

  public summaries$: Observable<StatOneVTO[]> = of([]);


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
