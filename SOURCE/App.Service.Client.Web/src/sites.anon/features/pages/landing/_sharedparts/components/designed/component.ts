// Rx:
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// ✅ UPDATED: Use brochure applet
import { BrochureFeatureService } from '../../../../../../../sites.app.lets/brochure/services/brochure-feature.service';
// Models:
import { ViewModel } from './vm';
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';


@Component({
  selector: 'app-base-core-pages-landing-index-designed',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsPagesLandingIndexDesignedComponent implements OnInit {
  public appsConfiguration = appsConfiguration
  public groupConfiguration = sitesConfiguration
  public viewModel: ViewModel = new ViewModel();
  sectionsInfo = importedSectionsInfo;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public featureService: BrochureFeatureService) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
  }
}
