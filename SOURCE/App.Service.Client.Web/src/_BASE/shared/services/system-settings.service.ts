// Import dependencies:
import { Injectable } from '@angular/core';
import { DiagnosticsTraceService } from './diagnostics.service';

// Describe the service:
@Injectable({ providedIn: 'root' })
export class SystemSettingsService {
  public baseUrl: string = "https:/localhost:1234";
  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
 }
}
