// Ag:
import { Component, OnInit } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Services
import { SystemService } from '../../../services/system.service';
import { SystemSettingsService } from '../../../services/system-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseLayoutFooterComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();
  system = importedSystemConst;

  constructor(systemService: SystemService, public translate: TranslateService) {
    this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
