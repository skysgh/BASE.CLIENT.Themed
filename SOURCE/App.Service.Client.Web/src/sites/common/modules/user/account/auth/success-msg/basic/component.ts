// Ag:
import { Component, OnInit } from '@angular/core';
// Misc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../../../core/constants/system';
// Services:
import { SystemService } from '../../../../../../../../core/services/system.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-modules-account_auth-success-msg-basic',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Success Msg Basic Component
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

}
