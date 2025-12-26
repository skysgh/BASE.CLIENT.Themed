// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Misc:
//
// Configurations:
// ✅ FIXED: Use theme-tier configuration (not app-tier)
import { themesT1Configuration } from '../../../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';
// Data:

@Component({
  selector: 'app-base-core-modules-account_auth-success-msg-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Success Msg Cover Component (Theme T1)
 * 
 * ✅ REFACTORED: Complete Tier Independence
 */
export class CoverComponent implements OnInit {
  // ✅ SINGLE config object (tier independence!)
  public tierConfig = themesT1Configuration;

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
