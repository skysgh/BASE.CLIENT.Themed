// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Constants:
//
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

// Describe the service:
@Injectable({ providedIn: 'root' })

  /**
  * Injectable service to capture errors and record them
  * back to the server (later).
  *
  * Part of the SystemDefaultServicesService
  */
export class SystemErrorService{
  // Make system/env variables avaiable to class & view template:
  //

  /**
   * Constructor.
   * 
   * WARNING: Can't inject DefaultServices as it depends on this
   * service.
   * @param diagnosticsTraceService
   */
  constructor(
    // NEVER INJECT private defaultServices: SystemDefaultServices AS IT WILL CYCLE
    private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }

  public report(error: any) : string  {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    this.diagnosticsTraceService.error(errorMessage);
    //consider whether to alert it?

    return errorMessage;
  }

}
