// Ag:
import { Component, OnInit, Inject } from '@angular/core';
// Tokens:
import { DEPLOYED_RESOURCES, DeployedResources } from '../../../../../../../core/tokens';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { ServiceTrustedByService } from '../../../../../../../core/services/service-trusted-by.service';
// Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { Responsive as importedResponsive } from './settings';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-index-client-logo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * ClientLogoComponent - Trusted By Section
 * 
 * ✅ Updated to use modern ServiceTrustedByService with signals
 */
export class BaseAppsPagesLandingIndexClientsComponent implements OnInit {
  // ✅ Inject resources from Core token
  public resources: DeployedResources;
  
  // ✅ CONVENTION: Expose tier configuration as 'tierConfiguration'
  public tierConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  sectionsInfo = importedSectionsInfo;
  // Configuration for ngx-slick-carousel:
  carouselConfiguration = importedResponsive;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public trustedByService: ServiceTrustedByService,
    @Inject(DEPLOYED_RESOURCES) resources: DeployedResources
  ) {
    // ✅ Store injected resources for template access
    this.resources = resources;

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    // Clients automatically loaded by service
    // Access via trustedByService.enabledClients() signal
  }
}
