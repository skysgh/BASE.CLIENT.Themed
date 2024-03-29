// Ag:
import { Component, OnInit } from '@angular/core';
// Misc:
// 
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../services/system.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base-core-modules-account_auth-twostep-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * TwoStep Cover Component
 */
export class CoverComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();
  system = importedSystemConst;

  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(systemService: SystemService, public translate: TranslateService) {
    this.system = systemService.system;
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
