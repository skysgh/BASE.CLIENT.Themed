import { Component } from '@angular/core';
import { SystemService } from '../../../../../shared/services/system.service';
import { DiagnosticsTraceService } from '../../../../../shared/services/diagnostics.service';
import { TranslateService } from '@ngx-translate/core';
import { System } from '../../../../../shared/constants/contracts/system';

@Component({
  selector: 'app-base-core-pages-landing-index',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Index Component
 */
export class BaseCorePagesLandingIndexComponent  {

  system: System;

  constructor(systemService: SystemService, private diagnosticsTraceService: DiagnosticsTraceService, translateService: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }


}
