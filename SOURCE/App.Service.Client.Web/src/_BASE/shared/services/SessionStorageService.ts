import { Injectable } from '@angular/core';
import { DiagnosticsTraceService } from './diagnostics.service';


@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {

  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {

  }

  clear(): void {
    this.diagnosticsTraceService.info("sessionStorageService.clear()");
    window.sessionStorage.clear();
  }

  /**
   * Reminder: JSON.Stringify() objects before saving as strings.
   * @param key
   * @param value
   */
  public setItem(key: string, value: string): void {
    this.diagnosticsTraceService.info(`tokenStorageService.saveToken('${key}', '${value}')`);
    window.sessionStorage.removeItem(key);
    window.sessionStorage.setItem(key, value);
  }

  public getItem(key:string): string | null {
    this.diagnosticsTraceService.info(`tokenStorageService.getToken('${key}')`);
    var result = sessionStorage.getItem(key);
    this.diagnosticsTraceService.info(`...found: '${result}'`);
    return result;
  }

  public removeItem(key: string): void {
    this.diagnosticsTraceService.info(`tokenStorageService.removeToken('${key}')`);
    window.sessionStorage.removeItem(key);
  }


}



