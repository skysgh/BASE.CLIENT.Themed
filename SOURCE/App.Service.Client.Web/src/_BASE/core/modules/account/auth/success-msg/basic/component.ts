// Ag:
import { Component, OnInit } from '@angular/core';
// Misc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../services/system.service';

@Component({
  selector: 'app-base-core-modules-account_auth-success-msg-basic',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Success Msg Basic Component
 */
export class BasicComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();
  system = importedSystemConst;

  constructor(private systemService: SystemService, public translate: TranslateService) {
    this.system = this.systemService.system;

}

  ngOnInit(): void {
  }

}
