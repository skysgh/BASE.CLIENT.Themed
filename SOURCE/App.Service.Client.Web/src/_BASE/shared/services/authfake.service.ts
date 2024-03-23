import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/misc/auth.models';
import { DiagnosticsTraceService } from './diagnostics.service';

@Injectable({ providedIn: 'root' })
export class AuthfakeauthenticationService {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

  constructor(private diagnosticsTraceService: DiagnosticsTraceService, private http: HttpClient) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    this.currentUserSubject =
      new BehaviorSubject<User>(
        JSON.parse(sessionStorage.getItem('currentUser')!));

    this.currentUser = this.currentUserSubject.asObservable();
    }

    /**
     * current user
     */
    public get currentUserValue(): User {
      this.diagnosticsTraceService.info("AuthfakeauthenticationService.currentUserValue()")
      var result = this.currentUserSubject.value;
      this.diagnosticsTraceService.info(`...: ${result}`);
      return result;
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(email: string, password: string) {
      this.diagnosticsTraceService.info(`AuthfakeauthenticationService.login('${email}', pwd...)`)

        return this.http.post<any>(`/users/authenticate`, { email, password })

            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user));

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
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null!);
    }
}
