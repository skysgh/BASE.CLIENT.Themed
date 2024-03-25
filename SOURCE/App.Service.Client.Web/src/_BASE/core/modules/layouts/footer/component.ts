import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../services/system.service';
import { SystemSettingsService } from '../../../services/system-settings.service';
import { System } from '../../../constants/contracts/system';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseLayoutFooterComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();
  system: System;

  constructor(systemService: SystemService, public translate: TranslateService) {
    this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
