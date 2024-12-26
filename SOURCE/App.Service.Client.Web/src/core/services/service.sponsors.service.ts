// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
//
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

  // Injectable service to describe sponsor organisation
  // (ie service provider who funded the development by a developer)
export class ServiceSponsorService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  private title: string = "Some Corp";  
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService){
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }
}
