// Rx:
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Ag:
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
// Constants:

// Models:
import { User } from '../models/misc/auth.models';
import { SystemDefaultServices } from './system.default-services.service';
import { appsConfiguration } from '../../sites.app/configuration/implementations/apps.configuration';
// Data:


/**
 * Authentication Service to fake a remote service.
 *
 * Used by `auth.gard.ts` to check if user is authenticated and
 * `auth.interceptor.ts` to add JWT token to requests.
 * Also used by `login.component.ts` to login user.
 * Also used by `register.component.ts` to register user.
 * Also used by `signin` component.
 * 
 */
@Injectable({ providedIn: 'root' })
export class AuthfakeauthenticationService {

  
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private defaultServices: SystemDefaultServices,
    private http: HttpClient) {

    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    // Safely handle case where no user is stored in sessionStorage
    const storedUser = sessionStorage.getItem(appsConfiguration.others.core.constants.storage.session.currentUser);
    const user = storedUser ? JSON.parse(storedUser) : null;

    this.currentUserSubject = new BehaviorSubject<User>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Get's the Current User
   * (from local storage).
   */
  public get currentUserValue(): User {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.currentUserValue()`)

    var result = this.currentUserSubject.value;

    this.defaultServices.diagnosticsTraceService.debug(`...: ${result}`);

    return result;
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(email: string, password: string) {

    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.login('${email}', pwd...)`);

    // Not sure what this does.
    // But it appears to hitting it's own service
    // (Maybe it's using the interceptor to add the token?)
    // and returning a user object.
    return this.http.post<any>(`/users/authenticate`, { email, password })

      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to
          // keep user logged in between page refreshes
          sessionStorage.setItem(appsConfiguration.others.core.constants.storage.session.currentUser, JSON.stringify(user));

          // persist in this service 
          this.currentUserSubject.next(user);
        }
        // and return:
        return user;
      }));
  }

  /**
   * Logs the user out.
   * By removing the user from local storage.
   */
  logout() {

    this.defaultServices.diagnosticsTraceService.info(`${this.constructor.name}.logout()`);

    // remove user from local storage to log user out
    sessionStorage.removeItem(appsConfiguration.others.core.constants.storage.session.currentUser);
    // Clear this service's user.
    this.currentUserSubject.next(null!);
  }
}
