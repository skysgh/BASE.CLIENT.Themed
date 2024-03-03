// Import dependencies:
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to develope diagnostic tracing messages to help diagnose issues.
export class DiagnosticsService {

  // Debugging Level
  public debugLevel: number = 1;

  constructor(private environmentService: EnvironmentService) {
    // injected so we can get the *default* logging level
    // (which can be changed at any time to be more verbose)
    this.debugLevel = environmentService.getDebugLevel();
  }

  verbose(msg: any) { if (this.debugLevel > 0) { return; }  console.log  ("VERBOSE: " + msg); }
  info(msg: any) { if (this.debugLevel > 1) { return; }     console.log  ("INFO   : " + msg); }
  warn(msg: any) { if (this.debugLevel > 2) { return; }     console.warn ("WARN   : " + msg); }
  error(msg: any) { if (this.debugLevel > 3) { return; }    console.error("ERROR  : " + msg); }

}

