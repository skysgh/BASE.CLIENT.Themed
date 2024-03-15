import { Component, OnInit } from '@angular/core';
import { System } from '../../../../../_BASE/shared/constants/contracts/system';
import { SystemService } from '../../../../../_BASE/shared/services/system.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-job-footer',
  templateUrl: './job-footer.component.html',
  styleUrls: ['./job-footer.component.scss']
})
export class JobFooterComponent implements OnInit {
  // set the current year
  year: number = new Date().getFullYear();
  system: System;

  constructor(systemService: SystemService, private translateService: TranslateService) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
