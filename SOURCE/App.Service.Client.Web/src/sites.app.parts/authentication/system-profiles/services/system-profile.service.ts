import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { SystemProfileDto, UpdateSystemProfileDto } from '../models/system-profile.dto';
import { SystemProfileViewModel } from '../models/system-profile.view-model';
import { SystemProfileMapper } from '../mappers/system-profile.mapper';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

/**
 * System Profile Service
 * 
 * Manages the current user's system-wide profile.
 * Applies settings like theme, language, accessibility options.
 */
@Injectable({ providedIn: 'root' })
export class SystemProfileService {
  
  // State signals
  private _profile = signal<SystemProfileViewModel | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly signals
  readonly profile = this._profile.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  private readonly apiUrl = '/api/authentication/system-profile';
  
  constructor(
    private http: HttpClient,
    private diagnostics: SystemDiagnosticsTraceService
  ) {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
    
    // Effect: Apply theme changes to document
    effect(() => {
      const p = this._profile();
      if (p) {
        this.applyTheme(p.effectiveTheme);
        this.applyAccessibility(p);
      }
    });
  }
  
  /**
   * Load current user's system profile
   */
  loadProfile(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.http.get<SystemProfileDto>(this.apiUrl).pipe(
      map(dto => SystemProfileMapper.toViewModel(dto)),
      tap(profile => {
        this._profile.set(profile);
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set('Failed to load profile');
        this._loading.set(false);
        // Return default profile
        return of(this.getDefaultProfile());
      })
    ).subscribe(profile => {
      if (!this._profile()) {
        this._profile.set(profile);
      }
    });
  }
  
  /**
   * Update system profile
   */
  updateProfile(data: UpdateSystemProfileDto): Observable<SystemProfileViewModel | null> {
    return this.http.patch<SystemProfileDto>(this.apiUrl, data).pipe(
      map(dto => SystemProfileMapper.toViewModel(dto)),
      tap(profile => {
        if (profile) {
          this._profile.set(profile);
        }
      }),
      catchError(err => {
        this._error.set('Failed to update profile');
        return of(null);
      })
    );
  }
  
  /**
   * Quick setters for common preferences
   */
  setTheme(theme: 'light' | 'dark' | 'system'): Observable<boolean> {
    return this.updateProfile({ theme }).pipe(map(p => p !== null));
  }
  
  setLanguage(languageCode: string): Observable<boolean> {
    return this.updateProfile({ languageCode }).pipe(map(p => p !== null));
  }
  
  setDefaultAccount(accountId: string | null): Observable<boolean> {
    return this.updateProfile({ defaultAccountId: accountId }).pipe(map(p => p !== null));
  }
  
  /**
   * Apply theme to document
   */
  private applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-bs-theme', theme);
      document.documentElement.setAttribute('data-layout-mode', theme);
    }
  }
  
  /**
   * Apply accessibility settings
   */
  private applyAccessibility(profile: SystemProfileViewModel): void {
    if (typeof document === 'undefined') return;
    
    const html = document.documentElement;
    
    // Reduce motion
    if (profile.reduceMotion) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }
    
    // High contrast
    if (profile.highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    
    // Font size
    html.classList.remove('fs-sm', 'fs-base', 'fs-lg', 'fs-xl');
    html.classList.add(profile.fontSizeClass);
  }
  
  /**
   * Get default profile for fallback
   */
  private getDefaultProfile(): SystemProfileViewModel {
    return {
      id: '',
      userId: '',
      theme: 'system',
      languageCode: 'en',
      locale: 'en-US',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      reduceMotion: false,
      highContrast: false,
      fontSize: 'medium',
      defaultAccountId: null,
      lastAccessedAccountId: null,
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      effectiveTheme: 'light',
      fontSizeClass: 'fs-base'
    };
  }
}
