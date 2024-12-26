// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Etc:
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

// Const:
import { system as importedSystemConst } from '../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../core.ui/pipes/basetranslate.pipe';

// Login Auth
//import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../../../core/services/authfake.service';
import { TitleService } from '../../../../../core/services/title.service';
import { SystemService } from '../../../../../core/services/system.service';
import { ToastService } from '../../../../../core/services/toast.service';
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
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

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
  constructor(private titleService: TitleService, private systemService: SystemService, public translate: TranslateService, private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router,
    private authFackservice: AuthfakeauthenticationService, private route: ActivatedRoute, public toastService: ToastService) {
    // Make system/env variables avaiable to class & view template:
    //this.system = this.systemService.system;

     this.sponsorTitle = systemService.system.dynamic.sponsor.title;
    //
    this.productTitle = systemService.system.title;
    this.productDescription = systemService.system.description;


    // Set the desired title for your page
    //this.titleService.set(`${this.sponsorTitle}  ${this.productTitle}`);

    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate([this.system.navigation.home]);
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem(this.system.storage.system.currentUser)) {
      this.router.navigate([this.system.navigation.home]);
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
        sessionStorage.setItem(this.system.storage.system.toast, 'true');
        sessionStorage.setItem(this.system.storage.system.currentUser, JSON.stringify(data.data));
        sessionStorage.setItem(this.system.storage.system.token, data.token);
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
