// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { SystemService } from '../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../services/system.diagnostics-trace.service';
// Models:
//
// Data:
//


@Component({
  selector: 'app-base-common-components-cookie-alert-simple',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
/**
 * Component to show a bar at the bottom of the screen (or similar)
 * that provides an button for users to Accept Action
 * which creates a cookie to track their Acceptance.
 * Note: a bit circular if you ask me...
 */
export class BaseCoreCommonComponentsCookieAlertSimpleComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  
  constructor(private systemService: SystemService,
    translate: TranslateService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    // Make system/env variables avaiable to class & view template:
    //this.system = this.systemService.system;
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);
  }
}
