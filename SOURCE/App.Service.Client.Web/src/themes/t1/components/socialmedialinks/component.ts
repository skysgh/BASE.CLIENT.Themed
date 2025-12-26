// rx:
import { Subscription } from "rxjs";
// Ag:
import { Component, Input, OnDestroy, OnInit, Output } from "@angular/core";
// Etc:
//
// Configuration:
import { appsConfiguration } from "../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../configuration/implementations/themes.t1.configuration";
// Services:
import { DefaultComponentServices } from "../../../../core/services/default-controller-services";
// Models:
import { ViewModel } from "./vm";
// Data:

/**
 * See: https://www.npmjs.com/package/ng2-pdf-viewer
 */
@Component({
  selector: 'app-base-core-common-components-socialmedialinks',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsSocialMediaLinksComponent implements OnInit, OnDestroy {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  constructor(
    private defaultControllerServices: DefaultComponentServices) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);

    // Too early to pick up bound src.
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.onInit()`);
  }


  ngOnDestroy(): void {
  }
}
