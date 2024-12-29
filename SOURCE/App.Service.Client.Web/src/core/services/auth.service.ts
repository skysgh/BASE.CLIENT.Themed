// Etc:
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
// Ag:
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// hum...
import { getFirebaseBackend } from '../utilities/authUtils';
import { RegisterSuccess, loginFailure, loginSuccess, logout, logoutSuccess } from '../../sites/common/store/Authentication/authentication.actions';
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { SystemErrorService } from './system.error.service';
import { SessionStorageService } from './infrastructure/SessionStorageService';
// models:
import { User } from '../../sites/common/store/Authentication/auth.models';


const AUTH_API = importedSystemConst.apis.themesbrand.AUTH_API;

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({ providedIn: 'root' })

/**
 * Auth-service Component
 */
export class AuthenticationService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  user!: User;
  currentUserValue: any;

  private currentUserSubject: BehaviorSubject<User>;
  // public currentUser: Observable<User>;

  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private sessionStorageService: SessionStorageService,
    private errorService: SystemErrorService,


    private http: HttpClient,
    private store: Store) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    var user = JSON.parse(this.sessionStorageService.getItem(this.system.storage.system.currentUser)!);
    this.currentUserSubject = new BehaviorSubject<User>(user);

    // this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Performs the register
   * @param email email
   * @param password password
   */
  register(email: string, first_name: string, password: string) {
    this.diagnosticsTraceService.info(`${this.constructor.name}.register(email:'${email}', password: ...)`)
    // return getFirebaseBackend()!.registerUser(email, password).then((response: any) => {
    //     const user = response;
    //     return user;
    // });

    var msg = {
      email,
      first_name,
      password,
    };
    // Register Api
    return this.http.post(AUTH_API + 'signup', msg, httpOptions).pipe(
      map((response: any) => {
        const user = response;
        return user;
      }),
      catchError((error: any) => {
        const errorMessage = 'Login failed'; // Customize the error message as needed
        this.diagnosticsTraceService.warn(`...failed.`);
        this.store.dispatch(loginFailure({ error: errorMessage }));
        return throwError(errorMessage);
      })
    );
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(email: string, password: string) {
    this.diagnosticsTraceService.info(`${this.constructor.name}.login(email:'${email}', password: ...)`)
    // return getFirebaseBackend()!.loginUser(email, password).then((response: any) => {
    //     const user = response;
    //     return user;
    // });

    this.diagnosticsTraceService.info(`...posting to ${AUTH_API}...)`)

    return this.http.post(AUTH_API + 'signin', {
      email,
      password
    }, httpOptions).pipe(
      map((response: any) => {
        this.diagnosticsTraceService.info(`...response received successfully.`);
        const user = response;
        return user;
      }),
      catchError((error: any) => {

        this.diagnosticsTraceService.warn(`...query failed.`);

        const errorMessage = 'Login failed'; // Customize the error message as needed
        return throwError(errorMessage);
      })
    );
  }

  /**
   * Returns the current user
   */
  public currentUser(): any {
    this.diagnosticsTraceService.info(`${this.constructor.name}.currentUser()`)

    return getFirebaseBackend()!.getAuthenticatedUser();
  }

  /**
   * Logout the user
   */
  logout() {
    this.diagnosticsTraceService.info(`${this.constructor.name}.logout()`);
    this.store.dispatch(logout());
    // logout the user
    // return getFirebaseBackend()!.logout();
    sessionStorage.removeItem(this.system.storage.system.currentUser);
    sessionStorage.removeItem(this.system.storage.system.token);
    this.currentUserSubject.next(null!);

    return of(undefined).pipe(

    );

  }

  /**
   * Reset password
   * @param email email
   */
  resetPassword(email: string) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.resetPassword(email:'${email}')`);

    return getFirebaseBackend()!
      .forgetPassword(email).then((response: any) => {
        const message = response.data;
        return message;
      });
  }

}

