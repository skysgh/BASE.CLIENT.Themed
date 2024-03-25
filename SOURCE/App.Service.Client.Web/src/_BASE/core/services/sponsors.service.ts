// Import dependencies:
import { Injectable } from '@angular/core';
import { DiagnosticsTraceService } from './diagnostics.service';

// Describe the service:
@Injectable({ providedIn: 'root' })

  // Injectable service to describe sponsor organisation
  // (ie service provider who funded the development by a developer)
export class SponsorService {
  private title: string = "Some Corp";  
  constructor(private diagnosticsTraceService: DiagnosticsTraceService){
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }
}
