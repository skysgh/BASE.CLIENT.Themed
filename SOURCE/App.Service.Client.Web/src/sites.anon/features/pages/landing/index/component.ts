// Rx:
//
// Ag:
import { Component } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../apps/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-index',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Landing Index Component
 * 
 * ⚠️ PARTIAL MIGRATION - Template Still Uses appsConfiguration
 * Template uses appsConfiguration.navigation.pages.open.landing extensively
 * Need comprehensive PAGES_NAVIGATION token or keep appsConfiguration
 * 
 * TODO: Expand NAVIGATION_PATHS to include pages.open.landing routes
 * See: _custom/documentation/COMPONENT-MIGRATION-PROGRESS.md "Deeper Migrations Needed"
 */
export class BaseCorePagesLandingIndexComponent  {
  // ⚠️ Temporarily restored for template compatibility
  public appsConfiguration = appsConfiguration
  
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(
    private defaultControllerServices: DefaultComponentServices) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }


}
