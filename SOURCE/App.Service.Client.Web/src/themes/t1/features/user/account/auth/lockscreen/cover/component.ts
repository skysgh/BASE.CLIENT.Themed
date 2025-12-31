// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Configuration:
import { appsConfiguration } from '../../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../../core/services/default-controller-services';
// Describe applet (now in sites.app.parts):
import { ServiceDescribeEndorsementService } from '../../../../../../../../sites.app.parts/describe/services/service-describe-endorsement.service';
// Models:
import { User } from '../../../../../../_state/authentication/auth.models';
import { ViewModel } from './vm';

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

  // Login Form
  lockscreenForm!: FormGroup;
  fieldTextType!: boolean;
  submitted = false;
  error = '';
  returnUrl!: string;
  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(
    private formBuilder: FormBuilder,
    private defaultControllerServices: DefaultComponentServices,
    // ✅ UPDATED: Use brochure endorsement service
    public endorsementService: ServiceDescribeEndorsementService
  ) {
    // Make system/env variables avaiable to view template
    var x = appsConfiguration.constants.resources.open.images.logos;
  }

  // ✅ Get endorsements from signal-based service
  get endorsements() {
    return this.endorsementService.endorsements();
  }

  ngOnInit(): void {
    // Endorsements load automatically in service constructor

    /**
     * Form Validation
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
