// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// Data/Models:
import { ProcessModel } from './process.model';
import { Process } from './data';
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-index-work-process',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * WorkProcess Component
 */
export class BaseAppsPagesLandingIndexWorkProcessComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  Process!: ProcessModel[];
  
  constructor(
    private defaultControllerServices : DefaultComponentServices) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
    /**
     * fetches data
     */
     this._fetchData();
  }

  /**
 * User grid data fetches
 */
   private _fetchData() {
    this.Process = Process;
  }

}
