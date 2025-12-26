// rx:
import { Subscription } from "rxjs";
// Ag:
import { Component, Input, OnDestroy, OnInit, Output } from "@angular/core";
// Etc:
//import { MarkdownService } from 'ngx-markdown';
// Constants:
//
// Services:
import { SystemDiagnosticsTraceService } from "../../../../../core/services/system.diagnostics-trace.service";
import { ViewModel } from "./vm";
import { appsConfiguration } from "../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";

/**
 * See: https://www.npmjs.com/package/ng2-pdf-viewer
 */
@Component({
  selector: 'app-base-core-common-components-signupin',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsSignUpInComponent implements OnInit, OnDestroy {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  constructor(
    private defaultControllerServices: DefaultComponentServices,
  ) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);

    // Too early to pick up bound src.
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.onInit()`);

  }


  ngOnDestroy(): void {
  }
}
