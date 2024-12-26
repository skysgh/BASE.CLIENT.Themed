// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../../../../../core/constants/system';
// Services:
import { SystemService } from '../../../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../../core/services/system.diagnostics-trace.service';
import { TranslateService } from '@ngx-translate/core';
import { ViewModel } from './vm';
// Models:
//
// Data:
@Component({
  selector: 'app-base-common-components-footer-b',

  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsFooterBComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.
  constructor(
              public translate: TranslateService,
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
