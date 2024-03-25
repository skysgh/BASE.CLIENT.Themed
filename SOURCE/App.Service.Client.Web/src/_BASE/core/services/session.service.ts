// Import dependencies:
import { Injectable } from '@angular/core';
import { DiagnosticsTraceService } from './diagnostics.service';

// Describe the service:
@Injectable({ providedIn: 'root' })

  // Injectable service to describe current environment
export class SessionService {

  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }
}
