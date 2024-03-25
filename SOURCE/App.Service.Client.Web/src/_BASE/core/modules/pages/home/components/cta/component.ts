import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';
import { TranslateService } from '@ngx-translate/core';
import { System } from '../../../../../constants/contracts/system';

@Component({
  selector: 'app-base-core-pages-landing-index-cta',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Cta Component
 */
export class BaseAppsPagesLandingIndexCtaComponent implements OnInit {

  system: System;

  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translateService: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
  }

}
