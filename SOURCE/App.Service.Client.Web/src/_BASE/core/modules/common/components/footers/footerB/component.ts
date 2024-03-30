// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';
import { TranslateService } from '@ngx-translate/core';
// Models:
//
// Data:
@Component({
  selector: 'app-base-common-components-footer-b',

  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsFooterBComponent implements OnInit {
  // make system/env config accessible by markup:
  system = importedSystemConst;

  public year: number = new Date().getFullYear();

  constructor(
              public translate: TranslateService,
              private systemService: SystemService,
              private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.construtor()`);

    this.system = this.systemService.system;
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.construtor()`);
  }
}
