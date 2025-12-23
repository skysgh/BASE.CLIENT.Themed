// Rx:
import { BehaviorSubject, Observable } from 'rxjs';
// Ag:
import { Injectable } from '@angular/core';
// Constants:

// Services:
import { SystemEnvironmentService } from './system.environment.service';

// Model:
//
// Data:

// Describe the service:

/**
 * Injectable service to develope diagnostic tracing messages to help diagnose issues.
 * 
 * In turn depends on the EnvironmentService
 *
 * Part of the SystemDefaultServicesService
 */
@Injectable({ providedIn: 'root' })

  // Injectable service to develope diagnostic tracing messages to help diagnose issues.

export class SystemDiagnosticsTraceService {


  // Debugging Level: skip verbose?
  public debugLevel: number = 5; //5=Verbose, 4=Debug, 3=Info, 2=Warning, 1=Error...
  public logLength: number = 50;

  private logQueue: string[] = [];
  private logQueueBS: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  /**
   * WARNING: Avoid injecting in DefaultServicesService
   * 
   * @param environmentService
   */
  constructor(
    /*NEVER: private defaultServces:SystemDefaultServices*/
  private environmentService: SystemEnvironmentService
  ) {

    // injected so we can get the *default* logging level
    // (which can be changed at any time to be more verbose)
    this.debugLevel = environmentService.getDebugLevel();
  }

  debug(msg: any) { 
    if (this.debugLevel < 5) { return; }  
    var formattedMessage:string = this.formatMessage(msg);
    this.logMsg("DEBUG  :" + formattedMessage); 
    console?.log("DEBUG  : " + formattedMessage);
  }
  
  verbose(msg: any) { 
    if (this.debugLevel < 4) { return; } 
    var formattedMessage: string = this.formatMessage(msg);
    this.logMsg("VERBOSE:" + formattedMessage); 
    console?.log("VERBOSE: " + formattedMessage);    
  }
  
  info(msg: any) { 
    if (this.debugLevel < 3) { return; }    
    var formattedMessage: string = this.formatMessage(msg);
    this.logMsg("INFO   :" + formattedMessage); 
    console?.log("INFO   : " + formattedMessage);
  }
  
  warn(msg: any) { 
    if (this.debugLevel < 2) { return; }    
    var formattedMessage: string = this.formatMessage(msg);
    this.logMsg("WARN   :" + formattedMessage); 
    console?.warn("WARN   : " + formattedMessage);
  }
  
  error(msg: any) { 
    if (this.debugLevel < 1) { return; }   
    var formattedMessage = this.formatMessage(msg);
    this.logMsg("ERROR  :" + formattedMessage); 
    console?.error("ERROR  : " + formattedMessage);
  }

  /**
   * Format a message from any type of input
   */
  private formatMessage(msg: any): string {
    try {
      if (msg === null || msg === undefined) {
        return String(msg);
      }
      
      // Check if it's an Error object - but be defensive about accessing properties
      if (msg instanceof Error) {
        try {
          // Use Object.prototype.toString to avoid accessor issues
          if ('message' in msg && msg.message) {
            return String(msg.message);
          }
        } catch {
          // Fall through to toString attempt
        }

        try {
          return msg.toString();
        } catch {
          return 'Unknown error';
        }
      }      
      // Handle objects
      if (typeof msg === 'object') {
        try {
          return JSON.stringify(msg);
        } catch {
          try {
            return String(msg);
          } catch {
            return '[Object]';
          }
        }
      }
      
      // Handle primitives
      return String(msg);
    } catch (e) {
      return 'Error formatting message';
    }
  }

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

  private logMsg(msg: string): void {
    this.logQueue.push(msg);
    if (this.log.length > this.logLength) {
      this.logQueue.shift(); // Remove the oldest entry if log exceeds 50 lines
    }
    this.logQueueBS.next(this.logQueue);
  }

}

