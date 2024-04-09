// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../core/constants/system';
// Services:
import { SystemService } from "../../../../core/services/system.service";
import { SystemDiagnosticsTraceService } from "../../../../core/services/system.diagnostics-trace.service";

@Component({
  selector: 'app-base-apps-education-enrollment',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsEducationEnrollmentComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;

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
