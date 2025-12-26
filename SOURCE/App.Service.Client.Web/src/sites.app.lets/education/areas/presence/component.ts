// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { appsConfiguration } from "../../../../apps/configuration/implementations/apps.configuration';
// Services:
//import { SystemService } from "../../../../core/services/system.service";
import { SystemDiagnosticsTraceService } from "../../../../core/services/system.diagnostics-trace.service";
import { ViewModel } from "./vm";
import { DefaultComponentServices } from "../../../../core/services/default-controller-services";
import { appletsEducationConfiguration } from "../../configuration/implementations/app.lets.education.configuration";

@Component({
  selector: 'app-base-apps-education-presence',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsEducationPresenceComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsEducationConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(private defaultControllerServices: DefaultComponentServices) {
    // Make system/env variables avaiable to view template (via singleton or service):

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }
}
