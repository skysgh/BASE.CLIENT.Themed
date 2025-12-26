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
import { EnvConfigService } from '../../../../core/services/env-config.service';
// Actions:
import { login, loginSuccess, loginFailure, logout, logoutSuccess, Register } from './authentication.actions';
// Configuration:
// ✅ FIXED: Use theme-tier configuration (not app-tier)
// Effects are in themes/t1/_state, so use theme config
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';

/**
 * Authentication Effects (NgRx)
 * 
 * ✅ REFACTORED: Tier Independence
 * - Uses themesT1Configuration (not appsConfiguration)
 * - Uses EnvConfigService for runtime-overridable settings
 * - No hard-coded redirect destinations
 */
@Injectable()
export class AuthenticationEffects {

  constructor(
    @Inject(Actions) private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private router: Router,
    private envConfig: EnvConfigService  // ✅ NEW: For runtime config overrides
  ) {
  }

  /**
   * ✅ NEW: Get post-login redirect destination
   * 
   * Priority:
   * 1. Runtime config (from config.json via EnvConfigService)
   * 2. Theme default (from themesT1Configuration)
   */
  private getPostLoginRedirect(): string {
    try {
      const runtimeConfig = this.envConfig.get();
      if (runtimeConfig.postLoginRedirect) {
        return runtimeConfig.postLoginRedirect;
      }
    } catch (error) {
      console.warn('[AuthenticationEffects] EnvConfig not available, using theme default');
    }
    
    return themesT1Configuration.postLoginRedirect;
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
            // TODO: Make login path configurable as well
            this.router.navigate(['/auth/signin/basic']);

            return loginSuccess({ user });
          }),
          catchError((error) => of(loginFailure({ error })))
        )

      )
    )
  );

  /**
   * Login Effect
   * 
   * ✅ FIXED: Uses configured redirect destination (not hard-coded)
   */
  login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(login),
    exhaustMap(({ email, password }) => {
      // TODO: Get auth type from theme config instead of hard-coding
      const authType = "fakebackend"; // themesT1Configuration.constants.environment.defaultauth
      
      if (authType === "fakebackend") {
        return this.AuthenticationService.login(email, password).pipe(
          map((user) => {
            if (user.status === 'success') {
              // Store user details and jwt token in local storage to keep user logged in between page refreshes:
              // TODO: Use theme config for storage keys
              sessionStorage.setItem('toast', 'true');
              sessionStorage.setItem('currentUser', JSON.stringify(user.data));
              sessionStorage.setItem('token', user.token);
              
              // ✅ FIXED: Navigate to configured destination (not hard-coded)
              const redirectTo = this.getPostLoginRedirect();
              this.router.navigate([redirectTo]);
            }
            return loginSuccess({ user });
          }),
          catchError((error) => of(loginFailure({ error })))
        );
      } else if (authType === "firebase") {
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
