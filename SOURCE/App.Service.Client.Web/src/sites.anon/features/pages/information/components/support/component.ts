// Rx:
//
// Ag:
import { Component, OnInit } from "@angular/core";
// Etc.
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration";
import { sitesConfiguration } from "../../../../../configuration/implementation/sites.configuration";
// Services:
import { DefaultComponentServices } from "../../../../../../core/services/default-controller-services";
// Models:
import { ViewModel } from "./vm";

@Component({
  selector: 'app-base-core-pages-information-support',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCorePagesInformationSupportComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel(appsConfiguration);
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
