// Ag:
import { Component } from '@angular/core';
//
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../common/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../services/system.diagnostics-trace.service';
import { ViewModel } from './vm';
//

@Component({
  selector: 'app-base-core-pages-landing-index',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Index Component
 */
export class BaseCorePagesLandingIndexComponent  {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;
  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translate: TranslateService) {
    // Make system/env variables avaiable to view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }


}
