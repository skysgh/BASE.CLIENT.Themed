import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../_custom/common/services/system.service';
import { SystemSettingsService } from '../../../_custom/common/services/system-settings.service';
import { System } from '../../../_custom/common/models/system.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();
  system: System;

  constructor(systemService: SystemService) {
    this.system = systemService.system;
}

  ngOnInit(): void {
  }

}
