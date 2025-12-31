/**
 * Auth Callback Component
 * 
 * Handles OAuth2/OIDC redirect callbacks from identity providers.
 * 
 * LOCATION: core.ag (Angular-specific component)
 * 
 * This component is loaded at /auth/callback (or configured path).
 * The IdP redirects here with authorization code and state.
 * 
 * Flow:
 * 1. User clicks "Sign in with Microsoft/Google"
 * 2. Redirect to IdP authorization endpoint
 * 3. User authenticates at IdP
 * 4. IdP redirects to /auth/callback?code=xxx&state=yyy
 * 5. This component handles the callback
 * 6. OidcService exchanges code for tokens
 * 7. Redirect to original destination (returnUrl)
 */
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { OidcService } from '../services/oidc.service';

@Component({
    selector: 'app-auth-callback',
    imports: [],
    template: `
    <div class="auth-callback">
      <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100">
          <div class="col-md-6 col-lg-4 text-center">
    
            <!-- Loading State -->
            @if (!error) {
              <div class="loading-state">
                <div class="spinner-border text-primary mb-4" style="width: 3rem; height: 3rem;" role="status">
                  <span class="visually-hidden">Completing sign in...</span>
                </div>
                <h4 class="mb-2">Completing Sign In</h4>
                <p class="text-muted">Please wait while we finish authenticating you...</p>
              </div>
            }
    
            <!-- Error State -->
            @if (error) {
              <div class="error-state">
                <div class="avatar-lg mx-auto mb-4">
                  <div class="avatar-title bg-danger-subtle rounded-circle">
                    <i class="ri-error-warning-line fs-36 text-danger"></i>
                  </div>
                </div>
                <h4 class="text-danger mb-2">Authentication Failed</h4>
                <p class="text-muted mb-4">{{ error }}</p>
                <button class="btn btn-primary" (click)="goToLogin()">
                  <i class="ri-arrow-left-line me-1"></i>
                  Back to Sign In
                </button>
              </div>
            }
    
          </div>
        </div>
      </div>
    </div>
    `,
    styles: [`
    .auth-callback {
      background: var(--vz-body-bg);
    }
    .loading-state, .error-state {
      padding: 2rem;
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private oidcService: OidcService
  ) {}

  ngOnInit(): void {
    this.handleCallback();
  }

  private async handleCallback(): Promise<void> {
    try {
      // Get query parameters from URL
      const code = this.route.snapshot.queryParamMap.get('code');
      const state = this.route.snapshot.queryParamMap.get('state');
      const errorParam = this.route.snapshot.queryParamMap.get('error');
      const errorDescription = this.route.snapshot.queryParamMap.get('error_description');

      // Check for error from IdP
      if (errorParam) {
        this.error = errorDescription || errorParam || 'Authentication was cancelled or failed';
        return;
      }

      // Validate required parameters
      if (!code) {
        this.error = 'No authorization code received from identity provider';
        return;
      }

      if (!state) {
        this.error = 'No state parameter received. Please try again.';
        return;
      }

      // Let OidcService handle the callback
      await this.oidcService.handleCallback(code, state);
      
      // Navigation is handled by OidcService

    } catch (error: any) {
      console.error('[AuthCallbackComponent] Callback handling failed:', error);
      this.error = error.message || 'An unexpected error occurred during authentication';
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/signin']);
  }
}
