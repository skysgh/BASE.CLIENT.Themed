// Import dependencies:
import { Injectable } from '@angular/core';

import { DiagnosticsTraceService } from './diagnostics.service';

// Describe the service:
@Injectable({ providedIn: 'root' })
// Injectable service to describe current environment
export class ExampleService {


  public someField: string = "hell...";

  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }

  // some method
  public someMethod() {
    this.diagnosticsTraceService.info("entering someMethod");
    //do something...
    this.diagnosticsTraceService.info("exiting someMethod");
  }


}
