import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Login Auth
import { environment } from '../../../../../environments/environment';
import { AuthenticationService } from '../../../../../_BASE/shared/services/services/auth.service';
import { AuthfakeauthenticationService } from '../../../../../_BASE/shared/services/services/authfake.service';
import { first } from 'rxjs/operators';
import { ToastService } from './toast-service';
import { TitleService } from '../../../../common/services/title.service';
import { SystemService } from '../../../../common/services/system.service';
import { TranslateService } from '@ngx-translate/core';
import { System } from '../../../../common/models/system.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

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
  // set the current year
  year: number = new Date().getFullYear();
  system: System; 
  constructor(private titleService: TitleService, private systemService: SystemService, public translate: TranslateService, private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router,
    private authFackservice: AuthfakeauthenticationService, private route: ActivatedRoute, public toastService: ToastService) {

    translate.setDefaultLang('en');

    this.system = this.systemService.system;

     this.sponsorTitle = systemService.system.sponsor.title;
    //
    this.productTitle = systemService.system.title;
    this.productDescription = systemService.system?.description;


    // Set the desired title for your page
    //this.titleService.set(`${this.sponsorTitle}  ${this.productTitle}`);

    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      email: ['admin@themesbrand.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
        this.router.navigate(['/']);
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
    //       this.router.navigate(['/']);
    //     })
    //       .catch(error => {
    //         this.error = error ? error : '';
    //       });
    //   } else {
    //     this.authFackservice.login(this.f['email'].value, this.f['password'].value).pipe(first()).subscribe(data => {
    //           this.router.navigate(['/']);
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
