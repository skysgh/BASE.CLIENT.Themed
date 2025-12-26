// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:

// Services:
//import { SystemService } from '../../../../../../core/services/system.service';
import { ViewModel } from './vm';
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';

@Component({
  selector: 'app-base-core-errors-alt',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * 404 Alt Component
 */
export class BaseErrors404AltComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.
  constructor(private defaultControllerServices: DefaultComponentServices) {
  }

  ngOnInit(): void {
  }

}
