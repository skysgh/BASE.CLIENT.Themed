// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
// Constants:
import { coreConfiguration } from '../configuration/implementations/core.configuration';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
// Models:
//
// Data:
//

// Describe the service:
@Injectable({ providedIn: 'root' })
export class SystemSettingsService {

  public baseUrl: string = "https:/localhost:1234";
  constructor(
    /* DO NOT private defaultServices: SystemDefaultServices as it creates circular dependency */
    private  diagnosticsTraceService: SystemDiagnosticsTraceService
  ) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
 }
}

