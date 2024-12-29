// Ag:
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// Misc:
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// Services:
import { AuthenticationService } from '../../core/services/auth.service';
import { SystemDiagnosticsTraceService } from '../../core/services/system.diagnostics-trace.service';

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
    private systemDiagnosticsTraceService: SystemDiagnosticsTraceService,
    private authenticationService: AuthenticationService) { }

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
      const error = err.error.message || err.statusText;

      return throwError(error);
    }))
  }
  private handle401Error(): void {
    // auto logout if 401 response returned from api
    this.authenticationService.logout();

    // Reload page to refresh the app:
    location.reload();

  }
}

