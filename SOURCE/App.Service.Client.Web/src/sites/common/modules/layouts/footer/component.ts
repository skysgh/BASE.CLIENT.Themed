// Ag:
import { Component, OnInit } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../../../../../core/constants/system';
// Services
import { SystemService } from '../../../../../core/services/system.service';
import { SystemSettingsService } from '../../../../../core/services/service-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { ViewModel } from './vm';

@Component({
  selector: 'app-footer',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseLayoutFooterComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;
  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // TODO: Move these variables into it.

  constructor(systemService: SystemService, public translate: TranslateService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
