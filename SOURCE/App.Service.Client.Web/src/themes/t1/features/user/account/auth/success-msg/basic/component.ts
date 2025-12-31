// Rx:
//
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

@Component({
    selector: 'app-base-core-modules-account_auth-success-msg-basic',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})

/**
 * Success Msg Basic Component (Theme T1)
 * 
 * ✅ MULTI-ACCOUNT: Uses AccountService for reactive branding
 */
export class BasicComponent implements OnInit {
  public tierConfig = themesT1Configuration;

  // ✅ Account-aware branding (reactive)
  public logo$: Observable<string | undefined>;
  public appTitle$: Observable<string | undefined>;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  constructor(
    defaultControllerServices: DefaultComponentServices,
    private accountService: AccountService
  ) {
    // ✅ Get branding from account config (reactive)
    this.logo$ = this.accountService.getConfigValue('branding.logo');
    this.appTitle$ = this.accountService.getConfigValue('name');
  }

  ngOnInit(): void {
  }
}
