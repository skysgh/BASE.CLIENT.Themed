// Ag:
import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// Misc:
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// Services:
import { AuthenticationService } from '../../core/services/auth.service';

/**
 *Injector that listens to Http requests
 * and handles errors. 
 * Specifically listening for remote service
 * that return "401 Unauthorized Error"
 * so as to log current user out.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  /**
   * Constructor
   * @param authenticationService
   */
  constructor(
    private injector: Injector
      //private authenticationService: AuthenticationService
  ) { }

    /**
     * Intercepts requests.
     * 
     * @param request
     * @param next
     * @returns
     */
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.handle401Error();
      }
      
      // Better error extraction that handles all cases
      const error = err?.error?.message || err?.message || err?.statusText || String(err) || 'Unknown error';
      
      // Log the full error for debugging
      console.error('HTTP Error:', {
        url: request.url,
        status: err?.status,
        statusText: err?.statusText,
        message: err?.message,
        error: err
      });

      return throwError(() => error);
    }))
  }
  private handle401Error(): void {
    // auto logout if 401 response returned from api
    var authenticationService = this.injector.get(AuthenticationService);
    //this.
    authenticationService.logout();

    // Reload page to refresh the app:
    location.reload();

  }
}

