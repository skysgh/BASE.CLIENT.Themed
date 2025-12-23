// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../apps/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { ServiceFeaturesService } from '../../../../../../../core/services/services/service-features.service';
// Models:
import { ServiceFeature } from '../../../../../../../core/models/data/service-features.model';
import { ViewModel } from './vm';
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';


@Component({
  selector: 'app-base-core-pages-landing-index-designed',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Designed Component
 */
export class BaseAppsPagesLandingIndexDesignedComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  public features$: Observable<ServiceFeature[]> = of([]);

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    protected serviceFeaturesService: ServiceFeaturesService) {


    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    this._fetchData();

  } 

  ngOnInit(): void {
  }

  // Chat Data Fetch
  private _fetchData() {
    this.features$ = this.serviceFeaturesService.items$;
  }

}
