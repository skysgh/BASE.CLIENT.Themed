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
     * current user
     */
    public get currentUserValue(): User {
      this.diagnosticsTraceService.debug("AuthfakeauthenticationService.currentUserValue()")
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
      this.diagnosticsTraceService.debug(`${this.constructor.name }.login('${email}', pwd...)`)

        return this.http.post<any>(`/users/authenticate`, { email, password })

            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                  sessionStorage.setItem(this.system.storage.system.currentUser, JSON.stringify(user));

                  this.currentUserSubject.next(user);
                }
                return user;
            }));
    }

    /**
     * Logout the user
     */
    logout() {
      // remove user from local storage to log user out
      sessionStorage.removeItem(this.system.storage.system.currentUser);
        this.currentUserSubject.next(null!);
    }
}
