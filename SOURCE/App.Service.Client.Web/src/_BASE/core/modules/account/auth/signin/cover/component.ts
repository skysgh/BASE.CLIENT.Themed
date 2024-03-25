import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { System } from '../../../../../constants/contracts/system';
import { SystemService } from '../../../../../services/system.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base-core-modules-account_auth-signin-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Cover Component
 */
export class CoverComponent implements OnInit {

  // Login Form
  loginForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  system: System;
  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(private formBuilder: FormBuilder, private systemService: SystemService, public translate: TranslateService) {
    this.system = this.systemService.system;
  }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
     this.loginForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
   onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
  }

  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
