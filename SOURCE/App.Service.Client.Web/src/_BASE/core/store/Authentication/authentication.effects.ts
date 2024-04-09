import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, exhaustMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { AuthenticationService } from '../../services/auth.service';
import { login, loginSuccess, loginFailure, logout, logoutSuccess, Register} from './authentication.actions';
import { Router } from '@angular/router';
//import { environment } from 'src/environments/environment';
// Const:
import { system as importedSystemConst } from '../../constants/system';

@Injectable()
export class AuthenticationEffects {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ email, first_name, password }) =>
        this.AuthenticationService.register(email, first_name, password).pipe(
          map((user) => {
            this.router.navigate([this.system.navigation.auth.login]);
            return loginSuccess({ user });
          }),
          catchError((error) => of(loginFailure({ error })))
        )
      )
    )
  );

  login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(login),
    exhaustMap(({ email, password }) => {
      if (this.system.environment.defaultauth === "fakebackend") {
        return this.AuthenticationService.login(email, password).pipe(
          map((user) => {
            if (user.status === 'success') {
              sessionStorage.setItem(this.system.storage.system.toast, 'true');
              sessionStorage.setItem(this.system.storage.system.currentUser, JSON.stringify(user.data));
              sessionStorage.setItem(this.system.storage.system.token, user.token);
              this.router.navigate([this.system.navigation.home]);
            }
            return loginSuccess({ user });
          }),
          catchError((error) => of(loginFailure({ error })), // Closing parenthesis added here
        ));
      } else if (this.system.environment.defaultauth === "firebase") {
        return of(); // Return an observable, even if it's empty
      } else {
        return of(); // Return an observable, even if it's empty
      }
    })
  )
);

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        // Perform any necessary cleanup or side effects before logging out
      }),
      exhaustMap(() => of(logoutSuccess()))
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private router: Router) { }

}
