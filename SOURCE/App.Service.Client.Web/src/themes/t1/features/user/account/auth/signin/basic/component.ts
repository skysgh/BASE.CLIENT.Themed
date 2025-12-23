// Rx:
import { first } from 'rxjs/operators';
// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Etc:
//
// Configuration:
import { appsConfiguration } from '../../../../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { AuthenticationService } from '../../../../../../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../../../../../../core/services/authfake.service';
import { TitleService } from '../../../../../../../../core/services/title.service';
import { ToastService } from '../../../../../../../../core/services/toast.service';
import { DefaultComponentServices } from '../../../../../../../../core/services/default-controller-services';
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
 * Basic Component
 */
export class BasicComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

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
    private router: Router
  ) {

    this.defaultControllerServices.diagnosticsTraceService.verbose("BasicComponent.constructor()"); 

    // Make system/env variables avaiable to class & view template:
    // this.system = systemService.system

    // Set the desired title for your page
    //this.titleService.set(`${this.sponsorTitle}  ${this.productTitle}`);

    // redirect to home if already logged in
    this.defaultControllerServices.diagnosticsTraceService.verbose(`Already signed in?`); 
    if (this.authenticationService.currentUserValue) {
      this.defaultControllerServices.diagnosticsTraceService.verbose(`Yes. Redirecting to ${this.appsConfiguration.navigation.home}`); 
      this.router.navigate([this.appsConfiguration.navigation.home]);
    }
    this.defaultControllerServices.diagnosticsTraceService.verbose(`No.`); 
  }

  ngOnInit(): void {


    // get return url from route parameters or default to root 
    this.returnUrl = (this.route.snapshot.queryParams['returnUrl'] || this.appsConfiguration.navigation.root);

    // Lets setup the form:
    var demo = true;
    this.loginForm = this.formBuilder.group({
      name: [demo ? 'admin@themesbrand.com' : '', [Validators.required, Validators.email]],
      password: [demo ? '123456' : '', [Validators.required]],
    });


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

       sessionStorage.setItem(this.appsConfiguration.others.core.constants.storage.session.toast, 'true');

       // Store user information as a json string:
       this.defaultControllerServices.diagnosticsTraceService.info("Store the User Information:")
       var tmp = JSON.stringify(data.data);
       this.defaultControllerServices.diagnosticsTraceService.info(tmp);
       sessionStorage.setItem(this.appsConfiguration.others.core.constants.storage.session.currentUser, tmp);

       // Store user token string:
       this.defaultControllerServices.diagnosticsTraceService.info("Store the User Token:")
       this.defaultControllerServices.diagnosticsTraceService.info(data.token);
       sessionStorage.setItem(this.appsConfiguration.others.core.constants.storage.session.token, data.token);

       this.defaultControllerServices.diagnosticsTraceService.verbose("Redirect to the Return URL...")
       this.router.navigate([this.returnUrl]);

     });

     // stop here if form is invalid
  }

  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
