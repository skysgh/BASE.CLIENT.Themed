// Ag:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Etc:
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

// Constants:
import { system as importedSystemConst } from '../../../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../../core.ui/pipes/basetranslate.pipe';

// Services:
// Login Auth
//import { environment } from '../../../../../../environments/environment';
import { AuthenticationService } from '../../../../../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../../../../../core/services/authfake.service';
import { TitleService } from '../../../../../../../core/services/title.service';
import { SystemService } from '../../../../../../../core/services/system.service';
import { ToastService } from '../../../../../../../core/services/toast.service';
import { ViewModel } from './vm';

//import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-modules-account_auth-signin-cover',
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
  loginForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(
    private titleService: TitleService,
    private systemService: SystemService,
    public translate: TranslateService,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private route: ActivatedRoute,
    public toastService: ToastService,
    private formBuilder: FormBuilder,
    private router: Router
    ) {
    // Make system/env variables avaiable to class & view template:
    // this.system = this.systemService.system;
  }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      email: ['admin@themesbrand.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
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
