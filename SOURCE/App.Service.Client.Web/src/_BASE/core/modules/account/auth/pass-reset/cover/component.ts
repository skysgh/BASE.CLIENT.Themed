// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../common/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../../services/system.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-modules-account_auth-pass-reset-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Cover Component
 */
export class CoverComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

 // Login Form
 passresetForm!: FormGroup;
 submitted = false;
 fieldTextType!: boolean;
 error = '';
 returnUrl!: string;
 // Carousel navigation arrow show
 showNavigationArrows: any;

  constructor(private formBuilder: FormBuilder, systemService: SystemService, public translate: TranslateService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;
  }

 ngOnInit(): void {
   /**
    * Form Validatyion
    */
    this.passresetForm = this.formBuilder.group({
     email: ['', [Validators.required]]
   });
 }

 // convenience getter for easy access to form fields
 get f() { return this.passresetForm.controls; }

 /**
  * Form submit
  */
  onSubmit() {
   this.submitted = true;

   // stop here if form is invalid
   if (this.passresetForm.invalid) {
     return;
   }
 }
}
