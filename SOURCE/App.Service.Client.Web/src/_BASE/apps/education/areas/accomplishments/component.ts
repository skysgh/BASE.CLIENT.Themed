// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../../_BASE/core/constants/system';
// Services:
import { SystemService } from "../../../../core/services/system.service";
import { DiagnosticsTraceService } from "../../../../core/services/diagnostics.service";

@Component({
  selector: 'app-base-apps-education-accomplishments',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsEducationAccomplishmentsComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  system = importedSystemConst;

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(systemService: SystemService, private diagnosticsTraceService: DiagnosticsTraceService, translateService: TranslateService) {
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }
}
