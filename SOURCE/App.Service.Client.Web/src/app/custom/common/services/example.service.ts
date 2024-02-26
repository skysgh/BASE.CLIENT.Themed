// Import dependencies:
import { Injectable } from '@angular/core';

import { DiagnosticsService } from './diagnostics.service';

// Describe the service:
@Injectable({ providedIn: 'root' })
// Injectable service to describe current environment
export class ExampleService {


  public someField: string = "hell...";

  constructor(private diagnosticsService: DiagnosticsService) {

  }

  // some method
  public someMethod() {
    this.diagnosticsService.info("entering someMethod");
    //do something...
    this.diagnosticsService.info("exiting someMethod");
  }


}
