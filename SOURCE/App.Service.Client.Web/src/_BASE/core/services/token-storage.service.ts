// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { SessionStorageService } from './infrastructure/SessionStorageService';
// Models:
//
// Data:
//


@Injectable({
  providedIn: 'root'
})

export class TokenStorageService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;


  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private sessionStorageService: SessionStorageService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }

  signOut(): void {
    this.diagnosticsTraceService.info("tokenStorageService.sign out");
    this.sessionStorageService.clear();
  }

  public saveToken(token: string): void {
    this.diagnosticsTraceService.info(`tokenStorageService.saveToken('${token}')`);
    this.sessionStorageService.removeItem(this.system.storage.system.authToken);
    window.sessionStorage.setItem(this.system.storage.system.authToken, token);
  }

  public getToken(): string | null {
    this.diagnosticsTraceService.info("tokenStorageService.getToken()");
    var result = this.sessionStorageService.getItem(this.system.storage.system.token);
    this.diagnosticsTraceService.info(`found: '${result}'`);
    return result;
}

  public saveUser(user: any): void {
    this.diagnosticsTraceService.info("tokenStorageService.saveUser()");
    this.sessionStorageService.removeItem(this.system.storage.system.currentUser);
    var text = JSON.stringify(user);
    this.sessionStorageService.setItem(this.system.storage.system.currentUser, text);
    this.diagnosticsTraceService.info(`saved: '${text}'`);
  }

  public getUser(): any {
    this.diagnosticsTraceService.info("tokenStorageService.getUser()");
    const text = this.sessionStorageService.getItem(this.system.storage.system.currentUser);
    this.diagnosticsTraceService.info(`found: '${text}'`);
    if (text) {
      var result = JSON.parse(text);
      return result;
    }
    return {};
  }
}
