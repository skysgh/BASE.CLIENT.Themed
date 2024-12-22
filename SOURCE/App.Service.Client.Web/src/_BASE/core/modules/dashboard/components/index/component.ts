// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { Observable, of } from 'rxjs';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../common/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../services/system.diagnostics-trace.service';
import { DashboardService } from '../../../../services/service.dashboard.service';
// Models/Data:
import { StatOneVTO } from '../../../../models/view/stat-one.vto';
import { ViewModel } from './vm';

@Component({
  selector: 'base-core-dashboard-index',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreDashboardsIndexComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  stats$: Observable<StatOneVTO[]> = of([]);


  constructor(
    private systemService: SystemService,
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
