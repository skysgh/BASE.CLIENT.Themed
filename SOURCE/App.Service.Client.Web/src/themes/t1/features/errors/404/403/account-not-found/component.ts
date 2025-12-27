// Ag:
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
// Etc:
//
// Configuration:
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { AccountService } from '../../../../../../core/services/account.service';
// Models:
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-errors-account-not-found',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Account Not Found Component
 * Displayed when a user navigates to a URL with an invalid account ID
 * Example: /invalid-account/pages -> This page shows "Account 'invalid-account' not found"
 */
export class BaseErrorsAccountNotFoundComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  /** Detected account ID from URL */
  public accountId: string = '';

  /** Observable for logo URL from account config */
  public logoUrl$: Observable<string | undefined>;

  /** Observable for site title */
  public siteTitle$: Observable<string | undefined>;

  constructor(
    private defaultComponentServices: DefaultComponentServices,
    private accountService: AccountService
  ) {
    // Get account config values reactively
    this.logoUrl$ = this.accountService.getConfigValue<string>('branding.logo');
    this.siteTitle$ = this.accountService.getConfigValue<string>('title');
  }

  ngOnInit(): void {
    // Get the account ID that was attempted
    this.accountId = this.accountService.getAccountId();
    
    // Check if this is actually a "not found" scenario
    if (!this.accountService.isAccountNotFound()) {
      // Config was found, redirect to 404 instead
      window.location.href = '/errors/404';
    }
  }
}
