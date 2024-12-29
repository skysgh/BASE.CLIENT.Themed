// Rx:
import { Observable } from 'rxjs';
// Ag:
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';


// Context:
import { environment } from '../../environments/environment';
// Services:
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';


/**
 * Interceptor that sets
 * the bearer token to the
 * current user's token
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  /**
   * Constructor
   * @param authenticationService
   * @param authfackservice
   */
  constructor(
        private authenticationService: AuthenticationService,
        private authfakeAuthenticationService: AuthfakeauthenticationService
    ) { }

    /**
     * Intercept calls
     * 
     * @param request
     * @param next
     * @returns
     */
    public intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (environment.defaultauth === 'firebase') {
            // add authorization header with jwt token if available
            let currentUser = this.authenticationService.currentUser();
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                });
            }
        } else {
            // add authorization header with jwt token if available
          const currentUser = this.authfakeAuthenticationService.currentUserValue;
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                });
            }
        }
        return next.handle(request);
    }
}
