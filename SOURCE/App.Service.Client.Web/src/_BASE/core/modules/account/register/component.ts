import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Register Auth

import { AuthenticationService } from '../../../../shared/services/services/auth.service';
import { UserProfileService } from '../../../../shared/services/services/user.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { SystemService } from '../../../../shared/services/system.service';
import { System } from '../../../../shared/models/settings/system';

@Component({
  selector: 'app-base-core-modules-account_auth-register',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Register Component
 */
export class RegisterComponent implements OnInit {

  // Login Form
  signupForm!: FormGroup;
  submitted = false;
  successmsg = false;
  error = '';
  // set the current year
  year: number = new Date().getFullYear();

  system: System;

  constructor(private formBuilder: FormBuilder, private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserProfileService,
  private systemService : SystemService) {

    this.system = this.systemService.system;
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
        this.router.navigate(['/auth/login']);
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
    //             this.router.navigate(['/auth/login']);
    //           }
    //         },
    //         (error: any) => {
    //           this.error = error ? error : '';
    //         });
    //   }
    // }
  }

}
