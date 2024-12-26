// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../../core.ui/pipes/basetranslate.pipe';

// Services:
import { SystemService } from '../../../../../../../core/services/system.service';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-core-modules-account_auth-lockscreen-basic',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Lock Screen Basic Component
 */
export class BasicComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Login Form
  lockscreenForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;

  constructor(private formBuilder: FormBuilder, systemService: SystemService, public translate: TranslateService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;
  }

  ngOnInit(): void {
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
