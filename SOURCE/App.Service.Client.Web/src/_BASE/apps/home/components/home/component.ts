//import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//
import { System } from '../../../../shared/constants/contracts/system';
//
import { SystemService } from '../../../../shared/services/system.service';
import { DiagnosticsTraceService } from '../../../../shared/services/diagnostics.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apps-home-home',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsPagesInformationIndexComponent implements OnInit {

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
      { label: 'Home', active: true }
    ];
  }
}
