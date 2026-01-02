import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * App Statistics Model
 * 
 * Statistics displayed on the signed-out landing page
 * to showcase the app's value proposition.
 */
export interface AppStats {
  /** Number of active user accounts */
  activeUsers: number;
  
  /** Number of countries where app is used */
  countriesServed: number;
  
  /** System uptime percentage */
  uptimePercent: number;
  
  /** Number of features available */
  featureCount: number;
  
  /** Current app version */
  currentVersion: string;
  
  /** Days until next planned update (optional) */
  daysUntilNextUpdate?: number;
  
  /** Days the platform has been running */
  daysRunning?: number;
  
  /** Total transactions processed (optional) */
  transactionsProcessed?: number;
}

/**
 * App Stats Service
 * 
 * Provides app statistics for display on public pages.
 * Currently returns mock data; can be connected to real API.
 * 
 * Usage:
 * ```typescript
 * this.appStatsService.getStats().subscribe(stats => {
 *   console.log(stats.activeUsers);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AppStatsService {
  
  /**
   * Get current app statistics
   * 
   * TODO: Connect to real API endpoint
   * GET /api/public/stats
   */
  getStats(): Observable<AppStats> {
    // Mock data for now - replace with HTTP call
    const mockStats: AppStats = {
      activeUsers: 12847,
      countriesServed: 42,
      uptimePercent: 99.9,
      featureCount: 156,
      currentVersion: '2.4.1',
      daysUntilNextUpdate: 14,
      daysRunning: 847,
      transactionsProcessed: 1234567
    };
    
    // Simulate network delay
    return of(mockStats).pipe(delay(300));
  }
  
  /**
   * Get simplified stats (fewer fields, faster load)
   */
  getQuickStats(): Observable<Partial<AppStats>> {
    return of({
      activeUsers: 12847,
      uptimePercent: 99.9,
      currentVersion: '2.4.1'
    }).pipe(delay(100));
  }
}
