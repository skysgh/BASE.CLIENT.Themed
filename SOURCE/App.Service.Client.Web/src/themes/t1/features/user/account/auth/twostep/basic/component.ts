// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
//
// Configuration:
import { appsConfiguration } from '../../../../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-modules-account_auth-twostep-basic',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Two Step Basic Component
 */
export class BasicComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(private defaultControllerServices: DefaultComponentServices) {
    // Make system/env variables avaiable to class & view template:
    //this.system = this.systemService.system;
  }

  ngOnInit(): void {
  }

   /**
   * Confirm Otp Verification
   */
    config = {
      allowNumbersOnly: true,
      length: 4,
      isPasswordInput: false,
      disableAutoFocus: false,
      placeholder: '',
      inputStyles: {
        'width': '80px',
        'height': '50px'
      }
    };

}
