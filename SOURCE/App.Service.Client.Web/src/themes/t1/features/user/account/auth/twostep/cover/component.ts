// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Misc:
// 
// Configuration:
import { appsConfiguration } from '../../../../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../../core/services/default-controller-services';
// Services:
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-modules-account_auth-twostep-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * TwoStep Cover Component
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
    // Make system/env variables avaiable to view template (via singleton or service):
    
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
