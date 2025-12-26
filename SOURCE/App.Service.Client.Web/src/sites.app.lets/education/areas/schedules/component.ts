// Ag:
import { Component, OnInit } from "@angular/core";
// Configuration:
import { appsConfiguration } from "../../../../apps/configuration/implementations/apps.configuration';
import { appletsEducationConfiguration } from "../../configuration/implementations/app.lets.education.configuration";
// Services:
import { DefaultComponentServices } from "../../../../core/services/default-controller-services";
// ViewModel:
import { ViewModel } from "./vm";

@Component({
  selector: 'app-base-apps-education-scheduling',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsEducationSchedulingComponent implements OnInit {
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
