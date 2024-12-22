// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../common/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../../services/system.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-modules-account_auth-twostep-basic',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Two Step Basic Component
 */
export class BasicComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(private systemService: SystemService, public translate: TranslateService) {
    // Make system/env variables avaiable to class & view template:
    //this.system = this.systemService.system;
  }

  ngOnInit(): void {
  }

   /**
   * Confirm Otp Verification
   */
    config = {
      allowNumbersOnly: true,
      length: 4,
      isPasswordInput: false,
      disableAutoFocus: false,
      placeholder: '',
      inputStyles: {
        'width': '80px',
        'height': '50px'
      }
    };

}
