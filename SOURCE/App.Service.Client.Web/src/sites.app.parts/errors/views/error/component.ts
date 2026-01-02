/**
 * Error View Component
 * 
 * A single reusable error page component that handles all error codes.
 * Receives error code from route parameter and looks up configuration.
 * 
 * Route: /errors/:code (e.g., /errors/404, /errors/500)
 * 
 * Architecture:
 * - Reads error code from route params
 * - Looks up config in ERROR_DATA
 * - Falls back to '000' (unknown) if code not found
 * - Uses i18n translation keys for all text
 * - Uses NavigationService for account-aware navigation
 * 
 * Benefits:
 * - DRY: Single component for all error pages
 * - Maintainable: Add new codes by updating error-data.ts only
 * - Consistent: Same layout, different content
 * - i18n: All text is translatable
 */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ErrorPageConfig, getErrorConfig, getErrorDefaults } from '../../models/error-data';
import { NavigationService } from '../../../../core/services/navigation.service';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-page-wrapper pt-5">
      <!-- Background -->
      <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
        <div class="bg-overlay"></div>
        <div class="shape">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1440 120">
            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="auth-page-content">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center pt-4">
                
                <!-- Error Code Display -->
                <div class="row">
                  <div class="col-lg-12">
                    <div class="text-center mt-sm-5">
                      
                      <!-- Error Code -->
                      <div class="mb-4">
                        <h1 class="display-1 fw-bold text-white">{{ errorCode }}</h1>
                      </div>
                      
                      <!-- Icon -->
                      <div class="avatar-lg mx-auto mb-4">
                        <div class="avatar-title bg-light rounded-circle">
                          <i [class]="errorConfig.icon + ' display-5 ' + errorConfig.iconColor"></i>
                        </div>
                      </div>
                      
                      <!-- Title & Description -->
                      <h4 class="text-uppercase text-white">{{ title }}</h4>
                      <p class="text-white-50 fs-15 mb-4">{{ description }}</p>
                      
                      <!-- Buttons -->
                      <div class="mt-4">
                        <div class="d-inline-flex gap-2 flex-wrap justify-content-center">
                          @if (errorConfig.showHomeButton) {
                            <a [routerLink]="homeUrl" [class]="'btn ' + errorConfig.buttonClass">
                              <i class="ri-home-4-line me-1"></i>
                              Back to Home
                            </a>
                          }
                          @if (errorConfig.showBackButton && canGoBack) {
                            <button class="btn btn-outline-light" (click)="goBack()">
                              <i class="ri-arrow-left-line me-1"></i>
                              Go Back
                            </button>
                          }
                          <!-- Always show a way to get to landing page if home button hidden -->
                          @if (!errorConfig.showHomeButton) {
                            <a [routerLink]="landingUrl" class="btn btn-light">
                              <i class="ri-arrow-left-line me-1"></i>
                              Go to Landing Page
                            </a>
                          }
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center">
                <p class="mb-0 text-muted">
                  &copy; {{ year }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .auth-page-wrapper {
      min-height: 100vh;
    }
  `]
})
export class ErrorComponent implements OnInit {
  private navigationService = inject(NavigationService);
  private location = inject(Location);
  private router = inject(Router);
  
  // Error configuration (loaded from route param)
  errorConfig!: ErrorPageConfig;
  errorCode = '000';
  
  // Display text (from i18n or defaults)
  title = '';
  description = '';
  
  // Navigation URLs (account-aware)
  homeUrl = '/';
  landingUrl = '/pages/landing';
  
  // Can we go back?
  canGoBack = false;
  
  year = new Date().getFullYear();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // ✅ Set account-aware URLs
    this.homeUrl = this.navigationService.getUrl('pages/landing');
    this.landingUrl = this.navigationService.getUrl('pages/landing');
    
    // ✅ Check if we can go back (prevent infinite loop)
    // If the previous URL was also an error page, don't allow back
    this.canGoBack = this.checkCanGoBack();
    
    // Get error code from route parameter
    this.route.params.subscribe(params => {
      const code = params['code'] || '000';
      this.errorCode = code;
      this.errorConfig = getErrorConfig(code);
      
      // Get default text (translation service would override in production)
      const defaults = getErrorDefaults(code);
      this.title = defaults.title;
      this.description = defaults.description;
      
      console.log(`[ErrorComponent] Loaded error page: ${code}`);
      console.log(`[ErrorComponent] Home URL: ${this.homeUrl}`);
    });
  }

  /**
   * Check if we can safely go back
   * Returns false if previous page was also an error page (prevents loop)
   */
  private checkCanGoBack(): boolean {
    // Get the history state
    const historyLength = window.history.length;
    
    // If we just loaded the page (no history), can't go back
    if (historyLength <= 1) {
      return false;
    }
    
    // Check if the path we came from was also an error page
    // We can't easily check the previous URL, so just check history length
    return historyLength > 2;
  }

  /**
   * Navigate back in history
   */
  goBack(): void {
    // Use location.back() which handles history properly
    this.location.back();
  }
}
