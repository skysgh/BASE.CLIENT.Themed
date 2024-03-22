// Import dependencies:
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class EnvironmentService {


  // Expose public property of
  // system environment.
  // From there, can get access to base service url. 
  public systemEnvironment: any;

  constructor() {
    this.systemEnvironment = environment;
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
