import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * App Readiness Flags
 * 
 * Tracks when critical resources are loaded before showing the app.
 * Prevents white flash / layout shift / missing translations.
 * 
 * Usage:
 * ```typescript
 * // In service that loads i18n:
 * this.appReadiness.markReady('i18n');
 * 
 * // In app component:
 * this.appReadiness.isReady$.subscribe(ready => {
 *   if (ready) {
 *     // Hide splash, show app
 *   }
 * });
 * ```
 */
export interface AppReadinessFlags {
  /** Translation files loaded */
  i18n: boolean;
  /** App configuration loaded */
  config: boolean;
  /** User context loaded (if auth required) */
  user: boolean;
  /** Theme CSS loaded */
  theme: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppReadinessService {
  
  private flags = new BehaviorSubject<AppReadinessFlags>({
    i18n: false,
    config: false,
    user: false,    // Not required by default
    theme: false
  });
  
  /**
   * Configuration: which flags are required?
   * Set in app-config.json: splash.waitFor.*
   */
  private requiredFlags: (keyof AppReadinessFlags)[] = [
    'i18n',
    'config',
    'theme'
    // 'user' only required if auth is needed
  ];
  
  /**
   * Observable that emits true when app is ready to show
   */
  public isReady$: Observable<boolean> = this.flags.pipe(
    map(flags => this.checkReadiness(flags))
  );
  
  /**
   * Mark a specific flag as ready
   */
  public markReady(flag: keyof AppReadinessFlags): void {
    const current = this.flags.value;
    this.flags.next({
      ...current,
      [flag]: true
    });
    
    console.log(`[AppReadiness] ${flag} ready`, this.flags.value);
    
    // Check if all required flags are now true
    if (this.checkReadiness(this.flags.value)) {
      console.log('[AppReadiness] App is ready!', this.flags.value);
    }
  }
  
  /**
   * Mark a flag as NOT ready (for retries)
   */
  public markNotReady(flag: keyof AppReadinessFlags): void {
    const current = this.flags.value;
    this.flags.next({
      ...current,
      [flag]: false
    });
    
    console.log(`[AppReadiness] ${flag} NOT ready`, this.flags.value);
  }
  
  /**
   * Get current readiness state
   */
  public getCurrentState(): AppReadinessFlags {
    return this.flags.value;
  }
  
  /**
   * Check if all REQUIRED flags are true
   */
  private checkReadiness(flags: AppReadinessFlags): boolean {
    return this.requiredFlags.every(flag => flags[flag] === true);
  }
  
  /**
   * Update which flags are required
   * Called during app initialization based on app-config.json
   */
  public setRequiredFlags(flags: (keyof AppReadinessFlags)[]): void {
    this.requiredFlags = flags;
    console.log('[AppReadiness] Required flags set:', this.requiredFlags);
  }
  
  /**
   * Reset all flags (for testing/development)
   */
  public reset(): void {
    this.flags.next({
      i18n: false,
      config: false,
      user: false,
      theme: false
    });
  }
}
