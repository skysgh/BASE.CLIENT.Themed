// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../services/system.diagnostics-trace.service';
import { TranslateService } from '@ngx-translate/core';
// Models:
//
// Data:
//

@Component({
  selector: 'app-base-common-components-footer-c',

  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsFooterCComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  constructor(public translate: TranslateService,
              private systemService: SystemService,
              private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.construtor()`);

    // Make system/env variables avaiable to class & view template:
    //this.system = this.systemService.system;
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);
  }
}
