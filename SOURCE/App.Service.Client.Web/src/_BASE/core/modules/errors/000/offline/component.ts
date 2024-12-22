// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../common/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../services/system.diagnostics-trace.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-errors-offline',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Offline Component
 */
export class BaseErrorsOfflineComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService,
    systemService: SystemService,
    public translate: TranslateService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);


  }

  ngOnInit(): void {
  }

}
