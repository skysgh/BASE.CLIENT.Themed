// Rx:
//
// Ag:
import { Component } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';


@Component({
  selector: 'app-common-search-edit',
  templateUrl: './common-search-edit.component.html',
  styleUrls: ['./common-search-edit.component.scss']
})

export class SearchContainerEditComponent {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(private defaultControllerServices: DefaultComponentServices) {
    this.defaultControllerServices.diagnosticsTraceService.info("SearchContainerEdit Initialised");
  }
}
