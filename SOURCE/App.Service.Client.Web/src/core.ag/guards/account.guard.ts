import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

// ✅ Core tier imports (Angular-agnostic services)
import { AccountService } from '../../core/services/account.service';

/**
 * Account Validation Guard
 * 
 * ✅ LOCATION: core.ag (Angular-specific)
 * 
 * This guard uses Angular Router and CanActivate interface,
 * therefore it belongs in core.ag, not core.
 * 
 * Checks if the current account configuration was successfully loaded.
 * If account ID was detected in URL but config not found, redirect to 404-A error.
 * 
 * ✅ Usage: Apply to all :accountId routes
 * 
 * Example in routing.ts:
 * ```typescript
 * {
 *   path: ':accountId/pages',
 *   loadChildren: () => import('...'),
 *   canActivate: [AccountGuard]
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate {
  
  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    // Check if account was found
    if (this.accountService.isAccountNotFound()) {
      const accountId = this.accountService.getAccountId();
      
      console.warn(`[AccountGuard] Account '${accountId}' not found, redirecting to 404-A`);
      
      // Store account ID for error page
      sessionStorage.setItem('accountNotFoundId', accountId);
      
      // Redirect to account-not-found error
      this.router.navigate(['/errors/404-account-not-found']);
      
      return false;
    }
    
    // Account valid, allow navigation
    console.log(`[AccountGuard] Account '${this.accountService.getAccountId()}' validated`);
    return true;
  }
}
