// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../services/system.diagnostics-trace.service';
// Models:
//
// Data:
//


@Component({
  selector: 'app-base-common-components-footer-a',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsFooterAComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  constructor(private systemService: SystemService,
              translate : TranslateService,
              private diagnosticsTraceService: SystemDiagnosticsTraceService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    // Make system/env variables avaiable to class & view template:
    //this.system = this.systemService.system;

  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);
  }
}
