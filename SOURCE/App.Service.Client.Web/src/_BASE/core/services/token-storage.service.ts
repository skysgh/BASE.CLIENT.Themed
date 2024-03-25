import { Injectable } from '@angular/core';
import { DiagnosticsTraceService } from './diagnostics.service';
import { SessionStorageService } from './SessionStorageService';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(
    private diagnosticsTraceService: DiagnosticsTraceService,
    private sessionStorageService: SessionStorageService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }

  signOut(): void {
    this.diagnosticsTraceService.info("tokenStorageService.sign out");
    this.sessionStorageService.clear();
  }

  public saveToken(token: string): void {
    this.diagnosticsTraceService.info(`tokenStorageService.saveToken('${token}')`);
    this.sessionStorageService.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    this.diagnosticsTraceService.info("tokenStorageService.getToken()");
    var result = this.sessionStorageService.getItem('token');
    this.diagnosticsTraceService.info(`found: '${result}'`);
    return result;
}

  public saveUser(user: any): void {
    this.diagnosticsTraceService.info("tokenStorageService.saveUser()");
    this.sessionStorageService.removeItem(USER_KEY);
    var text = JSON.stringify(user);
    this.sessionStorageService.setItem(USER_KEY, text);
    this.diagnosticsTraceService.info(`saved: '${text}'`);
  }

  public getUser(): any {
    this.diagnosticsTraceService.info("tokenStorageService.getUser()");
    const text = this.sessionStorageService.getItem(USER_KEY);
    this.diagnosticsTraceService.info(`found: '${text}'`);
    if (text) {
      var result = JSON.parse(text);
      return result;
    }
    return {};
  }
}
