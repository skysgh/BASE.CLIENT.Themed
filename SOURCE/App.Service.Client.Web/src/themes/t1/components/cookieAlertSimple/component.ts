// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';
// Data:


@Component({
    selector: 'app-base-common-components-cookie-alert-simple',
    //template: '{{this.appsConfiguration.}}'
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
/**
 * Component to show a bar at the bottom of the screen (or similar)
 * that provides an button for users to Accept Action
 * which creates a cookie to track their Acceptance.
 * Note: a bit circular if you ask me...
 */
export class BaseCoreCommonComponentsCookieAlertSimpleComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  
  constructor(private defaultControllerServices: DefaultComponentServices) {
    
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    // Make system/env variables avaiable to class & view template:
    //this.system = this.systemService.system;
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);
  }
}
