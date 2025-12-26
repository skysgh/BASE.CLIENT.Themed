// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { Observable, of } from 'rxjs';
// Constants:
//
// Services:
//import { SystemService } from '../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
import { DashboardService } from '../../services/service.dashboard.service';
// Models/Data:
import { StatOneVTO } from '../../../../../core/models/view/stat-one.vto';
import { ViewModel } from './vm';

@Component({
  selector: 'base-core-dashboard-index',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreDashboardsIndexComponent implements OnInit {

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  stats$: Observable<StatOneVTO[]> = of([]);


  constructor(
    //private systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private dashboardService: DashboardService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor`);

    // Make system/env variables avaiable to class & view template:
    //this.system = this.systemService.system;
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);
    this.dashboardService.getSummaries().subscribe(l =>this.stats$ = of(l));
  }
}
