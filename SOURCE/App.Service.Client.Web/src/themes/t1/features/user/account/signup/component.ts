/**
 * Sign Up Component (Theme T1)
 * 
 * Provider-first registration experience.
 * 
 * ✅ PROVIDER-FIRST: Shows identity provider options prominently
 * ✅ MULTI-ACCOUNT: Uses AccountService for reactive branding
 * ✅ ACCOUNT-AWARE: Uses NavigationService for account-preserving navigation
 */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

// Configuration
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';

// Services
import { AccountService } from '../../../../../../core/services/account.service';
import { NavigationService } from '../../../../../../core/services/navigation.service';
import { ToastService } from '../../../../../../core/services/toast.service';
import { OidcService } from '../../../../../../core.ag/auth/services/oidc.service';
import { FakeAuthRepository } from '../../../../../../core.ag/auth/services/fake-auth-repository.service';
import { AuthfakeauthenticationService } from '../../../../../../core/services/authfake.service';

// Models
import { AuthProviderDisplay } from '../../../../../../core.ag/auth/components/auth-provider-list.component';
import { EmailSignupRequest } from '../../../../../../core.ag/auth/components/email-signup-form.component';

// Environment
import { environment } from '../../../../../../environments/environment';

type SignUpView = 'providers' | 'email';

@Component({
  selector: 'app-signup',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  standalone: false
})
export class SignUpComponent implements OnInit {
  public tierConfig = themesT1Configuration;

  // ✅ Account-aware branding (reactive)
  public logo$: Observable<string | undefined>;
  public appDescription$: Observable<string | undefined>;

  // State
  currentView: SignUpView = 'providers';
  loading = false;
  errorMessage: string | null = null;
  returnUrl = '';

  // Configuration
  hasOidcProviders = false;
  allowLocalLogin = true;

  // Routes (account-aware)
  signInRoute = '';
  forgotPasswordRoute = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private navigationService: NavigationService,
    private toastService: ToastService,
    private oidcService: OidcService,
    private fakeAuthRepo: FakeAuthRepository,
    private authFakeService: AuthfakeauthenticationService
  ) {
    // ✅ Get branding from account config (reactive)
    this.logo$ = this.accountService.getConfigValue('branding.logo');
    this.appDescription$ = this.accountService.getConfigValue('description');
  }

  ngOnInit(): void {
    // ✅ ACCOUNT-AWARE: Get return URL from query params OR use account-aware default
    const queryReturnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.returnUrl = queryReturnUrl || this.navigationService.getPostLoginUrl();

    // ✅ ACCOUNT-AWARE: Set routes with account prefix
    this.signInRoute = this.navigationService.getUrl('auth/signin');
    this.forgotPasswordRoute = this.navigationService.getUrl('auth/forgot-password');

    console.log('[SignUpComponent] Return URL:', this.returnUrl);
    console.log('[SignUpComponent] Current account:', this.navigationService.getCurrentAccountId());

    // Load configuration
    this.loadConfiguration();

    // Check if already logged in
    this.checkExistingSession();
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
      this.allowLocalLogin = true;
      this.hasOidcProviders = false;
    }

    // Always start with provider view
    console.log('[SignUpComponent] Provider config loaded:', {
      hasOidcProviders: this.hasOidcProviders,
      allowLocalLogin: this.allowLocalLogin
    });
  }

  /**
   * Check if user is already logged in
   */
  private checkExistingSession(): void {
    if (this.oidcService.isAuthenticated()) {
      this.navigationService.navigateByUrl(this.returnUrl);
      return;
    }

    if (this.authFakeService.currentUserValue) {
      this.navigationService.navigateByUrl(this.returnUrl);
      return;
    }

    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      this.navigationService.navigateByUrl(this.returnUrl);
    }
  }

  /**
   * Handle provider selection
   */
  onProviderSelected(provider: AuthProviderDisplay): void {
    console.log('[SignUpComponent] Provider selected:', provider.id);

    if (provider.type === 'local') {
      this.currentView = 'email';
    } else {
      this.initiateOidcSignup(provider.id);
    }
  }

  /**
   * Initiate OIDC signup (same as login - IdP handles account creation)
   */
  private async initiateOidcSignup(providerId: string): Promise<void> {
    try {
      this.loading = true;
      this.errorMessage = null;

      await this.oidcService.login(providerId as any, this.returnUrl);
    } catch (error: any) {
      console.error('[SignUpComponent] OIDC signup failed:', error);
      this.errorMessage = error.message || 'Failed to initiate sign up. Please try again.';
      this.loading = false;
    }
  }

  /**
   * Handle email signup
   */
  async onEmailSignup(request: EmailSignupRequest): Promise<void> {
    console.log('[SignUpComponent] Email signup:', request.email);

    this.loading = true;
    this.errorMessage = null;

    try {
      // Extract and provide defaults for optional fields
      const firstName = request.firstName ?? 'New';
      const lastName = request.lastName ?? 'User';
      
      const result = await this.fakeAuthRepo.register({
        email: request.email,
        password: request.password,
        firstName: firstName,
        lastName: lastName
      });

      if (result.success) {
        // Store in session
        sessionStorage.setItem('currentUser', JSON.stringify(result.user));
        if (result.token) {
          sessionStorage.setItem('token', result.token);
        }
        if (result.person) {
          sessionStorage.setItem('currentPerson', JSON.stringify(result.person));
        }

        // Show success toast
        sessionStorage.setItem('toast', 'true');
        this.toastService.show('Account created successfully!', {
          classname: 'bg-success text-white'
        });

        // Navigate to return URL
        await this.navigationService.navigateByUrl(this.returnUrl);
      } else {
        this.errorMessage = result.error || 'Registration failed. Please try again.';
        this.toastService.show(this.errorMessage, { classname: 'bg-danger text-white', delay: 5000 });
      }
    } catch (error: any) {
      console.error('[SignUpComponent] Registration error:', error);
      this.errorMessage = error.message || 'Registration failed. Please try again.';
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
}
