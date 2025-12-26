// Rx:
import { first } from 'rxjs/operators';
// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Etc:
//
// Configuration:
// ✅ FIXED: Use theme-tier configuration (not app-tier)
// This component is in themes/t1, so it should only know about themesT1Configuration.
// Reduces coupling - theme components don't need to know about app-level config.
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';

// Services
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { AuthenticationService } from '../../../../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../../../../core/services/authfake.service';
import { TitleService } from '../../../../../../core/services/title.service';
import { ToastService } from '../../../../../../core/services/toast.service';
import { EnvConfigService } from '../../../../../../core/services/env-config.service';
// Models:
import { ViewModel } from './vm';

// Constants:
//

@Component({
  selector: 'app-base-core-modules-account_auth-login',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Login Component (Theme T1)
 * 
 * ✅ REFACTORED: Complete Tier Independence
 * - Uses themesT1Configuration for ALL needs (behavior + branding)
 * - No more upward coupling to appsConfiguration
 * - Branding copied into theme config at module init
 * 
 * Configuration Usage:
 * - tierConfig.postLoginRedirect: Where to go after login
 * - tierConfig.branding: Logo, title, description (copied from app)
 * - envConfig: Runtime overrides
 * 
 * Pattern: Single config object per tier (tierConfig)
 * Template Simplicity: Always use tierConfig.* in HTML
 */
export class LoginComponent implements OnInit {
  // ✅ SINGLE config object for template (tier independence!)
  public tierConfig = themesT1Configuration;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // system settings
  sponsorTitle?: string;
  productTitle?: string;
  productDescription?: string;

  // Login Form
  loginForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  
  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private titleService: TitleService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private authFackservice: AuthfakeauthenticationService,
    private route: ActivatedRoute,
    public toastService: ToastService,
    private envConfig: EnvConfigService  // ✅ NEW: For runtime config overrides
  ) {
    // TODO: These should come from theme config or env config, not hard-coded app config
    // For now, keeping them as-is to avoid breaking things
    // this.sponsorTitle = appsConfiguration.context.sponsor.title;
    // this.productTitle = appsConfiguration.description.title;
    // this.productDescription = appsConfiguration.description.description;

    // ✅ FIXED: Use theme config for redirect (not hard-coded)
    // If already logged in, redirect to configured destination
    if (this.authenticationService.currentUserValue) {
      const redirectTo = this.getPostLoginRedirect();
      this.router.navigate([redirectTo]);
    }
  }

  ngOnInit(): void {
    // ✅ FIXED: Use theme config constants (not app config)
    // Note: Storage keys still come from app config for now (legacy)
    // TODO: Move storage keys to theme config or core config
    const storageKey = 'currentUser'; // Simplified for now
    if (sessionStorage.getItem(storageKey)) {
      const redirectTo = this.getPostLoginRedirect();
      this.router.navigate([redirectTo]);
    }
    
    /**
     * Form Validation
     */
    this.loginForm = this.formBuilder.group({
      email: ['admin@themesbrand.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    });
    
    // ✅ FIXED: Get redirect destination from config (not hard-coded)
    // Priority: returnUrl query param > runtime config > theme default
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.getPostLoginRedirect();
  }

  /**
   * ✅ Get post-login redirect destination
   * 
   * Why: Don't hard-code where users go after login.
   * Different deployments need different destinations.
   * 
   * Priority:
   * 1. Runtime config (from config.json via EnvConfigService)
   * 2. Theme default (from themesT1Configuration)
   * 
   * Example config.json override:
   * {
   *   "postLoginRedirect": "/welcome-wizard/"
   * }
   */
  private getPostLoginRedirect(): string {
    try {
      // Try runtime config first (highest priority)
      const runtimeConfig = this.envConfig.get();
      if (runtimeConfig.postLoginRedirect) {
        return runtimeConfig.postLoginRedirect;
      }
    } catch (error) {
      // EnvConfig might not be initialized yet (shouldn't happen, but be safe)
      console.warn('[LoginComponent] EnvConfig not available, using theme default');
    }
    
    // ✅ FIXED: Use tierConfig (not themeConfig)
    // Fall back to theme default
    return this.tierConfig.postLoginRedirect;
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // Login Api
    this.authenticationService.login(this.f['email'].value, this.f['password'].value).subscribe((data: any) => {
      if (data.status == 'success') {
        // Store session data
        // TODO: Use theme config for storage keys
        sessionStorage.setItem('toast', 'true');
        sessionStorage.setItem('currentUser', JSON.stringify(data.data));
        sessionStorage.setItem('token', data.token);
        
        // ✅ FIXED: Redirect to configured destination (not hard-coded)
        this.router.navigate([this.returnUrl]);
      } else {
        this.toastService.show(data.data, { classname: 'bg-danger text-white', delay: 15000 });
      }
    });
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
