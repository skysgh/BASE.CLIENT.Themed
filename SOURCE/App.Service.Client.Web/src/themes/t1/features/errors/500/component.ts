// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
//
// Configuration:
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';


@Component({
    selector: 'app-base-core-errors-500-todo',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})

/**
 * Page500 Component
 */
export class BaseErrors500TodoComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.
  constructor(private defaultControllerServices: DefaultComponentServices) {
    // Make system/env variables avaiable to view template (via const or service):
    
  }

  ngOnInit(): void {
  }

}
