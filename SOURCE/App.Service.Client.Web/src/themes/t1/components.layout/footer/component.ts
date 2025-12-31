// Rx:
import { Observable } from 'rxjs';
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../core/services/default-controller-services';
import { AccountService } from '../../../../core/services/account.service';
// Models:
import { ViewModel } from './vm';

@Component({
    selector: 'app-footer',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
/**
 * ✅ MULTI-ACCOUNT: Uses AccountService for reactive branding
 */
export class BaseLayoutFooterComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // ✅ Account-aware branding (reactive)
  public logo$: Observable<string | undefined>;
  public appTitle$: Observable<string | undefined>;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private accountService: AccountService
  ) {
    // ✅ Get branding from account config (reactive)
    this.logo$ = this.accountService.getConfigValue('branding.logo');
    this.appTitle$ = this.accountService.getConfigValue('name');
  }

  ngOnInit(): void {
  }
}
