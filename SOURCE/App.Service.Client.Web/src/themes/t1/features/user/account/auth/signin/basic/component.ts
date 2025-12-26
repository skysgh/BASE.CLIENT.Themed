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
import { themesT1Configuration } from '../../../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { AuthenticationService } from '../../../../../../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../../../../../../core/services/authfake.service';
import { TitleService } from '../../../../../../../../core/services/title.service';
import { ToastService } from '../../../../../../../../core/services/toast.service';
import { DefaultComponentServices } from '../../../../../../../../core/services/default-controller-services';
import { EnvConfigService } from '../../../../../../../../core/services/env-config.service';
// Models:
import { ViewModel } from './vm';
// Ag:
// Etc:

// Constants:

// Services:
// Login Auth
//import { environment } from '../../../../../../environments/environment';



@Component({
  selector: 'app-base-core-modules-account_auth-signin-basic',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Basic Signin Component (Theme T1)
 * 
 * ✅ REFACTORED: Complete Tier Independence
 * - Uses themesT1Configuration for ALL needs
 * - No upward coupling to appsConfiguration
 */
export class BasicComponent implements OnInit {
  // ✅ SINGLE config object (tier independence!)
  public tierConfig = themesT1Configuration;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Login Form
  loginForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  
  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private titleService: TitleService,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private route: ActivatedRoute,
    public toastService: ToastService,
    private formBuilder: FormBuilder,
    private router: Router,
    private envConfig: EnvConfigService  // ✅ NEW: For runtime config overrides
  ) {

    this.defaultControllerServices.diagnosticsTraceService.verbose("BasicComponent.constructor()"); 

    // ✅ FIXED: Use theme config for redirect (not hard-coded)
    // If already logged in, redirect to configured destination
    this.defaultControllerServices.diagnosticsTraceService.verbose(`Already signed in?`); 
    if (this.authenticationService.currentUserValue) {
      const redirectTo = this.getPostLoginRedirect();
      this.defaultControllerServices.diagnosticsTraceService.verbose(`Yes. Redirecting to ${redirectTo}`); 
      this.router.navigate([redirectTo]);
    }
    this.defaultControllerServices.diagnosticsTraceService.verbose(`No.`); 
  }

  ngOnInit(): void {
    // ✅ FIXED: Get redirect destination from config (not hard-coded)
    // Priority: returnUrl query param > runtime config > theme default
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.getPostLoginRedirect();

    // Lets setup the form:
    var demo = true;
    this.loginForm = this.formBuilder.group({
      name: [demo ? 'admin@themesbrand.com' : '', [Validators.required, Validators.email]],
      password: [demo ? '123456' : '', [Validators.required]],
    });
  }

  /**
   * ✅ NEW: Get post-login redirect destination
   * 
   * Priority:
   * 1. Runtime config (from config.json via EnvConfigService)
   * 2. Theme default (from themesT1Configuration)
   */
  private getPostLoginRedirect(): string {
    try {
      const runtimeConfig = this.envConfig.get();
      if (runtimeConfig.postLoginRedirect) {
        return runtimeConfig.postLoginRedirect;
      }
    } catch (error) {
      console.warn('[BasicComponent] EnvConfig not available, using theme default');
    }
    
    return this.tierConfig.postLoginRedirect;
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
   onSubmit() {
     this.defaultControllerServices.diagnosticsTraceService.verbose("BasicComponent.onSubmit()");

     // Raise flag that if submitted AND error messages, the button will be grayed out:
     this.submitted = true;

     // Which we check, based on validators:
     if (this.loginForm.invalid) {
       return;
     }

     // Invoke the authentication service, checking the login:
     this.defaultControllerServices.diagnosticsTraceService.verbose("AuthenticationService.login(): Invoked...")
     this.authenticationService.login(this.f['name'].value, this.f['password'].value).subscribe((data: any) => {
       this.defaultControllerServices.diagnosticsTraceService.verbose("AuthenticationService.login(). Returned...")
       if (data.status != 'success') {
         this.defaultControllerServices.diagnosticsTraceService.warn("Submitted User Credentials not accepted.")
         // Show Toaster, with response error.
         this.toastService.show(data.data, { classname: 'bg-danger text-white', delay: 15000 });
         // Exit early:
         return;
       }
       this.defaultControllerServices.diagnosticsTraceService.info("Submitted User Credentials Accepted.")

       this.defaultControllerServices.diagnosticsTraceService.verbose("Cleanup...")

       // Store session data
       // TODO: Use theme config for storage keys
       sessionStorage.setItem('toast', 'true');

       // Store user information as a json string:
       this.defaultControllerServices.diagnosticsTraceService.info("Store the User Information:")
       var tmp = JSON.stringify(data.data);
       this.defaultControllerServices.diagnosticsTraceService.info(tmp);
       sessionStorage.setItem('currentUser', tmp);

       // Store user token string:
       this.defaultControllerServices.diagnosticsTraceService.info("Store the User Token:")
       this.defaultControllerServices.diagnosticsTraceService.info(data.token);
       sessionStorage.setItem('token', data.token);

       // ✅ FIXED: Redirect to configured destination (not hard-coded)
       this.defaultControllerServices.diagnosticsTraceService.verbose("Redirect to the Return URL...")
       this.router.navigate([this.returnUrl]);

     });
  }

  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
