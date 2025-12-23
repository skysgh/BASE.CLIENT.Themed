// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
//
// Constants:

// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { SystemDefaultServices } from './system.default-services.service';
// Models:
//
// Data:
//
// Describe the service:
@Injectable({ providedIn: 'root' })

  // Injectable service to describe sponsor organisation
  // (ie service provider who funded the development by a developer)
export class ServiceSponsorService {
  

  private title: string = "Some Corp";  
  constructor(private defaultServices: SystemDefaultServices){
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }
}
