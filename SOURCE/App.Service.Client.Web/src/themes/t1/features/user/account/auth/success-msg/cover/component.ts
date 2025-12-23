// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Misc:
//
// Configurations:
import { appsConfiguration } from '../../../../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../../../configuration/implementations/themes.t1.configuration';
// Services:
//import { SystemService } from '../../../../../../../../core/services/system.service';
// Models:
import { ViewModel } from './vm';
import { DefaultComponentServices } from '../../../../../../../../core/services/default-controller-services';
// Data:

@Component({
  selector: 'app-base-core-modules-account_auth-success-msg-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Success Msg Cover Component
 */
export class CoverComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Carousel navigation arrow show
  showNavigationArrows: any;

 
  constructor(private defaultControllerServices: DefaultComponentServices) {
    // Make system/env variables avaiable to class & view template:
    //this.system = this.systemService.system;
}

  ngOnInit(): void {
  }

}
