// Rx:
import { Observable } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Etc:
//
// Configuration:
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';

// Services
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { AuthenticationService } from '../../../../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../../../../core/services/authfake.service';
import { TitleService } from '../../../../../../core/services/title.service';
import { ToastService } from '../../../../../../core/services/toast.service';
import { EnvConfigService } from '../../../../../../core/services/env-config.service';
import { AccountService } from '../../../../../../core/services/account.service';
// ✅ UPDATED: Import from core.ag
import { OidcService } from '../../../../../../core.ag/auth/services/oidc.service';
// Models:
import { ViewModel } from './vm';
// ✅ UPDATED: Import from core.ag
import { AuthProviderDisplay } from '../../../../../../core.ag/auth/components/auth-provider-list.component';
import { EmailLoginCredentials } from '../../../../../../core.ag/auth/components/email-login-form.component';
// Environment
import { environment } from '../../../../../../environments/environment';

// Constants:
//

type LoginView = 'providers' | 'email';

@Component({
  selector: 'app-base-core-modules-account_auth-login',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Login Component (Theme T1)
 * 
 * ✅ PROVIDER-FIRST: Shows identity provider options prominently
 * ✅ MULTI-ACCOUNT: Uses AccountService for reactive branding
 * 
 * Flow:
 * 1. User sees provider options (Microsoft, Google, Email)
 * 2. Clicking OIDC provider → redirect to IdP
 * 3. Clicking Email → show email/password form
 */
export class LoginComponent implements OnInit {
  public tierConfig = themesT1Configuration;

  // ✅ Account-aware branding (reactive)
  public logo$: Observable<string | undefined>;
  public appTitle$: Observable<string | undefined>;
  public appDescription$: Observable<string | undefined>;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // ============================================
  // Provider-First State
  // ============================================
  
  currentView: LoginView = 'providers';
  loading = false;
  errorMessage: string | null = null;
  returnUrl = '/dashboards/main';

  // Configuration
  allowLocalLogin = true;
  hasOidcProviders = false;

  // Dev defaults (only in dev mode)
  defaultEmail = '';
  defaultPassword = '';

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private titleService: TitleService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private authFakeService: AuthfakeauthenticationService,
    private route: ActivatedRoute,
    public toastService: ToastService,
    private envConfig: EnvConfigService,
    private accountService: AccountService,
    private oidcService: OidcService
  ) {
    // ✅ Get branding from account config (reactive)
    this.logo$ = this.accountService.getConfigValue('branding.logo');
    this.appTitle$ = this.accountService.getConfigValue('name');
    this.appDescription$ = this.accountService.getConfigValue('description');
  }

  ngOnInit(): void {
    // Get return URL from query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.getPostLoginRedirect();

    // Load OIDC configuration
    this.loadConfiguration();

    // Check if already logged in
    this.checkExistingSession();

    // Dev mode defaults
    if (!environment.production) {
      this.defaultEmail = 'admin@themesbrand.com';
      this.defaultPassword = '123456';
    }
  }

  /**
   * Load OIDC configuration
   */
  private loadConfiguration(): void {
    const config = environment.oidcConfig;
    
    if (config) {
      this.allowLocalLogin = config.allowLocalLogin !== false;
      this.hasOidcProviders = config.providers.some(p => p.enabled);
    } else {
      // No OIDC config - default to email only
      this.allowLocalLogin = true;
      this.hasOidcProviders = false;
    }

    // If no OIDC providers enabled, go straight to email form
    if (!this.hasOidcProviders) {
      this.currentView = 'email';
    }
  }

  /**
   * Check if user is already logged in
   */
  private checkExistingSession(): void {
    // Check OIDC session
    if (this.oidcService.isAuthenticated()) {
      this.router.navigateByUrl(this.returnUrl);
      return;
    }

    // Check fake auth session
    if (this.authFakeService.currentUserValue) {
      this.router.navigateByUrl(this.returnUrl);
      return;
    }

    // Check session storage
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  /**
   * Get post-login redirect destination
   * Priority: returnUrl query param > runtime config > theme default
   */
  private getPostLoginRedirect(): string {
    try {
      const runtimeConfig = this.envConfig.get();
      if (runtimeConfig.postLoginRedirect) {
        return runtimeConfig.postLoginRedirect;
      }
    } catch (error) {
      console.warn('[LoginComponent] EnvConfig not available, using theme default');
    }
    
    return this.tierConfig.postLoginRedirect;
  }

  // ============================================
  // Provider Selection
  // ============================================

  /**
   * Handle provider selection
   */
  onProviderSelected(provider: AuthProviderDisplay): void {
    console.log('[LoginComponent] Provider selected:', provider.id);

    if (provider.type === 'local') {
      // Show email form
      this.currentView = 'email';
    } else {
      // Initiate OIDC login
      this.initiateOidcLogin(provider.id);
    }
  }

  /**
   * Initiate OIDC login flow
   */
  private async initiateOidcLogin(providerId: string): Promise<void> {
    try {
      this.loading = true;
      this.errorMessage = null;
      
      await this.oidcService.login(providerId as any, this.returnUrl);
      
      // Note: The page will redirect to IdP, so we won't reach here
    } catch (error: any) {
      console.error('[LoginComponent] OIDC login failed:', error);
      this.errorMessage = error.message || 'Failed to initiate sign in. Please try again.';
      this.loading = false;
    }
  }

  // ============================================
  // Email/Password Login
  // ============================================

  /**
   * Handle email/password login
   */
  onEmailLogin(credentials: EmailLoginCredentials): void {
    console.log('[LoginComponent] Email login:', credentials.email);
    
    this.loading = true;
    this.errorMessage = null;

    // Use the appropriate auth service based on environment
    const authMode = environment.defaultauth;

    if (authMode === 'firebase') {
      this.authenticationService.login(credentials.email, credentials.password).subscribe({
        next: this.handleLoginSuccess.bind(this),
        error: this.handleLoginError.bind(this)
      });
    } else {
      // Fake backend or API login
      this.authFakeService.login(credentials.email, credentials.password).subscribe({
        next: this.handleLoginSuccess.bind(this),
        error: this.handleLoginError.bind(this)
      });
    }
  }

  /**
   * Handle successful login
   */
  private handleLoginSuccess(response: any): void {
    this.loading = false;
    
    if (response?.token || response) {
      // Store in session
      sessionStorage.setItem('currentUser', JSON.stringify(response.data || response));
      if (response.token) {
        sessionStorage.setItem('token', response.token);
      }
      
      // Show success toast
      sessionStorage.setItem('toast', 'true');
      
      // Navigate to return URL
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.errorMessage = response?.message || 'Login failed. Please check your credentials.';
    }
  }

  /**
   * Handle login error
   */
  private handleLoginError(error: any): void {
    this.loading = false;
    console.error('[LoginComponent] Login error:', error);
    this.errorMessage = error?.error?.message || error?.message || 'Login failed. Please try again.';
    this.toastService.show(this.errorMessage!, { classname: 'bg-danger text-white', delay: 5000 });
  }

  /**
   * Show provider selection view
   */
  showProviders(): void {
    this.currentView = 'providers';
    this.errorMessage = null;
  }
}
