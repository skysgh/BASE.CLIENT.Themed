// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// Etc:
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Services:
import { AuthenticationService } from '../../../services/auth.service';
import { SystemService } from '../../../services/system.service';
import { UserProfileService } from '../../../services/system/repositories/system-user.repository.service';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-core-modules-account_auth-register',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Register Component
 */
export class RegisterComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Login Form
  signupForm!: FormGroup;
  submitted = false;
  successmsg = false;
  error = '';


  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder, private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserProfileService,
  private systemService : SystemService) {

    // Make system/env variables avaiable to class & view template:
    //this.system = this.systemService.system;
  }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
     this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * Register submit form
   */
   onSubmit() {
    this.submitted = true;

     //Register Api
     this.authenticationService.register(
       this.f['email'].value,
       this.f['name'].value,
       this.f['password'].value).pipe(first()).subscribe(
      (data: any) => {
      this.successmsg = true;
      if (this.successmsg) {
        this.router.navigate([this.system.navigation.auth.login]);
      }
    },
    (error: any) => {
      this.error = error ? error : '';
    });

    // stop here if form is invalid
    // if (this.signupForm.invalid) {
    //   return;
    // } else {
    //   if (environment.defaultauth === 'firebase') {
    //     this.authenticationService.register(this.f['email'].value, this.f['password'].value).then((res: any) => {
    //       this.successmsg = true;
    //       if (this.successmsg) {
    //         this.router.navigate(['']);
    //       }
    //     })
    //       .catch((error: string) => {
    //         this.error = error ? error : '';
    //       });
    //   } else {
    //     this.userService.register(this.signupForm.value)
    //       .pipe(first())
    //       .subscribe(
    //         (data: any) => {
    //           this.successmsg = true;
    //           if (this.successmsg) {
    //             this.router.navigate([this.system.navigation.auth.login]);
    //           }
    //         },
    //         (error: any) => {
    //           this.error = error ? error : '';
    //         });
    //   }
    // }
  }

}
