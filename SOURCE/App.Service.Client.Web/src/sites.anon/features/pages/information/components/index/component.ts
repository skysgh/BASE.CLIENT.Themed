// Rx:
// 
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';


@Component({
    selector: 'app-base-core-pages-information-index',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})

/**
 * Information Index Component
 * 
 * ⚠️ PARTIAL MIGRATION - Template Still Uses appsConfiguration
 * Template uses appsConfiguration.navigation.pages extensively
 * Need to create PAGES_NAVIGATION token or keep appsConfiguration
 * 
 * TODO: Create comprehensive navigation token structure
 * See: _custom/documentation/COMPONENT-MIGRATION-PROGRESS.md "Deeper Migrations Needed"
 */
export class BaseCorePagesInformationIndexComponent implements OnInit {
  // ⚠️ Temporarily restored for template compatibility
  public appsConfiguration = appsConfiguration
  
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  constructor(private defaultControllerServices: DefaultComponentServices) {
    // Make system/env variables avaiable to view template (via singleton or service):

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)

    // Configure breadcrumbs:
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Information' },
      { label: 'Term & Conditions', active: true }
    ];
  }
}
