// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Constants:
//import { coreConfiguration } from '../../../configuration/inplementations/core.configuration';

// Services:
import { SystemDiagnosticsTraceService } from './../system.diagnostics-trace.service';
import { SystemDefaultServices } from '../system.default-services.service';


@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {

  constructor(
    private defaultServices: SystemDefaultServices) {

    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
    
  }

  clear(): void {
    this.defaultServices.diagnosticsTraceService.info("sessionStorageService.clear()");

    window.sessionStorage.clear();
  }

  /**
   * Reminder: JSON.Stringify() objects before saving as strings.
   * @param key
   * @param value
   */
  public setItem(key: string, value: string): void {
    this.defaultServices.diagnosticsTraceService.info(`tokenStorageService.saveToken('${key}', '${value}')`);

    window.sessionStorage.removeItem(key);
    window.sessionStorage.setItem(key, value);
  }

  public getItem(key:string): string | null {
    this.defaultServices.diagnosticsTraceService.info(`tokenStorageService.getToken('${key}')`);
    var result = sessionStorage.getItem(key);
    this.defaultServices.diagnosticsTraceService.info(`...found: '${result}'`);
    return result;
  }

  public removeItem(key: string): void {
    this.defaultServices.diagnosticsTraceService.info(`tokenStorageService.removeToken('${key}')`);
    window.sessionStorage.removeItem(key);
  }


}



