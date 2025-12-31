// Rx:
import { Observable, tap } from 'rxjs';
// Ag:
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
// Services:
import { SystemDiagnosticsTraceService } from '../../core/services/system.diagnostics-trace.service';
import { SystemDefaultServices } from '../../core/services/system.default-services.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  /**
   * 
   * @param systemDiagnosticsTraceService
   */
  constructor(private defaultServices: SystemDefaultServices) {
  }

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.defaultServices.diagnosticsTraceService.info(`HTTP Request: ${req.method} ${req.urlWithParams}`);
    this.defaultServices.diagnosticsTraceService.info(`Request Body ${req.body}`);

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            this.defaultServices.diagnosticsTraceService.info(`HTTP Response: ${event.status} ${event.url}`);
            this.defaultServices.diagnosticsTraceService.info(`Response Body: ${event.body}`);
          }
        },
        error: (error: any) => {
          let errorMessage = 'Unknown HTTP error';
          try {
            errorMessage = error?.message || String(error) || errorMessage;
          } catch {
            // Fallback already set
          }
          this.defaultServices.diagnosticsTraceService.error(errorMessage);
        },
      })
    );
  }
}
