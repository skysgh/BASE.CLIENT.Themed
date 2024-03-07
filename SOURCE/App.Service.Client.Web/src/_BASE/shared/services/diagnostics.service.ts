// Import dependencies:
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to develope diagnostic tracing messages to help diagnose issues.
export class DiagnosticsService {

  // Debugging Level: skip verbose?
  public debugLevel: number = 1;
  public logLength: number = 50;

  private logQueue: string[] = [];
  private logQueueBS: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private environmentService: EnvironmentService) {

    // injected so we can get the *default* logging level
    // (which can be changed at any time to be more verbose)
    this.debugLevel = environmentService.getDebugLevel();
  }

  verbose(msg: any) { if (this.debugLevel > 0) { return; } this.logMsg("VERBOSE:" + msg); console.log  ("VERBOSE: " + msg); }
  info(msg: any) { if (this.debugLevel > 1) { return; }    this.logMsg("INFO   :" + msg); console.log  ("INFO   : " + msg); }
  warn(msg: any) { if (this.debugLevel > 2) { return; }    this.logMsg("WARN   :" + msg); console.warn ("WARN   : " + msg); }
  error(msg: any) { if (this.debugLevel > 3) { return; }   this.logMsg("ERROR  :" + msg); console.error("ERROR  : " + msg); }

  //
  //  ngOnInit(): void {
  //  this.diagnosticsService.getLog().subscribe(log => {
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

