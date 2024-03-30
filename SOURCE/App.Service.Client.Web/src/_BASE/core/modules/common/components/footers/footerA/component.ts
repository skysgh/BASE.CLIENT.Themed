// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';
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
  // make system/env config accessible by markup:
  system = importedSystemConst;

  public year: number = new Date().getFullYear();

  constructor(private systemService: SystemService,
              translate : TranslateService,
              private diagnosticsTraceService: DiagnosticsTraceService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);

    this.system = this.systemService.system;

  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }
}
