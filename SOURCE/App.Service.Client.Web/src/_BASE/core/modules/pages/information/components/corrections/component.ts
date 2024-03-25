// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { System } from "../../../../../constants/contracts/system";
// Services:
import { SystemService } from "../../../../../services/system.service";
import { DiagnosticsTraceService } from "../../../../../services/diagnostics.service";

@Component({
  selector: 'app-base-core-pages-information-corrections',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCorePagesInformationCorrectionsComponent implements OnInit {

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
