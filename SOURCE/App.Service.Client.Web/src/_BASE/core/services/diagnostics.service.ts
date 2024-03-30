// Rx:
import { BehaviorSubject, Observable } from 'rxjs';
// Ag:
import { Injectable } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { EnvironmentService } from './environment.service';
// Model:
//
// Data:

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to develope diagnostic tracing messages to help diagnose issues.
export class DiagnosticsTraceService {

  // Debugging Level: skip verbose?
  public debugLevel: number = 5; //5=Verbose, 4=Debug, 3=Info, 2=Warning, 1=Error...
  public logLength: number = 50;

  private logQueue: string[] = [];
  private logQueueBS: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private environmentService: EnvironmentService) {

    // injected so we can get the *default* logging level
    // (which can be changed at any time to be more verbose)
    this.debugLevel = environmentService.getDebugLevel();
  }

  debug(msg: any) { if (this.debugLevel < 5) { return; }  this.logMsg("DEBUG  :" + msg); console.log  ("DEBUG  : " + msg); }
  verbose(msg: any) { if (this.debugLevel < 4) { return; } this.logMsg("VERBOSE:" + msg); console.log  ("VERBOSE: " + msg); }
  info(msg: any) { if (this.debugLevel < 3) { return; }    this.logMsg("INFO   :" + msg); console.log  ("INFO   : " + msg); }
  warn(msg: any) { if (this.debugLevel < 2) { return; }    this.logMsg("WARN   :" + msg); console.warn ("WARN   : " + msg); }
  error(msg: any) { if (this.debugLevel < 1) { return; }   this.logMsg("ERROR  :" + msg); console.error("ERROR  : " + msg); }

  //
  //  ngOnInit(): void {
  //  this.diagnosticsTraceService.getLog().subscribe(log => {
  //    this.log = log;
  //  });

  public get log(): string[] {
    return this.logQueue;
  }

  public getLog(): Observable<string[]> {
    return this.logQueueBS.asObservable();
  }

  private logMsg(message: string): void {
    this.logQueue.push(message);
    if (this.log.length > this.logLength) {
      this.logQueue.shift(); // Remove the oldest entry if log exceeds 50 lines
    }
    this.logQueueBS.next(this.logQueue);
  }

}

