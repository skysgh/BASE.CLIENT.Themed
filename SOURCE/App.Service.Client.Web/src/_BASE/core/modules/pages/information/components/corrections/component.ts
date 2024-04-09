// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Services:
import { SystemService } from "../../../../../services/system.service";
import { SystemDiagnosticsTraceService } from "../../../../../services/system.diagnostics-trace.service";

@Component({
  selector: 'app-base-core-pages-information-corrections',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCorePagesInformationCorrectionsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  constructor(systemService: SystemService, private diagnosticsTraceService: SystemDiagnosticsTraceService, translateService: TranslateService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }
}
