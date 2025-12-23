// Rx:
//
// Ag:
import { Component, OnInit, Renderer2 } from '@angular/core';
// Etc:
//
// Constants:
// Services:
import { ViewModel } from './vm';
import { SystemDefaultServices } from '../../../core/services/system.default-services.service';
import { StringService } from '../../../core/services/string.service';
import { coreAgConfiguration } from '../../configuration/implementations/coreAg.configuration';
import { appsConfiguration } from '../../../apps/configuration/implementations/apps.configuration';
import { DefaultComponentServices } from '../../../core/services/default-controller-services';
// Models:
// Data:

@Component({
  selector: 'app-base-common-components-google-analytics',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsGoogleAnalyticsComponent implements OnInit {
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
    private stringService : StringService,
    private renderer: Renderer2) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);

    if (!this.load) {
      return;
    }
    this.createScriptToBeginGoogleAnalytics();
  }

  private createScriptToBeginGoogleAnalytics() {

    var url = appsConfiguration.others.core.integrations.endpoints.googleAnalytics;
    var key = appsConfiguration.others.core.integrations.keys.googleAnalytics;

    if (!key) { return; }

    // Use helper method to find {{key}} and replace it.
    const script = this.renderer.createElement('script');
    script.src = this.stringService.replaceCurlyBracketsToken(url, 'key', key);
    script.async = true;
    script.defer = true;
    // Append the script to the document body:
    this.renderer.appendChild(document.body, script);

  }
}
