// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
// Models:
//
// Data:
//

// Describe the service:
@Injectable({ providedIn: 'root' })
export class SystemSettingsService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  public baseUrl: string = "https:/localhost:1234";
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
 }
}
