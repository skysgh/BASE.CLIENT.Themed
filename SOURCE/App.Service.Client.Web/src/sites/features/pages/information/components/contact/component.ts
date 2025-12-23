// Rx:
//
// Ag:
import { Component, OnInit } from "@angular/core";
// Configuration:
import { appsConfiguration } from "../../../../../../apps/configuration/implementations/apps.configuration";
import { sitesConfiguration } from "../../../../../configuration/implementation/sites.configuration";
// Services:
import { DefaultComponentServices } from "../../../../../../core/services/default-controller-services";
// Models:
import { ViewModel } from "./vm";

@Component({
  selector: 'app-base-core-pages-information-contact',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCorePagesInformationContactComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(private defaultControllerServices: DefaultComponentServices) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

  }
  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }
}
