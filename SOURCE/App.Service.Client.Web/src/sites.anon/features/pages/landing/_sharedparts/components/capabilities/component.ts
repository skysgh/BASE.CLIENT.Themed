// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { ServiceCapabilityService } from '../../../../../../../core/services/service-capability.service';
// Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';
import { servicesModel } from './services.model';
import { Services } from './data';


@Component({
  selector: 'app-base-core-pages-landing-index-capabilities',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Services Component
 * 
 * ✅ REPOSITORY MIGRATION - Phase 3 Complete
 * Updated to use new ServiceCapabilityService (service layer)
 * Removed direct repository access (old pattern)
 * Component now follows repository → mapper → service → component pattern
 * Uses Signal-based reactivity from service
 */
export class BaseAppsPagesLandingIndexCapabilitiesComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  sectionsInfo = importedSectionsInfo;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public capabilityService: ServiceCapabilityService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    /**
     * Data is automatically loaded by service on construction
     * Template accesses capabilityService.enabledCapabilities() signal directly
     */
  }

}
