/**
 * Unified Sign In Component
 * 
 * Provider-first login experience:
 * 1. User sees provider options (Microsoft, Google, Email)
 * 2. Clicking OIDC provider → redirect to IdP
 * 3. Clicking Email → show email/password form
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

// Components
import { AuthProviderListComponent, AuthProviderDisplay } from './auth-provider-list.component';
import { EmailLoginFormComponent, EmailLoginCredentials } from './email-login-form.component';

// Services
import { OidcService } from '../services/oidc.service';
import { AccountService } from '../../services/account.service';
import { ToastService } from '../../services/toast.service';
import { AuthfakeauthenticationService } from '../../services/authfake.service';
import { AuthenticationService } from '../../services/auth.service';

// Config
import { environment } from '../../../environments/environment';

type SignInView = 'providers' | 'email';

@Component({
  selector: 'app-unified-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    AuthProviderListComponent,
    EmailLoginFormComponent
  ],
  template: `
    <div class="unified-sign-in">
      
      <!-- Provider Selection View -->
      <div *ngIf="currentView === 'providers'" class="provider-view">
        <div class="text-center mb-4">
          <h5 class="text-primary">{{ welcomeTitle }}</h5>
          <p class="text-muted">{{ welcomeSubtitle }}</p>
        </div>

        <app-auth-provider-list
          [continueWithText]="continueWithText"
          [showEmailOption]="allowLocalLogin"
          (providerSelected)="onProviderSelected($event)">
        </app-auth-provider-list>
      </div>

      <!-- Email Login View -->
      <div *ngIf="currentView === 'email'" class="email-view">
        <div class="text-center mb-4">
          <h5 class="text-primary">{{ emailWelcomeTitle }}</h5>
          <p class="text-muted">{{ emailWelcomeSubtitle }}</p>
        </div>

        <app-email-login-form
          [showBackButton]="hasOidcProviders"
          [backText]="backToProvidersText"
          [loading]="loading"
          [errorMessage]="errorMessage"
          [defaultEmail]="defaultEmail"
          [defaultPassword]="defaultPassword"
          (loginSubmit)="onEmailLogin($event)"
          (backClicked)="showProviders()">
        </app-email-login-form>
      </div>

    </div>
  `,
  styles: [`
    .unified-sign-in {
      width: 100%;
    }

    .provider-view,
    .email-view {
      animation: fadeIn 0.2s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class UnifiedSignInComponent implements OnInit {
  
  // Current view
  currentView: SignInView = 'providers';

  // Configuration
  allowLocalLogin = true;
  hasOidcProviders = false;
  returnUrl = '/';

  // State
  loading = false;
  errorMessage: string | null = null;

  // Text (can be i18n'd)
  welcomeTitle = 'Welcome Back!';
  welcomeSubtitle = 'Choose how you want to sign in';
  continueWithText = 'Continue with';
  emailWelcomeTitle = 'Sign In with Email';
  emailWelcomeSubtitle = 'Enter your email and password';
  backToProvidersText = 'Other sign in options';

  // Dev defaults (only in dev mode)
  defaultEmail = '';
  defaultPassword = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private oidcService: OidcService,
    private accountService: AccountService,
    private toastService: ToastService,
    private authFakeService: AuthfakeauthenticationService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Get return URL from query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboards/main';

    // Check configuration
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
   * Handle provider selection
   */
  onProviderSelected(provider: AuthProviderDisplay): void {
    console.log('[UnifiedSignIn] Provider selected:', provider.id);

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
      console.error('[UnifiedSignIn] OIDC login failed:', error);
      this.errorMessage = error.message || 'Failed to initiate sign in. Please try again.';
      this.loading = false;
    }
  }

  /**
   * Handle email/password login
   */
  onEmailLogin(credentials: EmailLoginCredentials): void {
    console.log('[UnifiedSignIn] Email login:', credentials.email);
    
    this.loading = true;
    this.errorMessage = null;

    // Use the appropriate auth service based on environment
    const authMode = environment.defaultauth;

    if (authMode === 'firebase') {
      this.authService.login(credentials.email, credentials.password).subscribe({
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
    
    if (response?.token || response?.status === 'success') {
      // Store in session
      sessionStorage.setItem('currentUser', JSON.stringify(response.data || response));
      if (response.token) {
        sessionStorage.setItem('token', response.token);
      }
      
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
    console.error('[UnifiedSignIn] Login error:', error);
    this.errorMessage = error?.error?.message || error?.message || 'Login failed. Please try again.';
  }

  /**
   * Show provider selection view
   */
  showProviders(): void {
    this.currentView = 'providers';
    this.errorMessage = null;
  }
}
