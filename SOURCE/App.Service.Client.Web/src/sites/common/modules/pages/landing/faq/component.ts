import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
import { SystemService } from '../../../../../../core/services/system.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})

/**
 * Faqs Component
 */
export class BaseCorePagesLandingFaqsComponent implements OnInit {
  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translate: TranslateService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }

}
