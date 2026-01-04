import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  ThemePreferences,
  DEFAULT_THEME_PREFERENCES,
  THEME_COLORS,
  ThemeColor,
  ThemeMode,
  SidebarColor,
  TopbarColor,
  LayoutType,
  SidebarSize
} from '../models';
import { AccountService } from '../../../core/services/account.service';

/**
 * ThemeService - Centralized Theme Management
 * 
 * Manages theme preferences with cascade:
 * 1. User preferences (localStorage) - highest priority
 * 2. Account preferences (AccountConfig) - account branding
 * 3. System defaults (DEFAULT_THEME_PREFERENCES) - fallback
 * 
 * Features:
 * - Persists user preferences to localStorage
 * - Applies CSS custom properties for runtime color changes
 * - Syncs with ngrx store for layout state
 * - Supports SSR (checks platform before localStorage access)
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme-preferences';
  
  private preferences$ = new BehaviorSubject<ThemePreferences>(DEFAULT_THEME_PREFERENCES);
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private accountService: AccountService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadPreferences();
  }

  /**
   * Get current theme preferences as observable
   */
  getPreferences(): Observable<ThemePreferences> {
    return this.preferences$.asObservable();
  }

  /**
   * Get current theme preferences synchronously
   */
  getCurrentPreferences(): ThemePreferences {
    return this.preferences$.value;
  }

  /**
   * Get available color palette
   */
  getColorPalette(): ThemeColor[] {
    return THEME_COLORS;
  }

  /**
   * Set primary color by ID
   */
  setPrimaryColor(colorId: string): void {
    const color = THEME_COLORS.find(c => c.id === colorId);
    if (!color) {
      console.warn(`[ThemeService] Unknown color ID: ${colorId}`);
      return;
    }

    this.updatePreferences({ primaryColorId: colorId });
    this.applyPrimaryColor(color);
  }

  /**
   * Set theme mode (light/dark)
   */
  setMode(mode: ThemeMode): void {
    this.updatePreferences({ mode });
    this.applyMode(mode);
    
    // When switching to dark mode, force sidebar and topbar to dark
    // This ensures visual consistency - light sidebar on dark body looks wrong
    if (mode === 'dark') {
      // Always set sidebar to dark when in dark mode
      this.updatePreferences({ sidebarColor: 'dark', topbarColor: 'dark' });
      this.applySidebarColor('dark');
      this.applyTopbarColor('dark');
    } else {
      // When switching to light mode, set both back to light
      this.updatePreferences({ sidebarColor: 'light', topbarColor: 'light' });
      this.applySidebarColor('light');
      this.applyTopbarColor('light');
    }
  }

  /**
   * Set sidebar color
   */
  setSidebarColor(color: SidebarColor): void {
    this.updatePreferences({ sidebarColor: color });
    this.applySidebarColor(color);
  }

  /**
   * Set topbar color
   */
  setTopbarColor(color: TopbarColor): void {
    this.updatePreferences({ topbarColor: color });
    this.applyTopbarColor(color);
  }

  /**
   * Set layout type
   */
  setLayout(layout: LayoutType): void {
    this.updatePreferences({ layout });
    this.applyLayout(layout);
  }

  /**
   * Set sidebar size
   */
  setSidebarSize(size: SidebarSize): void {
    this.updatePreferences({ sidebarSize: size });
    this.applySidebarSize(size);
  }

  /**
   * Reset to default preferences
   */
  resetToDefaults(): void {
    this.preferences$.next({ ...DEFAULT_THEME_PREFERENCES });
    this.savePreferences();
    this.applyAllPreferences();
  }

  /**
   * Apply all current preferences to DOM
   */
  applyAllPreferences(): void {
    const prefs = this.preferences$.value;
    
    const color = THEME_COLORS.find(c => c.id === prefs.primaryColorId);
    if (color) {
      this.applyPrimaryColor(color);
    }
    
    this.applyMode(prefs.mode);
    this.applySidebarColor(prefs.sidebarColor);
    this.applyTopbarColor(prefs.topbarColor);
    this.applyLayout(prefs.layout);
    this.applySidebarSize(prefs.sidebarSize);
  }

  // ========== Private Methods ==========

  private loadPreferences(): void {
    let prefs = { ...DEFAULT_THEME_PREFERENCES };
    
    // 1. Try to load from localStorage (user preferences)
    if (this.isBrowser) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          prefs = { ...prefs, ...parsed };
          console.log('[ThemeService] Loaded user preferences from localStorage');
        }
      } catch (e) {
        console.warn('[ThemeService] Failed to load preferences from localStorage:', e);
      }
    }
    
    // 2. Check account preferences (could override if no user prefs)
    // TODO: Integrate with AccountService.getConfigValue('theme.*')
    
    this.preferences$.next(prefs);
    
    // Apply preferences on load
    if (this.isBrowser) {
      // Delay to ensure DOM is ready
      setTimeout(() => this.applyAllPreferences(), 0);
    }
  }

  private updatePreferences(partial: Partial<ThemePreferences>): void {
    const current = this.preferences$.value;
    const updated = { ...current, ...partial };
    this.preferences$.next(updated);
    this.savePreferences();
  }

  private savePreferences(): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.preferences$.value));
      console.log('[ThemeService] Saved preferences to localStorage');
    } catch (e) {
      console.warn('[ThemeService] Failed to save preferences:', e);
    }
  }

  private applyPrimaryColor(color: ThemeColor): void {
    if (!this.isBrowser) return;
    
    const mode = this.preferences$.value.mode;
    const value = mode === 'dark' && color.darkValue ? color.darkValue : color.value;
    
    // Apply CSS custom property
    document.documentElement.style.setProperty('--vz-primary', value);
    document.documentElement.style.setProperty('--vz-primary-rgb', this.hexToRgb(value));
    
    console.log(`[ThemeService] Applied primary color: ${color.name} (${value})`);
  }

  private applyMode(mode: ThemeMode): void {
    if (!this.isBrowser) return;
    document.documentElement.setAttribute('data-bs-theme', mode);
  }

  private applySidebarColor(color: SidebarColor): void {
    if (!this.isBrowser) return;
    document.documentElement.setAttribute('data-sidebar', color);
  }

  private applyTopbarColor(color: TopbarColor): void {
    if (!this.isBrowser) return;
    document.documentElement.setAttribute('data-topbar', color);
  }

  private applyLayout(layout: LayoutType): void {
    if (!this.isBrowser) return;
    document.documentElement.setAttribute('data-layout', layout);
  }

  private applySidebarSize(size: SidebarSize): void {
    if (!this.isBrowser) return;
    document.documentElement.setAttribute('data-sidebar-size', size);
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '64, 81, 137'; // Default blue RGB
    
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }
}
