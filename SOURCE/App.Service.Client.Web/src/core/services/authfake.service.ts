// Rx:
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Ag:
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Models:
import { User } from '../models/misc/auth.models';
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
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService, private http: HttpClient) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    this.currentUserSubject =
      new BehaviorSubject<User>(
        JSON.parse(sessionStorage.getItem(this.system.storage.system.currentUser)!));

    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Get's the Current User
   * (from local storage).
   */
  public get currentUserValue(): User {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.currentUserValue()`)

    var result = this.currentUserSubject.value;

    this.diagnosticsTraceService.debug(`...: ${result}`);

    return result;
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(email: string, password: string) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.login('${email}', pwd...)`);

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
          sessionStorage.setItem(this.system.storage.system.currentUser, JSON.stringify(user));

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

    this.diagnosticsTraceService.info(`${this.constructor.name}.logout()`);

    // remove user from local storage to log user out
    sessionStorage.removeItem(this.system.storage.system.currentUser);
    // Clear this service's user.
    this.currentUserSubject.next(null!);
  }
}
