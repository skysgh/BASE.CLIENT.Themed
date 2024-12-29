// Rx:
import { Observable, tap } from 'rxjs';
// Ag:
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
// Services:
import { SystemDiagnosticsTraceService } from '../../core/services/system.diagnostics-trace.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  /**
   * 
   * @param systemDiagnosticsTraceService
   */
  constructor(private systemDiagnosticsTraceService: SystemDiagnosticsTraceService) {
  }

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.systemDiagnosticsTraceService.info(`HTTP Request: ${req.method} ${req.urlWithParams}`);
    this.systemDiagnosticsTraceService.info(`Request Body ${req.body}`);

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            this.systemDiagnosticsTraceService.info(`HTTP Response: ${event.status} ${event.url}`);
            this.systemDiagnosticsTraceService.info(`Response Body: ${event.body}`);
          }
        },
        error: (error: Error) => {
          this.systemDiagnosticsTraceService.error(`${error.message}`);
        },
      })
    );
  }
}
