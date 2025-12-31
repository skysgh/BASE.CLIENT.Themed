// Rx:
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// Describe applet (now in sites.app.parts):
import { ServiceDescribeFeatureService } from '../../../../../../../sites.app.parts/describe/services/service-describe-feature.service';
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
    public featureService: ServiceDescribeFeatureService) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
  }
}
