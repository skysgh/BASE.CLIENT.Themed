// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../core/constants/system';
// Services:
import { SystemService } from "../../../../core/services/system.service";
import { SystemDiagnosticsTraceService } from "../../../../core/services/system.diagnostics-trace.service";
import { ViewModel } from "./vm";

@Component({
  selector: 'app-base-apps-education-finances',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsEducationFinancesComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(systemService: SystemService, private diagnosticsTraceService: SystemDiagnosticsTraceService, translateService: TranslateService) {
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }
}
