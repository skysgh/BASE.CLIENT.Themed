import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../../shared/services/system.service';
import { System } from '../../../../../../shared/constants/contracts/system';
import { TranslateService } from '@ngx-translate/core';
import { DiagnosticsTraceService } from '../../../../../../shared/services/diagnostics.service';

@Component({
  selector: 'app-core-pages-terms-conditions',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseInformationTermsAndConditionsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  system: System;

  constructor(systemService: SystemService,private diagnosticsTraceService:DiagnosticsTraceService, translateService:TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug("BaseInformationTermsAndConditionsComponent.constructor(...)")
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
