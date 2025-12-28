import { Injectable } from '@angular/core';
import { Observable, timer, BehaviorSubject } from 'rxjs';
import { switchMap, shareReplay, tap } from 'rxjs/operators';

import { RepositoryService } from './repository.service';
import { SystemDiagnosticsTraceService } from '../../services/system.diagnostics-trace.service';

/**
 * Live Repository Service - Auto-Updating Data Pattern
 * 
 * Extends RepositoryService to add automatic polling/refresh capabilities.
 * Use this when you need data to stay synchronized with backend changes.
 * 
 * **When to Use:**
 * - Real-time dashboards
 * - Notification systems
 * - Live status monitors
 * - Data that changes frequently on server
 * 
 * **When NOT to Use:**
 * - Static reference data
 * - User-initiated CRUD operations
 * - One-time data fetches
 * - Performance-critical scenarios
 * 
 * **Pattern Benefits:**
 * - Automatic synchronization with backend
 * - Multiple subscribers share same polling
 * - Easy to start/stop polling
 * - No manual subscription management needed
 * 
 * **Usage:**
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class NotificationRepository extends LiveRepositoryService<NotificationDto> {
 *   constructor(http: HttpClient, logger: SystemDiagnosticsTraceService) {
 *     super(http, '/api/notifications', logger, 30); // Poll every 30 seconds
 *   }
 * }
 * 
 * // In component:
 * notifications$ = this.notificationRepo.live$; // Auto-updates!
 * ```
 */
export abstract class LiveRepositoryService<TDto> extends RepositoryService<TDto> {
  
  /**
   * Live observable that auto-updates via polling
   * Multiple subscribers share the same poll stream
   */
  public readonly live$: Observable<TDto[]>;
  
  /**
   * Manual refresh trigger
   */
  private refreshSubject = new BehaviorSubject<void>(undefined);
  
  /**
   * Polling enabled flag
   */
  private _pollingEnabled = true;
  
  constructor(
    http: any,
    baseUrl: string,
    logger: SystemDiagnosticsTraceService,
    /**
     * Polling interval in seconds (0 = disabled)
     */
    private pollIntervalSeconds: number = 0,
    errorService?: any
  ) {
    super(http, baseUrl, logger, errorService);
    
    // Setup live observable with optional polling
    this.live$ = this.setupLiveObservable();
    
    this.logger.debug(`${this.constructor.name} live polling: ${pollIntervalSeconds}s`);
  }
  
  /**
   * Setup the live observable with polling
   */
  private setupLiveObservable(): Observable<TDto[]> {
    if (this.pollIntervalSeconds <= 0) {
      // No polling - just return manual refresh stream
      return this.refreshSubject.pipe(
        switchMap(() => this.getAll()),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    
    // Polling enabled - merge timer with manual refresh
    return timer(0, this.pollIntervalSeconds * 1000).pipe(
      switchMap(() => {
        if (!this._pollingEnabled) {
          // Polling paused - just return empty or cached
          return this.getAll();
        }
        return this.getAll();
      }),
      tap(() => {
        this.logger.debug(`${this.constructor.name} polled data`);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
  
  /**
   * Manually trigger a refresh (in addition to automatic polling)
   */
  public refresh(): void {
    this.logger.debug(`${this.constructor.name}.refresh() - manual trigger`);
    this.refreshSubject.next();
  }
  
  /**
   * Pause automatic polling (manual refresh still works)
   */
  public pausePolling(): void {
    this.logger.debug(`${this.constructor.name}.pausePolling()`);
    this._pollingEnabled = false;
  }
  
  /**
   * Resume automatic polling
   */
  public resumePolling(): void {
    this.logger.debug(`${this.constructor.name}.resumePolling()`);
    this._pollingEnabled = true;
    this.refresh(); // Trigger immediate refresh
  }
  
  /**
   * Check if polling is currently enabled
   */
  public get isPollingEnabled(): boolean {
    return this._pollingEnabled && this.pollIntervalSeconds > 0;
  }
}
