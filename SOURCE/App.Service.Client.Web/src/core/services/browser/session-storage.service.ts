import { Injectable } from '@angular/core';
import { SystemDiagnosticsTraceService } from '../system.diagnostics-trace.service';

/**
 * SessionStorageService
 * 
 * Wrapper around browser's sessionStorage API.
 * 
 * WHY THIS EXISTS:
 * 1. Testability - Can mock in unit tests
 * 2. SSR Safety - Handles server-side rendering where sessionStorage doesn't exist
 * 3. Logging - Centralized logging of storage operations
 * 4. Error Handling - Graceful fallbacks when storage is full/disabled
 * 5. Type Safety - Generic methods for typed access
 * 6. Prefix Support - Namespace keys to avoid collisions
 * 
 * PERSISTENCE:
 * - sessionStorage clears when browser tab closes
 * - Use for: auth tokens, temporary state, form drafts
 * - Ideal for sensitive data that shouldn't persist
 * 
 * SECURITY:
 * - Prefer sessionStorage over localStorage for tokens
 * - Data cleared on tab close reduces exposure window
 * - Still vulnerable to XSS - use HttpOnly cookies for highest security
 * 
 * USAGE:
 * ```typescript
 * // Auth tokens
 * this.sessionStorage.set('access_token', token);
 * const token = this.sessionStorage.get('access_token');
 * 
 * // Typed objects
 * this.sessionStorage.setObject('session', { userId: 1, role: 'admin' });
 * const session = this.sessionStorage.getObject<Session>('session');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private readonly prefix: string = 'app_';
  private readonly isAvailable: boolean;

  constructor(private diagnostics: SystemDiagnosticsTraceService) {
    this.isAvailable = this.checkAvailability();
    if (!this.isAvailable) {
      this.diagnostics.warn('SessionStorageService: sessionStorage is not available');
    }
  }

  // ============================================
  // Core Operations
  // ============================================

  /**
   * Get a string value from sessionStorage
   */
  get(key: string): string | null {
    if (!this.isAvailable) return null;
    
    try {
      return sessionStorage.getItem(this.prefixKey(key));
    } catch (error) {
      this.diagnostics.error(`SessionStorageService.get('${key}') failed: ${error}`);
      return null;
    }
  }

  /**
   * Set a string value in sessionStorage
   */
  set(key: string, value: string): boolean {
    if (!this.isAvailable) return false;
    
    try {
      sessionStorage.setItem(this.prefixKey(key), value);
      this.diagnostics.debug(`SessionStorageService.set('${key}')`);
      return true;
    } catch (error) {
      this.diagnostics.error(`SessionStorageService.set('${key}') failed: ${error}`);
      return false;
    }
  }

  /**
   * Remove a value from sessionStorage
   */
  remove(key: string): boolean {
    if (!this.isAvailable) return false;
    
    try {
      sessionStorage.removeItem(this.prefixKey(key));
      this.diagnostics.debug(`SessionStorageService.remove('${key}')`);
      return true;
    } catch (error) {
      this.diagnostics.error(`SessionStorageService.remove('${key}') failed: ${error}`);
      return false;
    }
  }

  /**
   * Check if a key exists
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear all items with our prefix
   */
  clear(): boolean {
    if (!this.isAvailable) return false;
    
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      this.diagnostics.debug(`SessionStorageService.clear() removed ${keysToRemove.length} items`);
      return true;
    } catch (error) {
      this.diagnostics.error(`SessionStorageService.clear() failed: ${error}`);
      return false;
    }
  }

  /**
   * Clear ALL session storage (including non-prefixed legacy keys)
   * Use carefully - this clears everything in sessionStorage!
   */
  clearAll(): boolean {
    if (!this.isAvailable) return false;
    
    try {
      sessionStorage.clear();
      this.diagnostics.info('SessionStorageService.clearAll() - all session storage cleared');
      return true;
    } catch (error) {
      this.diagnostics.error(`SessionStorageService.clearAll() failed: ${error}`);
      return false;
    }
  }

  // ============================================
  // Typed Operations
  // ============================================

  /**
   * Get a typed object from sessionStorage
   */
  getObject<T>(key: string): T | null {
    const value = this.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      this.diagnostics.error(`SessionStorageService.getObject('${key}') parse failed: ${error}`);
      return null;
    }
  }

  /**
   * Set an object in sessionStorage (serializes to JSON)
   */
  setObject<T>(key: string, value: T): boolean {
    try {
      return this.set(key, JSON.stringify(value));
    } catch (error) {
      this.diagnostics.error(`SessionStorageService.setObject('${key}') serialize failed: ${error}`);
      return false;
    }
  }

  /**
   * Get a number from sessionStorage
   */
  getNumber(key: string): number | null {
    const value = this.get(key);
    if (value === null) return null;
    
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  /**
   * Get a boolean from sessionStorage
   */
  getBoolean(key: string): boolean | null {
    const value = this.get(key);
    if (value === null) return null;
    
    return value === 'true';
  }

  // ============================================
  // Auth-Specific Operations
  // ============================================

  /**
   * Storage keys used by auth system
   * Centralized here for consistent cleanup
   */
  static readonly AUTH_KEYS = {
    CURRENT_USER: 'currentUser',
    CURRENT_PERSON: 'currentPerson',
    TOKEN: 'token',
    TOAST: 'toast',
    OIDC_SESSION: 'oidc_session',
    OIDC_AUTH_STATE: 'oidc_auth_state'
  } as const;

  /**
   * Clear all auth-related session storage
   * Used during logout
   */
  clearAuthData(): void {
    this.diagnostics.info('SessionStorageService.clearAuthData() - clearing auth session data');
    
    // Clear our prefixed keys
    Object.values(SessionStorageService.AUTH_KEYS).forEach(key => {
      this.remove(key);
    });
    
    // Also clear legacy non-prefixed keys for backward compatibility
    try {
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentPerson');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('toast');
      sessionStorage.removeItem('oidc_session');
      sessionStorage.removeItem('oidc_auth_state');
    } catch (error) {
      this.diagnostics.warn(`Failed to clear legacy auth keys: ${error}`);
    }
  }

  // ============================================
  // Utility
  // ============================================

  /**
   * Get all keys (with prefix stripped)
   */
  keys(): string[] {
    if (!this.isAvailable) return [];
    
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    return keys;
  }

  /**
   * Get storage size in bytes (approximate)
   */
  getSize(): number {
    if (!this.isAvailable) return 0;
    
    let size = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const value = sessionStorage.getItem(key);
        if (value) {
          size += key.length + value.length;
        }
      }
    }
    return size * 2; // UTF-16 = 2 bytes per character
  }

  // ============================================
  // Private Helpers
  // ============================================

  private prefixKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private checkAvailability(): boolean {
    try {
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
