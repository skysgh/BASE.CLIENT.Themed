// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Etc:
//
// Services
import { ServiceUserEndorsementsRepositoryService } from '../../../../../../../../core/services/services/repositories/service-user-endorsements.service';
// Configuration:
import { appsConfiguration } from '../../../../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../../core/services/default-controller-services';
// Models:
import { User } from '../../../../../../_state/authentication/auth.models';
import { ServiceUserQuote } from '../../../../../../../../core/models/data/service-user-quote.model';
import { ViewModel } from './vm';
// Data:


@Component({
  selector: 'app-base-core-modules-account_auth-lockscreen-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Lock Screen Cover Component
 */
export class CoverComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

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
    private defaultControllerServices: DefaultComponentServices,
    private systemUserEndorsementsRepositoryService : ServiceUserEndorsementsRepositoryService
  ) {
    // Make system/env variables avaiable to view template (via singleton or service):
    var x = appsConfiguration.constants.resources.open.images.logos;

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
