// Ag:
import { Component, OnInit } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Services
import { SystemService } from '../../../services/system.service';
import { SystemSettingsService } from '../../../services/service-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseLayoutFooterComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  constructor(systemService: SystemService, public translate: TranslateService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
