import { Component } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';

@Component({
  selector: 'app-common-search-read',
  templateUrl: './common-search-read.component.html',
  styleUrls: ['./common-search-read.component.scss']
})

export class SearchContainerReadComponent {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(private defaultControllerServices: DefaultComponentServices) {
    this.defaultControllerServices.diagnosticsTraceService.info("SearchContainerRead Initialised");
  }
}
