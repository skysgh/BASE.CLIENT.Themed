// Ag:
import { Component, OnInit } from "@angular/core";
// Configuration:
import { appsConfiguration } from "../../../../apps/configuration/implementations/apps.configuration";
import { appletsEducationConfiguration } from "../../configuration/implementations/app.lets.education.configuration";
// Services:
import { ViewModel } from "./vm";
import { DefaultComponentServices } from "../../../../core/services/default-controller-services";
// ViewModel:

@Component({
  selector: 'app-base-apps-education-places',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsEducationPlacesComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsEducationConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // bread crumb items
  breadCrumbItems!: Array<{}>;


  constructor(public defaultControllerServices: DefaultComponentServices) {
    // Make system/env variables avaiable to view template (via singleton or service):

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }
}
