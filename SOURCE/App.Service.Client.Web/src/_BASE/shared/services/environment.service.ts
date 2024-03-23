// Import dependencies:
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DiagnosticsTraceService } from './diagnostics.service';

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class EnvironmentService {


  // Expose public property of
  // system environment.
  // From there, can get access to base service url. 
  public systemEnvironment: any;

  constructor(/*NEVER: private diagnosticsTraceService:DiagnosticsTraceService*/) {
    this.systemEnvironment = environment;
    //this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }

  public isJsonServerContext: boolean = true;

  public getDebugLevel() {
    return environment.custom.diagnostics.level;
  }
  public getApiBaseUrl() : string {
    return environment.custom.service.baseUrl + 'api/';
  }
  public getRestApiBaseUrl() : string {
    return this.getApiBaseUrl() + 'rest/';
  }
}
