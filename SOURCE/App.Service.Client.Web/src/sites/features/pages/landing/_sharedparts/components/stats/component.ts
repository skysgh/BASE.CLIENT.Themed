// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../apps/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { ServiceStatsService } from '../../../../../../../core/services/services/service-stats.service';
// Models:
import { ServiceStat } from '../../../../../../../core/models/data/service-stat.model';
// Data:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ServiceStatVTO } from '../../../../../../../core/models/view/service-stat.vto.model';
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
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

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
    private defaultControllerServices: DefaultComponentServices,
    protected systemStatsService: ServiceStatsService) 
 {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  } 


  ngOnInit(): void {
    // Stats$ Initiated from constructor.
    // not requiring any inputs from template so do now rather than waiting till ngOnInit:
    this.systemStatsService.mappedItems$.subscribe(x => this.stats$ = of(x));
  }






  
}
