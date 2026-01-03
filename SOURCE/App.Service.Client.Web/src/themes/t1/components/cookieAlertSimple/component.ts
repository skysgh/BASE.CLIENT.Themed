// Rx:
//
// Ag:
import { Component, OnInit, inject } from '@angular/core';
// Configuration:
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
// Models:
import { ViewModel } from './vm';

@Component({
    selector: 'app-base-common-components-cookie-alert-simple',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
/**
 * Component to show a bar at the bottom of the screen (or similar)
 * that provides an button for users to Accept Action
 * which creates a cookie to track their Acceptance.
 * Note: a bit circular if you ask me...
 */
export class BaseCoreCommonComponentsCookieAlertSimpleComponent implements OnInit {
  private diagnostics = inject(SystemDiagnosticsTraceService);

  // Expose theme configuration:
  public themeConfiguration = themesT1Configuration;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();


  constructor() {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
  }

  ngOnInit(): void {
    this.diagnostics.debug(`${this.constructor.name}.ngOnInit()`);
  }
}
