// Etc:
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
// Ag:
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// hum...
import { getFirebaseBackend } from '../../../app/authUtils';
import { RegisterSuccess, loginFailure, loginSuccess, logout, logoutSuccess } from 'src/_BASE/core/store/Authentication/authentication.actions';
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { DiagnosticsTraceService } from './diagnostics.service';
import { ErrorService } from './error.service';
import { SessionStorageService } from './SessionStorageService';
// models:
import { User } from 'src/_BASE/core/store/Authentication/auth.models';

const AUTH_API = importedSystemConst.apis.AUTH_API;

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({ providedIn: 'root' })

/**
 * Auth-service Component
 */
export class AuthenticationService {

    user!: User;
    currentUserValue: any;

    private currentUserSubject: BehaviorSubject<User>;
    // public currentUser: Observable<User>;

  constructor(
    private diagnosticsTraceService: DiagnosticsTraceService,
    private sessionStorageService: SessionStorageService,
    private errorService: ErrorService,


    private http: HttpClient,
    private store: Store) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    var user = JSON.parse(this.sessionStorageService.getItem('currentUser')!);
    this.currentUserSubject = new BehaviorSubject<User>(user);

    // this.currentUser = this.currentUserSubject.asObservable();
    }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
  register(email: string, first_name: string, password: string) {
      this.diagnosticsTraceService.info(`authService.register(email:'${email}', password: ...)`)
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
                this.diagnosticsTraceService.info(`...failed.`);
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
      this.diagnosticsTraceService.info(`authService.login(email:'${email}', password: ...)`)
        // return getFirebaseBackend()!.loginUser(email, password).then((response: any) => {
        //     const user = response;
        //     return user;
        // });

        return this.http.post(AUTH_API + 'signin', {
            email,
            password
        }, httpOptions).pipe(
            map((response: any) => {
                const user = response;
                return user;
            }),
            catchError((error: any) => {
                this.diagnosticsTraceService.info(`...failed.`);
                const errorMessage = 'Login failed'; // Customize the error message as needed
                return throwError(errorMessage);
            })
        );
    }

    /**
     * Returns the current user
     */
    public currentUser(): any {
        return getFirebaseBackend()!.getAuthenticatedUser();
    }

    /**
     * Logout the user
     */
    logout() {
      this.diagnosticsTraceService.info(`authService.logout()`);
        this.store.dispatch(logout());
        // logout the user
        // return getFirebaseBackend()!.logout();
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('token');
        this.currentUserSubject.next(null!);

        return of(undefined).pipe(

        );

    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
      this.diagnosticsTraceService.info(`authService.resetPassword(email:'${email}')`);
      return getFirebaseBackend()!
        .forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

}

