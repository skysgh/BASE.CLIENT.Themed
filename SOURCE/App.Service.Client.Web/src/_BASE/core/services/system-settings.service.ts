// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { DiagnosticsTraceService } from './diagnostics.service';
// Models:
//
// Data:
//

// Describe the service:
@Injectable({ providedIn: 'root' })
export class SystemSettingsService {
  public baseUrl: string = "https:/localhost:1234";
  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
 }
}
