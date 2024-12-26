// Ag:
import { Component, OnInit } from '@angular/core';
// Misc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../../core.ui/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../../../../core/services/system.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-modules-account_auth-success-msg-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Success Msg Cover Component
 */
export class CoverComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Carousel navigation arrow show
  showNavigationArrows: any;

 
  constructor(private systemService: SystemService, public translate: TranslateService) {
    // Make system/env variables avaiable to class & view template:
    //this.system = this.systemService.system;
}

  ngOnInit(): void {
  }

}
