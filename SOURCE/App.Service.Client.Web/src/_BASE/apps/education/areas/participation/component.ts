// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { System } from "../../../../core/constants/contracts/system";
// Services:
import { SystemService } from "../../../../core/services/system.service";
import { DiagnosticsTraceService } from "../../../../core/services/diagnostics.service";

@Component({
  selector: 'app-base-apps-education-participation',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsEducationParticipationComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  system: System;

  constructor(systemService: SystemService, private diagnosticsTraceService: DiagnosticsTraceService, translateService: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }
}
