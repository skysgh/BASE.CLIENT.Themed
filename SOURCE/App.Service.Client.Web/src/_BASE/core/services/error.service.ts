// Import dependencies:
import { Injectable } from '@angular/core';
import { DiagnosticsTraceService } from './diagnostics.service';

// Describe the service:
@Injectable({ providedIn: 'root' })

  // Injectable service to capture errors and record them
  // back on the service.
  // Presumably till a new count of zero.
export class ErrorService{

  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
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
