import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, timer } from 'rxjs';
import { catchError, finalize, shareReplay, timeout, scan, mergeMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SystemDiagnosticsTraceService } from '../system.diagnostics-trace.service';

@Injectable({
  providedIn: 'root',
})
export class JsonDataService {
  private cache: { [key: string]: Observable<any> } = {};
  private timestamps: { [key: string]: number } = {};
  private errorNotifier = new Subject<string>();

  private config = {
    retryInterval: 30 * 1000,
    requestTimeout: 10 * 1000,
    maxRetries: 3,
    backoffMultiplier: 2,
    initialBackoff: 1000,
  };

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService
  ) { }

  updateConfig(newConfig: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...newConfig };
  }

  private retryWithBackoff(error: any): Observable<any> {
    return timer(0, this.config.initialBackoff).pipe(
      scan((retryCount, _) => {
        if (retryCount >= this.config.maxRetries) {
          throw error; // Stop retrying after max retries
        }
        return retryCount + 1;
      }, 0),
      mergeMap((retryCount) => {
        const delayTime = Math.pow(this.config.backoffMultiplier, retryCount) * this.config.initialBackoff;
        return timer(delayTime); // Wait for the calculated delay
      })
    );
  }

  /**
   * Get the JSON from the fileUrl and cache it.
   * @param fileUrl
   * @returns
   */
  getJson(fileUrl: string): Observable<any> {
    const now = Date.now();

    if (this.cache[fileUrl]
      && this.timestamps[fileUrl]
      && now - this.timestamps[fileUrl] < this.config.retryInterval) {

      return this.cache[fileUrl];
    }

    this.timestamps[fileUrl] = now;

    this.cache[fileUrl] = this.http.get(fileUrl).pipe(
      timeout(this.config.requestTimeout),
      shareReplay(1),
      catchError((error: any) => {
        this.diagnosticsTraceService.error(`Error fetching ${fileUrl}: ${error.message}`);
        delete this.cache[fileUrl];
        delete this.timestamps[fileUrl];
        const errorMessage = this.translate.instant('BASE.ERRORS.JSON_FETCH_FAILED', { url: fileUrl });
        this.errorNotifier.next(errorMessage);
        return this.retryWithBackoff(error);
      }),
      finalize(() => {
        if (!this.cache[fileUrl]) {
          delete this.timestamps[fileUrl];
        }
      })
    );

    return this.cache[fileUrl];
  }

  getErrorNotifier(): Observable<string> {
    return this.errorNotifier.asObservable();
  }
}
