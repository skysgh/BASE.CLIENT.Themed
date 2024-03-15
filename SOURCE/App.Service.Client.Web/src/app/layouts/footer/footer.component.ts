import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../_BASE/shared/services/system.service';
import { SystemSettingsService } from '../../../_BASE/shared/services/system-settings.service';
import { System } from '../../../_BASE/shared/constants/contracts/system';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();
  system: System;

  constructor(systemService: SystemService, private translateService: TranslateService) {
    this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
