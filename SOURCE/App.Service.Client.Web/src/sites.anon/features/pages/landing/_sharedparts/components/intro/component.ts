// Rx:

// Ag:
import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
// Tokens:
import { DEPLOYED_RESOURCES, DeployedResources } from '../../../../../../../core/tokens';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';

@Component({
    selector: 'app-base-core-pages-landing-index-demos',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})


/**
 * Intro Component - Landing Page Hero Section
 */
export class BaseAppsPagesLandingIndexDemosComponent implements OnInit {
  // ✅ Inject resources from Core token
  public resources: DeployedResources;
  
  // ✅ CONVENTION: Expose tier configuration as 'tierConfiguration'
  public tierConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  sectionsInfo = importedSectionsInfo;

  showNavigationArrows: any;
  showNavigationIndicators: any;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    @Inject(DEPLOYED_RESOURCES) resources: DeployedResources
  ) {
    // ✅ Store injected resources for template access
    this.resources = resources;

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }


  ngOnInit(): void {
  }

}
