// Ag:
import { Component, Input, OnInit } from '@angular/core';
// Configuration:
import { sitesConfiguration } from '../../../../../configuration/implementation/sites.configuration';
import { appsConfiguration } from '../../../../../../apps/configuration/implementations/apps.configuration';
// Services:
// Models:
import { ViewModel } from './vm';
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';

@Component({
  selector: 'app-base-core-pages-information-terms',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCorePagesInformationTermsComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel(appsConfiguration);
  // TODO: Move these variables into it.


  // bread crumb items
  breadCrumbItems!: Array<{}>;

  @Input()
  public replacements :{ [key: string]: string }|undefined;

  constructor(
    private defaultControllerServices: DefaultComponentServices) {


    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    // Note that tokens are not wrapped in the {{...}}
    // that must be on to find them:
    // Does not work yet:
    //this.replacements=
    //{
    //  'system.title': this.system.title,
    //  'system.description': this.system.description,
    //  'appsConfiguration.context.sponsor.title': this.appsConfiguration.context.sponsor.title,
    //  'system.dynamic.developer.title': this.system.dynamic.developer.title,
    //}

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
