// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../apps/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { SystemCapabilitiesRepositoryService } from '../../../../../../../core/services/services/repositories/service-capabilities.service';
// Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';
import { SystemCapabilitiesVTO } from '../../../../../../../core/models/view/system-capabilities.vto.model';
import { servicesModel } from './services.model';
import { Services } from './data';


@Component({
  selector: 'app-base-core-pages-landing-index-capabilities',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Services Component
 */
export class BaseAppsPagesLandingIndexCapabilitiesComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.



  capabilities$: Observable<SystemCapabilitiesVTO[]> = of([]);

  sectionsInfo = importedSectionsInfo;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    protected capabilitiesRepositoryService: SystemCapabilitiesRepositoryService
    ) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    /**
     * fetches data
     */
     this._fetchData();
  }

   /**
 * User grid data fetches
 */
  private _fetchData() {
    this.capabilitiesRepositoryService
      .getPage()
      .subscribe(x => {
        this.capabilities$ = of(x)
      });
    }

}
