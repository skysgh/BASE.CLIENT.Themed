// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Services
import { ServiceUserEndorsementsRepositoryService } from '../../../../../services/services/repositories/service-user-endorsements.service';
import { SystemService } from '../../../../../services/system.service';
// Models/Data:
import { User } from '../../../../../store/Authentication/auth.models';
import { ServiceUserQuote } from '../../../../../models/data/service-user-quote.model';

@Component({
  selector: 'app-base-core-modules-account_auth-lockscreen-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Lock Screen Cover Component
 */
export class CoverComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // Login Form
  lockscreenForm!: FormGroup;
  fieldTextType!: boolean;
  submitted = false;
  error = '';
  returnUrl!: string;
  // Carousel navigation arrow show
  showNavigationArrows: any;

  private systemUserQuotes: any;

  constructor(
    private formBuilder: FormBuilder,
    systemService: SystemService,
    public translate: TranslateService,
    private systemUserEndorsementsRepositoryService : ServiceUserEndorsementsRepositoryService
  ) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;
}

  ngOnInit(): void {
    //
    this.systemUserQuotes =
      this.systemUserEndorsementsRepositoryService.getPage();

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
