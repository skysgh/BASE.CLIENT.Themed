// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../core/constants/system';
// Services:
import { SystemService } from "../../../../core/services/system.service";
import { DiagnosticsTraceService } from "../../../../core/services/diagnostics.service";

@Component({
  selector: 'app-base-apps-education-scheduling',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsEducationSchedulingComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  system = importedSystemConst;

  constructor(systemService: SystemService, private diagnosticsTraceService: DiagnosticsTraceService, translateService: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }
}
