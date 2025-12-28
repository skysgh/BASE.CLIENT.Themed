// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// ✅ UPDATED: Use brochure applet
import { BrochureCapabilityService } from '../../../../../../../sites.app.lets/brochure/services/brochure-capability.service';
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
export class BaseAppsPagesLandingIndexCapabilitiesComponent implements OnInit {
  public groupConfiguration = sitesConfiguration
  public viewModel: ViewModel = new ViewModel();
  sectionsInfo = importedSectionsInfo;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public capabilityService: BrochureCapabilityService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
  }
}
