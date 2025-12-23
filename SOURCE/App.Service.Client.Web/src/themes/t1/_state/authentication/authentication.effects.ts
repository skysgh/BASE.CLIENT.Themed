// Rx:
import { from, of } from 'rxjs';
import { map, switchMap, catchError, exhaustMap, tap } from 'rxjs/operators';
// Ag:
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';
//import { environment } from 'src/environments/environment';

// Services:
import { AuthenticationService } from '../../../../core/services/auth.service';
// Actions:
import { login, loginSuccess, loginFailure, logout, logoutSuccess, Register } from './authentication.actions';
import { appsConfiguration } from '../../../../apps/configuration/implementations/apps.configuration';

@Injectable()
export class AuthenticationEffects {


  /**
   * 
   * @param actions$
   * @param AuthenticationService
   * @param router
   */
  constructor(
    @Inject(Actions) private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private router: Router) {
  }


  /**
   * Register Effect
   */
  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ email, first_name, password }) =>

        this.AuthenticationService.register(email, first_name, password).pipe(
          map((user) => {

            // Navigate to the login page:
            this.router.navigate([appsConfiguration.navigation.auth.login]);

            return loginSuccess({ user });
          }),
          catchError((error) => of(loginFailure({ error })))
        )

      )
    )
  );

  /**
   * Login Effect
   */
  login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(login),
    exhaustMap(({ email, password }) => {
      if (appsConfiguration.constants.environment.defaultauth === "fakebackend") {
        return this.AuthenticationService.login(email, password).pipe(
          map((user) => {
            if (user.status === 'success') {
              // Store user details and jwt token in local storage to keep user logged in between page refreshes:
              sessionStorage.setItem(appsConfiguration.others.core.constants.storage.session.toast , 'true');
              sessionStorage.setItem(appsConfiguration.others.core.constants.storage.session.currentUser, JSON.stringify(user.data));
              sessionStorage.setItem(appsConfiguration.others.core.constants.storage.session.token, user.token);
              // Navigate to the home page:
              this.router.navigate([appsConfiguration.navigation.home]);
            }
            return loginSuccess({ user });
          }),
          catchError((error) => of(loginFailure({ error })), // Closing parenthesis added here
        ));
      } else if (appsConfiguration.constants.environment.defaultauth === "firebase") {
        return of(); // Return an observable, even if it's empty
      } else {
        return of(); // Return an observable, even if it's empty
      }
    })
  )
);

/**
 * Logout Effect
 */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        // Perform any necessary cleanup or side effects before logging out
      }),
      exhaustMap(() => of(logoutSuccess()))
    )
  );

}
