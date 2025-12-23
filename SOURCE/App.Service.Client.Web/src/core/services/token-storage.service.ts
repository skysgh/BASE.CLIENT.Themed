// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
//
// Constants:
import { coreConfiguration } from '../configuration/implementations/core.configuration';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { SessionStorageService } from './infrastructure/SessionStorageService';
import { SystemDefaultServices } from './system.default-services.service';
// Models:
//
// Data:
//

@Injectable({
  providedIn: 'root'
})

export class TokenStorageService {


  constructor(
    private defaultServices: SystemDefaultServices,
    private sessionStorageService: SessionStorageService) {

    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    
  }

  signOut(): void {
    this.defaultServices.diagnosticsTraceService.info("tokenStorageService.sign out");
    this.sessionStorageService.clear();
  }

  public saveToken(token: string): void {
    this.defaultServices.diagnosticsTraceService.info(`tokenStorageService.saveToken('${token}')`);
    this.sessionStorageService.removeItem(coreConfiguration.constants.storage.session.authToken);
    window.sessionStorage.setItem(coreConfiguration.constants.storage.session.authToken, token);
  }

  public getToken(): string | null {
    this.defaultServices.diagnosticsTraceService.info("tokenStorageService.getToken()");
    var result = this.sessionStorageService.getItem(coreConfiguration.constants.storage.session.token);
    this.defaultServices.diagnosticsTraceService.info(`found: '${result}'`);
    return result;
}

  public saveUser(user: any): void {
    this.defaultServices.diagnosticsTraceService.info("tokenStorageService.saveUser()");
    this.sessionStorageService.removeItem(coreConfiguration.constants.storage.session.currentUser);
    var text = JSON.stringify(user);
    this.sessionStorageService.setItem(coreConfiguration.constants.storage.session.currentUser, text);
    this.defaultServices.diagnosticsTraceService.info(`saved: '${text}'`);
  }

  public getUser(): any {
    this.defaultServices.diagnosticsTraceService.info("tokenStorageService.getUser()");
    const text = this.sessionStorageService.getItem(coreConfiguration.constants.storage.session.currentUser);
    this.defaultServices.diagnosticsTraceService.info(`found: '${text}'`);
    if (text) {
      var result = JSON.parse(text);
      return result;
    }
    return {};
  }
}
