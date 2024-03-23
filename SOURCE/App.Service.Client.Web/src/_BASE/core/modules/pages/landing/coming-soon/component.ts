import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { SystemService } from '../../../../../shared/services/system.service';
import { DiagnosticsTraceService } from '../../../../../shared/services/diagnostics.service';
import { TranslateService } from '@ngx-translate/core';
import { System } from '../../../../../shared/constants/contracts/system';

@Component({
  selector: 'app-base-core-pages-landing-coming-soon',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * ComingSoon Component
 */
export class BaseCorePagesLandingComingSoonComponent  {

  system: System;

  constructor(systemService: SystemService, private diagnosticsTraceService: DiagnosticsTraceService, translateService: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }


}
