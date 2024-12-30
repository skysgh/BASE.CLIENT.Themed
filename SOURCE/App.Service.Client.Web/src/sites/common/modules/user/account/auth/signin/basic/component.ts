// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Etc:
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../../../core/constants/system';
// Services:
import { SystemService } from '../../../../../../../../core/services/system.service';
import { ViewModel } from './vm';


// Ag:
// Etc:

// Constants:

// Services:
// Login Auth
//import { environment } from '../../../../../../environments/environment';
import { AuthenticationService } from '../../../../../../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../../../../../../core/services/authfake.service';
import { TitleService } from '../../../../../../../../core/services/title.service';
import { ToastService } from '../../../../../../../../core/services/toast.service';
import { SystemDiagnosticsTraceService } from '../../../../../../../../core/services/system.diagnostics-trace.service';




@Component({
  selector: 'app-base-core-modules-account_auth-signin-basic',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Basic Component
 */
export class BasicComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

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
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private titleService: TitleService,
    private systemService: SystemService,
    public translate: TranslateService,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private route: ActivatedRoute,
    public toastService: ToastService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

    this.diagnosticsTraceService.verbose("BasicComponent.constructor()"); 

    // Make system/env variables avaiable to class & view template:
    // this.system = systemService.system

    // Set the desired title for your page
    //this.titleService.set(`${this.sponsorTitle}  ${this.productTitle}`);

    // redirect to home if already logged in
    this.diagnosticsTraceService.verbose(`Already signed in?`); 
    if (this.authenticationService.currentUserValue) {
      this.diagnosticsTraceService.verbose(`Yes. Redirecting to ${this.system.navigation.home}`); 
      this.router.navigate([this.system.navigation.home]);
    }
    this.diagnosticsTraceService.verbose(`No.`); 
  }

  ngOnInit(): void {


    // get return url from route parameters or default to root 
    this.returnUrl = (this.route.snapshot.queryParams['returnUrl'] || this.system.navigation.apps.root);

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
     this.diagnosticsTraceService.verbose("BasicComponent.onSubmit()");

     // Raise flag that if submitted AND error messages, the button will be grayed out:
     this.submitted = true;

     // Which we check, based on validators:
     if (this.loginForm.invalid) {
       return;
     }

     // Invoke the authentication service, checking the login:
     this.diagnosticsTraceService.verbose("AuthenticationService.login(): Invoked...")
     this.authenticationService.login(this.f['name'].value, this.f['password'].value).subscribe((data: any) => {
       this.diagnosticsTraceService.verbose("AuthenticationService.login(). Returned...")
       if (data.status != 'success') {
         this.diagnosticsTraceService.warn("Submitted User Credentials not accepted.")
         // Show Toaster, with response error.
         this.toastService.show(data.data, { classname: 'bg-danger text-white', delay: 15000 });
         // Exit early:
         return;
       }
       this.diagnosticsTraceService.info("Submitted User Credentials Accepted.")

       this.diagnosticsTraceService.verbose("Cleanup...")

       sessionStorage.setItem(this.system.storage.system.toast, 'true');

       // Store user information as a json string:
       this.diagnosticsTraceService.info("Store the User Information:")
       var tmp = JSON.stringify(data.data);
       this.diagnosticsTraceService.info(tmp);
       sessionStorage.setItem(this.system.storage.system.currentUser, tmp);

       // Store user token string:
       this.diagnosticsTraceService.info("Store the User Token:")
       this.diagnosticsTraceService.info(data.token);
       sessionStorage.setItem(this.system.storage.system.token, data.token);

       this.diagnosticsTraceService.verbose("Redirect to the Return URL...")
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
