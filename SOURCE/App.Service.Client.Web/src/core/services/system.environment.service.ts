// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
//

// Services//
//import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { environment } from '../../environments/environment';
//import { appsConfiguration } from '../../apps/configuration/implementations/apps.configuration';


// Describe the service:

/**
* Injectable service to describe current environment
* Indirectly (via DiagnosticsTraceService) part of the
* SystemDefaultServicesService.
 */
@Injectable({ providedIn: 'root' })

export class SystemEnvironmentService {

  //// Expose public property of
  //// system environment.
  //// From there, can get access to base service url.
  //public environment: any;

  /**
   * Constructor
   */
  constructor(
  /*NEVER: private diagnosticsTraceService:DiagnosticsTraceService*/
    /*NEVER: private defaultServces:SystemDefaultServices*/
              ) {
    // Make system/env variables avaiable to view template (via singleton or service):
    
    //this.environment = importedSystemConst.environment;
    //this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }

  public isJsonServerContext: boolean = true;

  public getDebugLevel() {
    return environment.custom.diagnostics.level;
  }
//  public getApiBaseUrl() : string {
//    return appsConfiguration.constants.apis.root;
//  }
////  public getRestApiBaseUrl() : string {
//    return this.system.apis.baseRestUrl;
//  }
}
