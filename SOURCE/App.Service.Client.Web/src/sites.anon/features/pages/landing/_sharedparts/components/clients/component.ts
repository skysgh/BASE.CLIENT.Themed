// Ag:
import { Component, OnInit, Inject } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Tokens:
import { DEPLOYED_RESOURCES, DeployedResources } from '../../../../../../../core/tokens';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../../../core/services/system.diagnostics-trace.service';
// Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ServiceTrustedByService } from '../../../../../../../core/services/service.trusted-by.service';
import { ServiceTrustedByVTO } from '../../../../../../../core/models/view/service.trusted-by.vto.model';
import { Observable, of } from 'rxjs';
import { Responsive as importedResponsive } from './settings';
import { ViewModel } from './vm';
import { SystemDefaultServices } from '../../../../../../../core/services/system.default-services.service';
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';

@Component({
  selector: 'app-base-core-pages-landing-index-client-logo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * ClientLogoComponent - Trusted By Section
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

  // Define an observable:
  public list$: Observable<ServiceTrustedByVTO[]> = of([]);

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private serviceTrustedByService: ServiceTrustedByService,
    @Inject(DEPLOYED_RESOURCES) resources: DeployedResources
  ) {
    // ✅ Store injected resources for template access
    this.resources = resources;

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    this.initList();
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }

  private initList() {
    this.serviceTrustedByService 
      .items$
      .subscribe(list => {
        if (list.length == 0) {
          this.defaultControllerServices.diagnosticsTraceService.warn("...early exit...");
          return;
        }
        this.list$ = of(list)
      });
  }
}
