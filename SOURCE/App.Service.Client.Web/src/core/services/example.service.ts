// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Constants:

// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

// Describe the service:
@Injectable({ providedIn: 'root' })
// Injectable service to describe current environment
export class ExampleService {


  public someField: string = "hell...";

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }

  // some method
  public someMethod() {
    this.diagnosticsTraceService.debug(`${ this.constructor.name }.entering someMethod`);
    //do something...
    this.diagnosticsTraceService.debug(`${ this.constructor.name }.exiting someMethod`);
  }


}
