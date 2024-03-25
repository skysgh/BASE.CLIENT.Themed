import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DiagnosticsTraceService } from '../../../../services/diagnostics.service';
import { SystemService } from '../../../../services/system.service';

@Component({
  selector: 'app-base-core-pages-landing-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})

/**
 * Faqs Component
 */
export class BaseCorePagesLandingFaqsComponent implements OnInit {

  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translate: TranslateService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }

}
