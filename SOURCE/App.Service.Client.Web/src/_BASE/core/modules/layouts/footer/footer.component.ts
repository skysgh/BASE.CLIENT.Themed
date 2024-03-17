import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../shared/services/system.service';
import { SystemSettingsService } from '../../../../shared/services/system-settings.service';
import { System } from '../../../../shared/constants/contracts/system';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class BaseLayoutFooterComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();
  system: System;

  constructor(systemService: SystemService, private translateService: TranslateService) {
    this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
