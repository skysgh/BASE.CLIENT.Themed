// Rx:
//
// Ag:
import { Component, Input, OnInit} from "@angular/core";
// Etc:
//import { MarkdownService } from 'ngx-markdown';
// Constants:
// Services:
import { SystemDefaultServices } from "../../../core/services/system.default-services.service";
// Models:
import { ViewModel } from "./vm";
// ✅ UPDATED: Use new tier path after restructuring (apps -> sites.app)
import { appsConfiguration } from "../../../sites.app/configuration/implementations/apps.configuration';
import { coreAgConfiguration } from "../../configuration/implementations/coreAg.configuration";
import { DefaultComponentServices } from "../../../core/services/default-controller-services";
// Data:
//

/**
 * A Component to render Markdown as HTML.
 *
 * It's key purpose is to isolate the rest of the app
 * from direct dependencies on 3rd party libraries.
 * 
 * So it's just a wrapper.
 */
/**
 * See: https://jfcere.github.io/ngx-markdown/get-started
 */
@Component({
  selector: 'app-base-core-common-components-markdown',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseCoreCommonComponentsMarkdownComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = coreAgConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  //viewModel.flags = appsConfiguration.;

  @Input()
  public src: string|null =null;


  @Input()
  public data: string|null=null;

  constructor(
    private defaultControllerServices: DefaultComponentServices) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }


  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.onInit()`);
  }


}
