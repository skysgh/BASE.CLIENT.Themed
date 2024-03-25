import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SystemService } from '../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';
import { System } from '../../../../../constants/contracts/system';

@Component({
  selector: 'app-base-core-pages-landing-index-footer',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Footer Component
 */
export class BaseAppsPagesLandingIndexFooterComponent implements OnInit {
  // set the current year
  year: number = new Date().getFullYear();
  system: System;

  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translate: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
  }

}
