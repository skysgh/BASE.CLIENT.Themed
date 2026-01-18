/**
 * Error View Component
 * 
 * A single reusable error page component that handles all error codes.
 * Receives error code from route parameter and looks up configuration.
 * 
 * Route: /errors/:code (e.g., /errors/404, /errors/500)
 * 
 * UX:
 * - Back button: Primary (blue), first position - always shown
 * - Home/Hub link: Secondary (outline), second position
 *   - Shows "Hub" for authenticated users
 *   - Shows "Home" for anonymous users
 * 
 * i18n:
 * - Title and description use translation keys from errorConfig
 * - Translated via baseTranslate pipe
 */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ErrorPageConfig, getErrorConfig } from '../../../models/error-data';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { AccountService } from '../../../../../core/services/account.service';
import { OidcService } from '../../../../../core.ag/auth/services/oidc.service';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseCoreAgPipesModule],
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class ErrorComponent implements OnInit {
  private navigationService = inject(NavigationService);
  private accountService = inject(AccountService);
  private oidcService = inject(OidcService);
  private location = inject(Location);
  
  // Error configuration (loaded from route param)
  errorConfig!: ErrorPageConfig;
  errorCode = '000';
  
  // Account ID for 404-A errors
  accountId = '';
  
  // Navigation URL (account-aware, context-aware)
  homeUrl = '/';
  
  // Authentication state (determines Home vs Hub label)
  isAuthenticated = false;
  
  year = new Date().getFullYear();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check authentication state
    this.isAuthenticated = this.oidcService.isAuthenticated();
    
    // Set home URL based on authentication state
    if (this.isAuthenticated) {
      this.homeUrl = this.navigationService.getUrl('system/hub');
    } else {
      this.homeUrl = '/';
    }
    
    // Get error code from route parameter
    this.route.params.subscribe(params => {
      const code = params['code'] || '000';
      this.errorCode = code;
      this.errorConfig = getErrorConfig(code);
      
      // For 404-A, get the account ID from sessionStorage
      if (code === '404-A') {
        this.accountId = sessionStorage.getItem('accountNotFoundId') || this.accountService.getAccountId();
        sessionStorage.removeItem('accountNotFoundId');
      }
      
      console.log(`[ErrorComponent] Loaded error page: ${code}`);
    });
  }

  /**
   * Navigate back in history
   */
  goBack(): void {
    this.location.back();
  }
}
