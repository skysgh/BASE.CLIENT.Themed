// Rx:
import { first } from 'rxjs/operators';
// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Etc:
//
// Configuration:
import { appsConfiguration } from '../../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
// Services
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { AuthenticationService } from '../../../../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../../../../core/services/authfake.service';
import { TitleService } from '../../../../../../core/services/title.service';
import { ToastService } from '../../../../../../core/services/toast.service';
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
 * Login Component
 */
export class LoginComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration


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
  constructor(private defaultControllerServices: DefaultComponentServices,
    private titleService: TitleService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private authFackservice: AuthfakeauthenticationService,
    private route: ActivatedRoute,
    public toastService: ToastService) {
    // Make system/env variables avaiable to class & view template:
    //this.system = this.systemService.system;

    this.sponsorTitle = appsConfiguration.context.sponsor.title;
    //
    this.productTitle = appsConfiguration.description.title;
    this.productDescription = appsConfiguration.description.description;


    // Set the desired title for your page
    //this.titleService.set(`${this.sponsorTitle}  ${this.productTitle}`);

    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate([appsConfiguration.navigation.home]);
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem(this.appsConfiguration.others.core.constants.storage.session.currentUser)) {
      this.router.navigate([appsConfiguration.navigation.home]);
    }
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      email: ['admin@themesbrand.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = (this.route.snapshot.queryParams['returnUrl'] || '/');
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
        sessionStorage.setItem(this.appsConfiguration.others.core.constants.storage.session.toast, 'true');
        sessionStorage.setItem(this.appsConfiguration.others.core.constants.storage.session.currentUser, JSON.stringify(data.data));
        sessionStorage.setItem(this.appsConfiguration.others.core.constants.storage.session.token, data.token);
        this.router.navigate([this.returnUrl]);
      } else {
        this.toastService.show(data.data, { classname: 'bg-danger text-white', delay: 15000 });
      }
    });


    // stop here if form is invalid
    // if (this.loginForm.invalid) {
    //   return;
    // } else {
    //   if (environment.defaultauth === 'firebase') {
    //     this.authenticationService.login(this.f['email'].value, this.f['password'].value).then((res: any) => {
    //       this.router.navigate([this.system.navigation.home]);
    //     })
    //       .catch(error => {
    //         this.error = error ? error : '';
    //       });
    //   } else {
    //     this.authFackservice.login(this.f['email'].value, this.f['password'].value).pipe(first()).subscribe(data => {
    //           this.router.navigate([this.system.navigation.home]);
    //         },
    //         error => {
    //           this.error = error ? error : '';
    //         });
    //   }
    // }
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
