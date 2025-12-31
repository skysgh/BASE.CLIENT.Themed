/**
 * Unified Sign Up Component
 * 
 * Provider-first registration experience:
 * 1. User sees provider options (Microsoft, Google, Email)
 * 2. Clicking OIDC provider → redirect to IdP for signup
 * 3. Clicking Email → show email/password registration form
 * 
 * LOCATION: core.ag (Angular-specific component)
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

// Components
import { AuthProviderListComponent, AuthProviderDisplay } from './auth-provider-list.component';
import { EmailSignupFormComponent, EmailSignupRequest } from './email-signup-form.component';

// Services
import { OidcService } from '../services/oidc.service';
import { FakeAuthRepository } from '../services/fake-auth-repository.service';
import { ToastService } from '../../../core/services/toast.service';

type SignUpView = 'providers' | 'email';

@Component({
  selector: 'app-unified-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    AuthProviderListComponent,
    EmailSignupFormComponent
  ],
  template: `
    <div class="unified-sign-up">
      
      <!-- Provider Selection View -->
      @if (currentView === 'providers') {
        <div class="provider-view">
          <div class="text-center mb-4">
            <h5 class="text-primary">{{ welcomeTitle }}</h5>
            <p class="text-muted">{{ welcomeSubtitle }}</p>
          </div>

          <app-auth-provider-list
            (providerSelected)="onProviderSelected($event)">
          </app-auth-provider-list>
        </div>
      }

      <!-- Email Signup View -->
      @if (currentView === 'email') {
        <div class="email-view">
          <div class="text-center mb-4">
            <h5 class="text-primary">{{ emailWelcomeTitle }}</h5>
            <p class="text-muted">{{ emailWelcomeSubtitle }}</p>
          </div>

          <app-email-signup-form
            #signupForm
            [showBackButton]="hasOidcProviders"
            [backText]="backToProvidersText"
            [loading]="loading"
            [errorMessage]="errorMessage"
            [signInRoute]="signInRoute"
            (signupSubmit)="onEmailSignup($event)"
            (backClicked)="showProviders()">
          </app-email-signup-form>
        </div>
      }

    </div>
  `,
  styles: [`
    .unified-sign-up {
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
export class UnifiedSignUpComponent implements OnInit {
  
  @ViewChild('signupForm') signupFormComponent!: EmailSignupFormComponent;

  // Current view
  currentView: SignUpView = 'providers';

  // Configuration
  hasOidcProviders = false;
  returnUrl = '/';
  signInRoute = '/auth/signin';

  // State
  loading = false;
  errorMessage: string | null = null;

  // Text (can be i18n'd)
  welcomeTitle = 'Create Your Account';
  welcomeSubtitle = 'Choose how you want to sign up';
  emailWelcomeTitle = 'Sign Up with Email';
  emailWelcomeSubtitle = 'Create your account with email and password';
  backToProvidersText = 'Other sign up options';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private oidcService: OidcService,
    private fakeAuthRepo: FakeAuthRepository,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Get return URL from query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboards/main';

    // Check if already logged in
    this.checkExistingSession();

    // Check for OIDC providers
    this.hasOidcProviders = true; // Will be updated when config loads
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
    console.log('[UnifiedSignUp] Provider selected:', provider.id);

    if (provider.type === 'local') {
      // Show email form
      this.currentView = 'email';
    } else {
      // Initiate OIDC signup (same as login - IdP handles account creation)
      this.initiateOidcSignup(provider.id);
    }
  }

  /**
   * Initiate OIDC signup flow
   */
  private async initiateOidcSignup(providerId: string): Promise<void> {
    try {
      this.loading = true;
      this.errorMessage = null;
      
      await this.oidcService.login(providerId as any, this.returnUrl);
      
      // Note: The page will redirect to IdP, so we won't reach here
    } catch (error: any) {
      console.error('[UnifiedSignUp] OIDC signup failed:', error);
      this.errorMessage = error.message || 'Failed to initiate sign up. Please try again.';
      this.loading = false;
    }
  }

  /**
   * Handle email signup
   */
  async onEmailSignup(request: EmailSignupRequest): Promise<void> {
    console.log('[UnifiedSignUp] Email signup:', request.email);
    
    this.loading = true;
    this.errorMessage = null;

    try {
      const result = await this.fakeAuthRepo.register({
        email: request.email,
        password: request.password,
        firstName: request.firstName,
        lastName: request.lastName
      });

      if (result.success) {
        // Store in session
        sessionStorage.setItem('currentUser', JSON.stringify(result.user));
        if (result.token) {
          sessionStorage.setItem('token', result.token);
        }

        // Show success toast
        this.toastService.show('Account created successfully!', { 
          classname: 'bg-success text-white' 
        });

        // Navigate to return URL
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.errorMessage = result.error || 'Registration failed. Please try again.';
      }
    } catch (error: any) {
      console.error('[UnifiedSignUp] Registration error:', error);
      this.errorMessage = error.message || 'Registration failed. Please try again.';
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
