// Rx:

// Ag:
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-index-demos',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Footer Component
 */
export class BaseAppsPagesLandingIndexDemosComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  showNavigationArrows: any;
  showNavigationIndicators: any;

  constructor(
    private defaultControllerServices: DefaultComponentServices) {
    // Make system/env variables avaiable to view template (via singleton or service):


    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);

   
  }


  ngOnInit(): void {
  }

}
