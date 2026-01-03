/**
 * Cookie Consent Service
 * 
 * Manages user cookie consent preferences with:
 * - Persistent storage (localStorage + cookie)
 * - Reactive state (signals)
 * - GDPR-compliant category management
 * - Event emission for tracking integration
 * 
 * Usage:
 * ```typescript
 * // Check if consent given
 * if (!cookieConsentService.hasConsent()) {
 *   // Show banner
 * }
 * 
 * // Check specific category
 * if (cookieConsentService.isCategoryEnabled('analytics')) {
 *   // Initialize analytics
 * }
 * 
 * // Save preferences
 * cookieConsentService.savePreferences({
 *   necessary: true,
 *   functional: true,
 *   analytics: false,
 *   marketing: false
 * });
 * ```
 */
import { Injectable, signal, computed, inject } from '@angular/core';
import { 
  CookieConsentPreferences, 
  CookieConsentState, 
  CookieCategory,
  CookieCategoryConfig,
  DEFAULT_COOKIE_CATEGORIES,
  DEFAULT_CONSENT_PREFERENCES,
  createInitialConsentState,
  createAcceptAllPreferences,
  createNecessaryOnlyPreferences
} from '../models/cookie-consent.model';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

const CONSENT_STORAGE_KEY = 'cookie_consent';
const CONSENT_COOKIE_NAME = 'cookie_consent_given';
const CONSENT_VERSION = '1.0';

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private diagnostics = inject(SystemDiagnosticsTraceService);

  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────
  
  private _state = signal<CookieConsentState>(createInitialConsentState());
  private _showBanner = signal(false);
  private _showPreferences = signal(false);

  // Public readonly signals
  readonly state = this._state.asReadonly();
  readonly showBanner = this._showBanner.asReadonly();
  readonly showPreferences = this._showPreferences.asReadonly();

  // Computed
  readonly preferences = computed(() => this._state().preferences);
  readonly hasConsent = computed(() => this._state().preferences.consentGiven);
  readonly categories = signal<CookieCategoryConfig[]>(DEFAULT_COOKIE_CATEGORIES);

  // Category-specific computed
  readonly functionalEnabled = computed(() => this.preferences().categories.functional);
  readonly analyticsEnabled = computed(() => this.preferences().categories.analytics);
  readonly marketingEnabled = computed(() => this.preferences().categories.marketing);

  constructor() {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
    this.loadFromStorage();
    this.checkInitialState();
  }

  // ─────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────

  /**
   * Check if a specific category is enabled
   */
  isCategoryEnabled(category: CookieCategory): boolean {
    const prefs = this._state().preferences;
    return prefs.categories[category] ?? false;
  }

  /**
   * Check if consent has been given
   */
  consentGiven(): boolean {
    return this._state().preferences.consentGiven;
  }

  /**
   * Accept all cookies
   */
  acceptAll(): void {
    this.diagnostics.debug(`${this.constructor.name}.acceptAll()`);
    const preferences = createAcceptAllPreferences();
    this.updatePreferences(preferences);
    this.hideBanner();
    this.hidePreferencesModal();
    this.emitConsentChange(preferences);
  }

  /**
   * Accept only necessary cookies
   */
  acceptNecessaryOnly(): void {
    this.diagnostics.debug(`${this.constructor.name}.acceptNecessaryOnly()`);
    const preferences = createNecessaryOnlyPreferences();
    this.updatePreferences(preferences);
    this.hideBanner();
    this.hidePreferencesModal();
    this.emitConsentChange(preferences);
  }

  /**
   * Save custom preferences
   */
  savePreferences(categories: Partial<CookieConsentPreferences['categories']>): void {
    this.diagnostics.debug(`${this.constructor.name}.savePreferences(): ${JSON.stringify(categories)}`);
    
    const preferences: CookieConsentPreferences = {
      consentGiven: true,
      consentDate: new Date().toISOString(),
      consentVersion: CONSENT_VERSION,
      categories: {
        necessary: true, // Always true
        functional: categories.functional ?? false,
        analytics: categories.analytics ?? false,
        marketing: categories.marketing ?? false
      }
    };
    
    this.updatePreferences(preferences);
    this.hideBanner();
    this.hidePreferencesModal();
    this.emitConsentChange(preferences);
  }

  /**
   * Revoke consent and reset to defaults
   */
  revokeConsent(): void {
    this.diagnostics.debug(`${this.constructor.name}.revokeConsent()`);
    const state = createInitialConsentState();
    this._state.set(state);
    this.clearStorage();
    this.emitConsentChange(state.preferences);
  }

  /**
   * Show the cookie banner
   */
  showBannerPrompt(): void {
    this._showBanner.set(true);
  }

  /**
   * Hide the cookie banner
   */
  hideBanner(): void {
    this._showBanner.set(false);
  }

  /**
   * Show the preferences modal
   */
  showPreferencesModal(): void {
    this._showPreferences.set(true);
  }

  /**
   * Hide the preferences modal
   */
  hidePreferencesModal(): void {
    this._showPreferences.set(false);
  }

  /**
   * Open preferences from banner
   */
  openPreferencesFromBanner(): void {
    this.hideBanner();
    this.showPreferencesModal();
  }

  // ─────────────────────────────────────────────────────────────
  // Storage
  // ─────────────────────────────────────────────────────────────

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const state: CookieConsentState = JSON.parse(stored);
        
        // Check if expired
        if (new Date(state.expiresAt) > new Date()) {
          this._state.set(state);
          this.diagnostics.debug(`${this.constructor.name}: Loaded consent from storage`);
        } else {
          this.diagnostics.debug(`${this.constructor.name}: Stored consent expired`);
          this.clearStorage();
        }
      }
    } catch (error) {
      this.diagnostics.warn(`${this.constructor.name}: Failed to load consent from storage: ${error}`);
    }
  }

  private saveToStorage(state: CookieConsentState): void {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
      
      // Also set a simple cookie for server-side detection
      const expiresDate = new Date(state.expiresAt);
      document.cookie = `${CONSENT_COOKIE_NAME}=1; expires=${expiresDate.toUTCString()}; path=/; SameSite=Lax`;
      
      this.diagnostics.debug(`${this.constructor.name}: Saved consent to storage`);
    } catch (error) {
      this.diagnostics.warn(`${this.constructor.name}: Failed to save consent: ${error}`);
    }
  }

  private clearStorage(): void {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      document.cookie = `${CONSENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } catch (error) {
      this.diagnostics.warn(`${this.constructor.name}: Failed to clear consent storage: ${error}`);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Private Helpers
  // ─────────────────────────────────────────────────────────────

  private updatePreferences(preferences: CookieConsentPreferences): void {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    
    const state: CookieConsentState = {
      preferences,
      updatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };
    
    this._state.set(state);
    this.saveToStorage(state);
  }

  private checkInitialState(): void {
    // If no consent given yet, show banner after a short delay
    if (!this._state().preferences.consentGiven) {
      setTimeout(() => {
        if (!this._state().preferences.consentGiven) {
          this._showBanner.set(true);
        }
      }, 1000); // Delay to allow page to render
    }
  }

  private emitConsentChange(preferences: CookieConsentPreferences): void {
    // Emit custom event for integrations (e.g., Google Analytics)
    const event = new CustomEvent('cookieConsentChange', {
      detail: {
        preferences,
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
    
    this.diagnostics.debug(`${this.constructor.name}: Emitted consent change event`);
  }
}
