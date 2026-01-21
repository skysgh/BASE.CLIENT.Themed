/**
 * Hub Settings Service
 * 
 * Manages Hub view settings across three tiers:
 * - Service: Platform-wide defaults (sysadmin only)
 * - Account: Organization overrides (account admin)
 * - User: Personal preferences (any authenticated user)
 * 
 * Demo Mode:
 * - Service/Account: Loaded from bootstrap files, saved to json-server
 * - User: Saved to localStorage (persists across refresh)
 * 
 * Production Mode:
 * - All tiers: API calls to backend
 * 
 * API Endpoints (Production):
 * - GET/PUT /api/base_system_HubSettings/service
 * - GET/PUT /api/base_system_HubSettings/account/{accountId}
 * - GET/PUT /api/base_system_HubSettings/user/{userId}
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { HubViewSettings, TieredHubViewSettings, DEFAULT_HUB_VIEW_SETTINGS, mergeHubViewSettings } from '../models';
import { AccountService } from '../../../core/services/account.service';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { environment } from '../../../environments/environment';

/** Storage keys for demo mode */
const STORAGE_KEYS = {
  user: 'base.hub.userViewSettings',
  account: 'base.hub.accountViewSettings',
  service: 'base.hub.serviceViewSettings',
};

/** API endpoints */
const API_ENDPOINTS = {
  service: '/api/base_system_HubSettings_Service',
  account: (id: string) => `/api/base_system_HubSettings_Account/${id}`,
  user: (id: string) => `/api/base_system_HubSettings_User/${id}`,
};

@Injectable({ providedIn: 'root' })
export class HubSettingsService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private logger = inject(SystemDiagnosticsTraceService);

  // ─────────────────────────────────────────────────────────────
  // Load Settings
  // ─────────────────────────────────────────────────────────────

  /**
   * Load all tiered settings and return merged result
   */
  loadAllSettings(): Observable<TieredHubViewSettings> {
    const accountId = this.accountService.getAccountId() || 'default';
    const userId = this.getCurrentUserId();

    return forkJoin({
      service: this.loadServiceSettings(),
      account: this.loadAccountSettings(accountId),
      user: this.loadUserSettings(userId),
    }).pipe(
      tap(settings => {
        this.logger.debug('[HubSettingsService] Loaded all tiered settings');
      })
    );
  }

  /**
   * Load service-level settings (platform defaults)
   */
  loadServiceSettings(): Observable<HubViewSettings> {
    // Try API first
    return this.http.get<HubViewSettings>(API_ENDPOINTS.service).pipe(
      tap(() => this.logger.debug('[HubSettingsService] Loaded service settings from API')),
      catchError(() => {
        // Fallback to bootstrap file data (already loaded by AccountService)
        const accountConfig = this.accountService.getCurrentConfig();
        const bootstrapSettings = (accountConfig as any)?.hub?.viewSettings;
        
        if (bootstrapSettings) {
          this.logger.debug('[HubSettingsService] Using service settings from bootstrap');
          return of(bootstrapSettings as HubViewSettings);
        }
        
        // Final fallback to defaults
        this.logger.debug('[HubSettingsService] Using default service settings');
        return of(DEFAULT_HUB_VIEW_SETTINGS);
      })
    );
  }

  /**
   * Load account-level settings (organization overrides)
   */
  loadAccountSettings(accountId: string): Observable<Partial<HubViewSettings> | undefined> {
    return this.http.get<HubViewSettings>(API_ENDPOINTS.account(accountId)).pipe(
      tap(() => this.logger.debug(`[HubSettingsService] Loaded account settings from API: ${accountId}`)),
      catchError(() => {
        // Fallback to bootstrap account data
        const accountConfig = this.accountService.getCurrentConfig();
        const bootstrapSettings = (accountConfig as any)?.hub?.viewSettings;
        
        if (bootstrapSettings) {
          this.logger.debug('[HubSettingsService] Using account settings from bootstrap');
          return of(bootstrapSettings as Partial<HubViewSettings>);
        }
        
        return of(undefined);
      })
    );
  }

  /**
   * Load user-level settings (personal preferences)
   */
  loadUserSettings(userId: string): Observable<Partial<HubViewSettings> | undefined> {
    // Try API first
    return this.http.get<HubViewSettings>(API_ENDPOINTS.user(userId)).pipe(
      tap(() => this.logger.debug(`[HubSettingsService] Loaded user settings from API: ${userId}`)),
      catchError(() => {
        // Fallback to localStorage (demo mode)
        const stored = localStorage.getItem(STORAGE_KEYS.user);
        if (stored) {
          try {
            const settings = JSON.parse(stored);
            this.logger.debug('[HubSettingsService] Loaded user settings from localStorage');
            return of(settings as Partial<HubViewSettings>);
          } catch (e) {
            this.logger.warn('[HubSettingsService] Failed to parse localStorage user settings');
          }
        }
        return of(undefined);
      })
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Save Settings
  // ─────────────────────────────────────────────────────────────

  /**
   * Save service-level settings (sysadmin only)
   */
  saveServiceSettings(settings: HubViewSettings): Observable<HubViewSettings> {
    return this.http.put<HubViewSettings>(API_ENDPOINTS.service, settings).pipe(
      tap(() => this.logger.debug('[HubSettingsService] Saved service settings to API')),
      catchError(error => {
        // Demo mode: Save to localStorage as fallback
        this.logger.debug('[HubSettingsService] API unavailable, saving service settings to localStorage');
        localStorage.setItem(STORAGE_KEYS.service, JSON.stringify(settings));
        return of(settings);
      })
    );
  }

  /**
   * Save account-level settings (account admin only)
   */
  saveAccountSettings(accountId: string, settings: Partial<HubViewSettings>): Observable<Partial<HubViewSettings>> {
    return this.http.put<Partial<HubViewSettings>>(API_ENDPOINTS.account(accountId), settings).pipe(
      tap(() => this.logger.debug(`[HubSettingsService] Saved account settings to API: ${accountId}`)),
      catchError(error => {
        // Demo mode: Save to localStorage as fallback
        this.logger.debug('[HubSettingsService] API unavailable, saving account settings to localStorage');
        localStorage.setItem(STORAGE_KEYS.account, JSON.stringify(settings));
        return of(settings);
      })
    );
  }

  /**
   * Save user-level settings (any authenticated user)
   */
  saveUserSettings(userId: string, settings: Partial<HubViewSettings>): Observable<Partial<HubViewSettings>> {
    // Always save to localStorage for demo mode persistence
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(settings));
    this.logger.debug('[HubSettingsService] Saved user settings to localStorage');

    // Also try API (will succeed in production, fail silently in demo)
    return this.http.put<Partial<HubViewSettings>>(API_ENDPOINTS.user(userId), settings).pipe(
      tap(() => this.logger.debug(`[HubSettingsService] Saved user settings to API: ${userId}`)),
      catchError(() => {
        // API failed but localStorage succeeded - that's fine for demo mode
        return of(settings);
      })
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────

  /**
   * Get current user ID (from auth service in production)
   */
  private getCurrentUserId(): string {
    // TODO: Get from actual auth service
    return 'current-user';
  }

  /**
   * Clear all cached settings (for logout/testing)
   */
  clearCache(): void {
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.account);
    localStorage.removeItem(STORAGE_KEYS.service);
    this.logger.debug('[HubSettingsService] Cleared all cached settings');
  }
}
