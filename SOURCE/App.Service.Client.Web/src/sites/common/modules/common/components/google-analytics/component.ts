// Rx:
//
// Ag:
import { Component, OnInit, Renderer2 } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../../../../core/constants/system';
// Services:
import { SystemService } from '../../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
import { ViewModel } from './vm';
// Models:
// Data:

@Component({
  selector: 'app-base-common-components-google-analytics',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsGoogleAnalyticsComponent implements OnInit {
  // make system/env config accessible by markup:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  public load: boolean = true;
  
  constructor(
    private systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private renderer: Renderer2) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
}

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);

    if (!this.load) {
      return;
    }
    const script = this.renderer.createElement('script');
    var key = this.systemService.system.integration.keys.GoogleAnalytics;
    script.src = `https://www.google-analytics.com/analytics.js?key=${key}`;
    script.async = true;
    script.defer = true;
    this.renderer.appendChild(document.body, script);
  }
}
