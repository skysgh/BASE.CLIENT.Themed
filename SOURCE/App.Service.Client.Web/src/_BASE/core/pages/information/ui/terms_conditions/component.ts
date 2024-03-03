import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../shared/services/system.service';
import { System } from '../../../../../shared/models/system.model';
import { TranslateService } from '@ngx-translate/core';
import { DiagnosticsService } from '../../../../../shared/services/diagnostics.service';

@Component({
  selector: 'app-core-pages-terms-conditions',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseInformationTermsAndConditionsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  system: System;

  constructor(systemService: SystemService,private diagnosticsService:DiagnosticsService, translateService:TranslateService) {
    this.system = systemService.system;
  }

  ngOnInit(): void {
    // Configure breadcrumbs:
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Information' },
      { label: 'Term & Conditions', active: true }
    ];
  }
}
