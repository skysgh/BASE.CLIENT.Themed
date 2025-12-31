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
    styleUrls: ['./component.scss'],
    standalone: false
})

/**
 * Account Not Found Component (404-A)
 * 
 * Displayed when a user navigates to a URL with an invalid account ID.
 * 
 * Examples:
 * - /invalid-account/pages → Shows "Account 'invalid-account' not found"
 * - /xyz/apps → Shows "Account 'xyz' not found"
 * 
 * ✅ IMPORTANT: This is different from generic 404!
 * - 404 = Page/route not found (within valid account)
 * - 404-A = Account ID detected but account config not found
 * 
 * Flow:
 * 1. APP_INITIALIZER detects invalid account ID in URL
 * 2. Stores account ID in sessionStorage
 * 3. Redirects to /errors/404-account-not-found
 * 4. This component displays the error with account ID
 */
export class BaseErrorsAccountNotFoundComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  /** Detected account ID from URL that was not found */
  public accountId: string = '';

  /** Observable for logo URL from account config (will use default) */
  public logoUrl$: Observable<string | undefined>;

  /** Observable for site title */
  public siteTitle$: Observable<string | undefined>;

  constructor(
    private defaultComponentServices: DefaultComponentServices,
    private accountService: AccountService
  ) {
    // Get account config values reactively (will use default account config)
    this.logoUrl$ = this.accountService.getConfigValue<string>('branding.logoDark');
    this.siteTitle$ = this.accountService.getConfigValue<string>('title');
  }

  ngOnInit(): void {
    // Get the account ID that was attempted from sessionStorage
    // (Set by APP_INITIALIZER in apps.bootstrap/module.ts)
    this.accountId = sessionStorage.getItem('accountNotFoundId') || this.accountService.getAccountId();
    
    // Clear the sessionStorage flag after reading
    sessionStorage.removeItem('accountNotFoundId');
    
    // Log for debugging
    console.warn(`[AccountNotFound] Showing 404-A for account: ${this.accountId}`);
  }
}
