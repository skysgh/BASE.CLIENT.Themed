// Import Ag:
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// Import Base.Common.Models:
import { System } from '../../../../../../shared/constants/contracts/system';
// Import Base.Common.Services:
import { SystemService } from '../../../../../../shared/services/system.service';
import { DiagnosticsTraceService } from '../../../../../../shared/services/diagnostics.service';


@Component({
  selector: 'app-core-pages-privacy-policy',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseInformationPrivacyPolicyComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  system: System;

  constructor(systemService: SystemService,private diagnosticsTraceService:DiagnosticsTraceService, translateService:TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug("BaseInformationPrivacyPolicyComponent.constructor(...)")

  }

  ngOnInit(): void {
    // Configure breadcrumbs:
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Information' },
      { label: 'Privacy Policy', active: true }
    ];
  }
}
