// Ag:
import { Component, OnInit, Inject } from '@angular/core';
// Tokens:
import { DEPLOYED_RESOURCES, DeployedResources } from '../../../../../../../core/tokens';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// ✅ UPDATED: Use brochure applet
import { BrochureTrustedByService } from '../../../../../../../sites.app.lets/brochure/services/brochure-trusted-by.service';
// Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { Responsive as importedResponsive } from './settings';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-index-client-logo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsPagesLandingIndexClientsComponent implements OnInit {
  public resources: DeployedResources;
  public tierConfiguration = sitesConfiguration
  public viewModel: ViewModel = new ViewModel();
  sectionsInfo = importedSectionsInfo;
  carouselConfiguration = importedResponsive;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public trustedByService: BrochureTrustedByService,
    @Inject(DEPLOYED_RESOURCES) resources: DeployedResources
  ) {
    this.resources = resources;
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
  }
}
