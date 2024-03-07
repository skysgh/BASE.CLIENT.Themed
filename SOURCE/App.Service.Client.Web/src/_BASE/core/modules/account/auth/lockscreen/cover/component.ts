import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { System } from '../../../../../../shared/models/system.model';
import { SystemService } from '../../../../../../shared/services/system.service';
import { SystemUserQuoteRepositoryService } from '../../../../../../shared/services/repositories/system.user-quotes.service';
import { User } from '../../../../../../../app/store/Authentication/auth.models';
import { UserQuote } from '../../../../../../shared/models/user-quote.model';

@Component({
  selector: 'app-base-core-modules-account_auth-lockscreen-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Lock Screen Cover Component
 */
export class CoverComponent implements OnInit {

  // Login Form
  lockscreenForm!: FormGroup;
  fieldTextType!: boolean;
  submitted = false;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  system: System;
  // Carousel navigation arrow show
  showNavigationArrows: any;

  private systemUserQuotes: any;

  constructor(
    private formBuilder: FormBuilder,
    systemService: SystemService,
    public translate: TranslateService,
    private systemUserQuoteRepositoryService : SystemUserQuoteRepositoryService
  ) {
    this.system = systemService.system;
}

  ngOnInit(): void {
    //
    this.systemUserQuotes =
      this.systemUserQuoteRepositoryService.getAllByLanguageCode('en');

    /**
     * Form Validatyion
     */
     this.lockscreenForm = this.formBuilder.group({
      password: ['', [Validators.required]]
     });

  }

  // convenience getter for easy access to form fields
  get f() { return this.lockscreenForm.controls; }

  /**
   * Form submit
   */
   onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.lockscreenForm.invalid) {
      return;
    }
  }

}
