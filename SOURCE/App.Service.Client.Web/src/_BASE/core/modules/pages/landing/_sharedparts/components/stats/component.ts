// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../services/system.diagnostics-trace.service';
// Models:
import { ServiceStat } from '../../../../../../models/data/service-stat.model';
// Data:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ServiceStatsService } from '../../../../../../services/services/service-stats.service';
import { ServiceStatVTO } from '../../../../../../models/view/service-stat.vto.model';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-index-stats',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Counter Component
 */
export class BaseAppsPagesLandingIndexStatsComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  /**
   * The number to start from every time
   * (does not change, always zero).
   */
   private C_START_NUMBER: number = 0;
  /**
   * Settings to define how how the stats renderer
   * is to behave.
   */
  public option = {
    // The number to start with
    startVal: this.C_START_NUMBER,
    //rendering info:
    decimalPlaces: 2,
    duration: 2,
    useEasing: true
  };


  /* The items the interface renders when they become available */
  public stats$: Observable<ServiceStatVTO[]> = of([]);


  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translateService: TranslateService,
    protected systemStatsService: ServiceStatsService) 
 {
    // Make system/env variables avaiable to view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  } 


  ngOnInit(): void {
    // Stats$ Initiated from constructor.
    // not requiring any inputs from template so do now rather than waiting till ngOnInit:
    this.systemStatsService.mappedItems$.subscribe(x => this.stats$ = of(x));
  }






  
}
