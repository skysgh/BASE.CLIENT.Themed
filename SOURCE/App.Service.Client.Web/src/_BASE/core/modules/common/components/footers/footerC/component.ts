// Ag:
import { Component, OnInit } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-base-common-components-footer-c',

  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsFooterCComponent implements OnInit {

  private system = importedSystemConst;

  public year: number = new Date().getFullYear();

  constructor(public translate: TranslateService,
              private systemService: SystemService,
              private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.construtor()`);

    this.system = this.systemService.system;
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.construtor()`);
  }
}
