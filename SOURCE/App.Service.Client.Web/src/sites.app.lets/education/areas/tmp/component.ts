// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.

// Constants:
import { appsConfiguration } from "../../../../apps/configuration/implementations/apps.configuration';

// Services:
//import { SystemService } from "../../../../core/services/system.service";
import { SystemDiagnosticsTraceService } from "../../../../core/services/system.diagnostics-trace.service";
import { ViewModel } from "./vm";
import { DefaultComponentServices } from "../../../../core/services/default-controller-services";

@Component({
  selector: 'app-base-apps-education-enrollment',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsEducationEnrollmentComponent implements OnInit {


  // Expose system configuration:
  public appsConfiguration = appsConfiguration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // TODO: Move these variables into it.

  // bread crumb items
  breadCrumbItems!: Array<{}>;


  constructor(
    private defaultComponentService: DefaultComponentServices) {
    // Make system/env variables avaiable to view template (via singleton or service):
    

    this.defaultComponentService.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.defaultComponentService.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }
}
