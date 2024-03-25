//
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//
import { System } from '../../../../constants/contracts/system';
// 
import { SystemService } from '../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../services/diagnostics.service';

@Component({
  selector: 'app-base-core-errors-offline',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Offline Component
 */
export class BaseErrorsOfflineComponent implements OnInit {

  system: System;
  constructor(private diagnosticsTraceService: DiagnosticsTraceService,
    systemService: SystemService,
    public translate: TranslateService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);

    this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
