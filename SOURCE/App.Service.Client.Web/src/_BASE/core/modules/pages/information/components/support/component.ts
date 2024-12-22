// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../common/pipes/basetranslate.pipe';
// Services:
import { SystemService } from "../../../../../services/system.service";
import { SystemDiagnosticsTraceService } from "../../../../../services/system.diagnostics-trace.service";
import { ViewModel } from "./vm";

@Component({
  selector: 'app-base-core-pages-information-support',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCorePagesInformationSupportComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(systemService: SystemService, private diagnosticsTraceService: SystemDiagnosticsTraceService, translateService: TranslateService) {
    // Make system/env variables avaiable to class & view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }
}
