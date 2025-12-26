// Rx:
// Ag:
import { Component, OnInit, Renderer2 } from '@angular/core';
// Etc:
// Constants:
// Services:
import { SystemDefaultServices } from '../../../core/services/system.default-services.service';
import { StringService } from '../../../core/services/string.service';
// Models:
import { ViewModel } from './vm';
import { RendererService } from '../../../core/services/renderer.service';
import { coreAgConfiguration } from '../../configuration/implementations/coreAg.configuration';
import { appsConfiguration } from '../../../sites.app/configuration/implementations/apps.configuration';
import { DefaultComponentServices } from '../../../core/services/default-controller-services';
// Data:

@Component({
  selector: 'app-base-common-components-google-maps',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsGoogleMapsComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = coreAgConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  public load: boolean = true;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private stringService: StringService,
    private rendererService: RendererService) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
}

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);
    // Check conditions here to determine whether to load Google Analytics
    const loadAnalytics = true; // Example condition

    if (!this.load) {
      return;
    }

    this.createScriptToBeginGoogleMaps();
    
  }
  private createScriptToBeginGoogleMaps() {

    var key = appsConfiguration.others.core.integrations.keys.googleMaps;
    if (!key) { return; }
    var url = appsConfiguration.others.core.integrations.endpoints.googleMaps;

    this.rendererService.appendScriptElement(this.stringService.replaceCurlyBracketsToken(url, 'key', key));

  }
}
