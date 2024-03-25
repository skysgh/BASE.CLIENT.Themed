import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../services/system.service';
import { System } from '../../../../../constants/contracts/system';
import { TranslateService } from '@ngx-translate/core';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';

@Component({
  selector: 'app-base-core-pages-information-index',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCorePagesInformationIndexComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  system: System;

  constructor(systemService: SystemService, private diagnosticsTraceService: DiagnosticsTraceService, translateService: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)

    // Configure breadcrumbs:
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Information' },
      { label: 'Term & Conditions', active: true }
    ];
  }
}
