// Rx:
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
 * ✅ MULTI-ACCOUNT: Uses AccountService for reactive branding
 */
export class LoginComponent implements OnInit {
  public tierConfig = themesT1Configuration;

  // ✅ Account-aware branding (reactive)
  public logo$: Observable<string | undefined>;
  public appTitle$: Observable<string | undefined>;
  public appDescription$: Observable<string | undefined>;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

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
    private envConfig: EnvConfigService,
    private accountService: AccountService
  ) {
    // ✅ Get branding from account config (reactive)
    this.logo$ = this.accountService.getConfigValue('branding.logo');
    this.appTitle$ = this.accountService.getConfigValue('name');
    this.appDescription$ = this.accountService.getConfigValue('description');

    // ✅ If already logged in, redirect to configured destination
    if (this.authenticationService.currentUserValue) {
      const redirectTo = this.getPostLoginRedirect();
      this.router.navigate([redirectTo]);
    }
  }

  ngOnInit(): void {
    const storageKey = 'currentUser';
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
    
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.getPostLoginRedirect();
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
        sessionStorage.setItem('toast', 'true');
        sessionStorage.setItem('currentUser', JSON.stringify(data.data));
        sessionStorage.setItem('token', data.token);
        
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
