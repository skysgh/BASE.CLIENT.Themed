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
import { NavigationService } from '../../../../../../core/services/navigation.service';
// ✅ UPDATED: Import from core.ag
import { OidcService } from '../../../../../../core.ag/auth/services/oidc.service';
import { FakeAuthRepository } from '../../../../../../core.ag/auth/services/fake-auth-repository.service';
// Models:
import { ViewModel } from './vm';
// ✅ UPDATED: Import from core.ag
import { AuthProviderDisplay } from '../../../../../../core.ag/auth/ui/widgets/auth-provider-list.component';
import { EmailLoginCredentials } from '../../../../../../core.ag/auth/ui/widgets/email-login-form.component';
// Environment
import { environment } from '../../../../../../environments/environment';

// Constants:
//

type LoginView = 'providers' | 'email';

@Component({
    selector: 'app-base-core-modules-account_auth-login',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})

/**
 * Login Component (Theme T1)
 * 
 * ✅ PROVIDER-FIRST: Shows identity provider options prominently
 * ✅ MULTI-ACCOUNT: Uses AccountService for reactive branding
 * ✅ ACCOUNT-AWARE: Uses NavigationService for account-preserving navigation
 * ✅ UNIFIED AUTH: Uses FakeAuthRepository for demo, OIDC for production
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
  returnUrl = '';  // Will be set with account-aware URL

  // Configuration
  allowLocalLogin = true;
  hasOidcProviders = false;

  // Dev defaults (only in dev mode)
  defaultEmail = '';
  defaultPassword = '';

  // Routes (account-aware)
  signUpRoute = '';
  forgotPasswordRoute = '';
  
  // Back navigation
  showBackToLanding = false;
  landingUrl = '/';

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
    private navigationService: NavigationService,
    private oidcService: OidcService,
    private fakeAuthRepo: FakeAuthRepository
  ) {
    // ✅ Get branding from account config (reactive)
    this.logo$ = this.accountService.getConfigValue('branding.logo');
    this.appTitle$ = this.accountService.getConfigValue('name');
    this.appDescription$ = this.accountService.getConfigValue('description');
  }

  ngOnInit(): void {
    // ✅ ACCOUNT-AWARE: Get return URL from query params OR use account-aware default
    const queryReturnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.returnUrl = queryReturnUrl || this.navigationService.getPostLoginUrl();
    
    // ✅ ACCOUNT-AWARE: Set routes with account prefix
    this.signUpRoute = this.navigationService.getUrl('auth/signup');
    this.forgotPasswordRoute = this.navigationService.getUrl('auth/forgot-password');
    this.landingUrl = this.navigationService.getUrl('/');
    
    // Determine if we should show back button to landing
    // Show if: no returnUrl query param (came from landing/direct navigation)
    // Hide if: came from signup (already has link) or has specific returnUrl
    const fromSignup = document.referrer.includes('signup');
    this.showBackToLanding = !queryReturnUrl && !fromSignup;
    
    console.log('[LoginComponent] Return URL:', this.returnUrl);
    console.log('[LoginComponent] Current account:', this.navigationService.getCurrentAccountId());
    console.log('[LoginComponent] Show back to landing:', this.showBackToLanding);

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

    // ✅ CHANGED: Always start with provider view
    // Even if no OIDC providers are enabled, show the provider selection
    // because it includes the "Continue with Email" option.
    // This gives users a consistent experience and shows what options are available.
    // 
    // The provider list component will:
    // - Show OIDC providers if enabled
    // - Always show "Continue with Email" if allowLocalLogin is true
    // - User clicks Email → navigates to email form
    //
    // OLD CODE (removed): 
    // if (!this.hasOidcProviders) {
    //   this.currentView = 'email';
    // }
    
    // Keep default: currentView = 'providers' (set in property initialization)
    console.log('[LoginComponent] Provider config loaded:', {
      hasOidcProviders: this.hasOidcProviders,
      allowLocalLogin: this.allowLocalLogin,
      currentView: this.currentView
    });
  }

  /**
   * Check if user is already logged in
   */
  private checkExistingSession(): void {
    // Check OIDC session
    if (this.oidcService.isAuthenticated()) {
      this.navigationService.navigateByUrl(this.returnUrl);
      return;
    }

    // Check fake auth session
    if (this.authFakeService.currentUserValue) {
      this.navigationService.navigateByUrl(this.returnUrl);
      return;
    }

    // Check session storage
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      this.navigationService.navigateByUrl(this.returnUrl);
    }
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
   * Uses FakeAuthRepository for unified User+DigitalIdentity management
   */
  async onEmailLogin(credentials: EmailLoginCredentials): Promise<void> {
    console.log('[LoginComponent] Email login:', credentials.email);
    console.log('[LoginComponent] Return URL will be:', this.returnUrl);
    
    this.loading = true;
    this.errorMessage = null;

    try {
      // Use FakeAuthRepository for demo mode
      const result = await this.fakeAuthRepo.login(credentials.email, credentials.password);
      console.log('[LoginComponent] Login result:', result);
      
      if (result.success) {
        // Store in session
        console.log('[LoginComponent] Storing user in sessionStorage...');
        sessionStorage.setItem('currentUser', JSON.stringify(result.user));
        if (result.token) {
          sessionStorage.setItem('token', result.token);
        }
        if (result.person) {
          sessionStorage.setItem('currentPerson', JSON.stringify(result.person));
        }
        
        // Verify storage
        console.log('[LoginComponent] Stored currentUser:', sessionStorage.getItem('currentUser'));
        
        // Show success toast
        sessionStorage.setItem('toast', 'true');
        this.toastService.show('Welcome back!', { classname: 'bg-success text-white' });
        
        // ✅ Navigate to return URL (account-aware)
        console.log('[LoginComponent] Navigating to:', this.returnUrl);
        try {
          await this.navigationService.navigateByUrl(this.returnUrl);
          console.log('[LoginComponent] Navigation successful');
        } catch (navError) {
          console.error('[LoginComponent] Navigation error:', navError);
        }
      } else {
        // Handle lockout
        if (result.lockedUntil) {
          const lockTime = new Date(result.lockedUntil);
          this.errorMessage = `Account locked until ${lockTime.toLocaleTimeString()}`;
        } else {
          this.errorMessage = result.error || 'Login failed. Please check your credentials.';
        }
        this.toastService.show(this.errorMessage, { classname: 'bg-danger text-white', delay: 5000 });
      }
    } catch (error: any) {
      console.error('[LoginComponent] Login error:', error);
      this.errorMessage = error.message || 'Login failed. Please try again.';
      this.toastService.show(this.errorMessage!, { classname: 'bg-danger text-white', delay: 5000 });
    } finally {
      this.loading = false;
    }
  }

  /**
   * Show provider selection view
   */
  showProviders(): void {
    this.currentView = 'providers';
    this.errorMessage = null;
  }

  /**
   * Navigate back to landing page
   */
  goToLanding(): void {
    this.navigationService.navigateByUrl(this.landingUrl);
  }
}
