// Rx:
import { Observable } from 'rxjs';
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Misc:
//
// Configurations:
import { themesT1Configuration } from '../../../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../../core/services/default-controller-services';
import { AccountService } from '../../../../../../../../core/services/account.service';
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
 * ✅ MULTI-ACCOUNT: Uses AccountService for reactive branding
 */
export class CoverComponent implements OnInit {
  public tierConfig = themesT1Configuration;

  // ✅ Account-aware branding (reactive)
  public logo$: Observable<string | undefined>;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private accountService: AccountService
  ) {
    // ✅ Get branding from account config (reactive)
    this.logo$ = this.accountService.getConfigValue('branding.logo');
  }

  ngOnInit(): void {
  }
}
