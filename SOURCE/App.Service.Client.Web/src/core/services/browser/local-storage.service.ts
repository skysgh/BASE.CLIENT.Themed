import { Injectable, inject } from '@angular/core';
import { SystemDiagnosticsTraceService } from '../system.diagnostics-trace.service';

/**
 * LocalStorageService
 * 
 * Wrapper around browser's localStorage API.
 * 
 * WHY THIS EXISTS:
 * 1. Testability - Can mock in unit tests
 * 2. SSR Safety - Handles server-side rendering where localStorage doesn't exist
 * 3. Logging - Centralized logging of storage operations
 * 4. Error Handling - Graceful fallbacks when storage is full/disabled
 * 5. Type Safety - Generic methods for typed access
 * 6. Prefix Support - Namespace keys to avoid collisions
 * 
 * PERSISTENCE:
 * - localStorage persists across browser sessions
 * - Use for: user preferences, cached data, remember-me tokens
 * - Don't use for: sensitive tokens (use sessionStorage), large data
 * 
 * USAGE:
 * ```typescript
 * // Simple
 * this.localStorage.set('theme', 'dark');
 * const theme = this.localStorage.get('theme');
 * 
 * // Typed
 * this.localStorage.setObject('user', { id: 1, name: 'John' });
 * const user = this.localStorage.getObject<User>('user');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly prefix: string = 'app_';
  private readonly isAvailable: boolean;

  constructor(private diagnostics: SystemDiagnosticsTraceService) {
    this.isAvailable = this.checkAvailability();
    if (!this.isAvailable) {
      this.diagnostics.warn('LocalStorageService: localStorage is not available');
    }
  }

  // ============================================
  // Core Operations
  // ============================================

  /**
   * Get a string value from localStorage
   */
  get(key: string): string | null {
    if (!this.isAvailable) return null;
    
    try {
      return localStorage.getItem(this.prefixKey(key));
    } catch (error) {
      this.diagnostics.error(`LocalStorageService.get('${key}') failed: ${error}`);
      return null;
    }
  }

  /**
   * Set a string value in localStorage
   */
  set(key: string, value: string): boolean {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.setItem(this.prefixKey(key), value);
      this.diagnostics.debug(`LocalStorageService.set('${key}')`);
      return true;
    } catch (error) {
      this.diagnostics.error(`LocalStorageService.set('${key}') failed: ${error}`);
      return false;
    }
  }

  /**
   * Remove a value from localStorage
   */
  remove(key: string): boolean {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.removeItem(this.prefixKey(key));
      this.diagnostics.debug(`LocalStorageService.remove('${key}')`);
      return true;
    } catch (error) {
      this.diagnostics.error(`LocalStorageService.remove('${key}') failed: ${error}`);
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
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      this.diagnostics.debug(`LocalStorageService.clear() removed ${keysToRemove.length} items`);
      return true;
    } catch (error) {
      this.diagnostics.error(`LocalStorageService.clear() failed: ${error}`);
      return false;
    }
  }

  // ============================================
  // Typed Operations
  // ============================================

  /**
   * Get a typed object from localStorage
   */
  getObject<T>(key: string): T | null {
    const value = this.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      this.diagnostics.error(`LocalStorageService.getObject('${key}') parse failed: ${error}`);
      return null;
    }
  }

  /**
   * Set an object in localStorage (serializes to JSON)
   */
  setObject<T>(key: string, value: T): boolean {
    try {
      return this.set(key, JSON.stringify(value));
    } catch (error) {
      this.diagnostics.error(`LocalStorageService.setObject('${key}') serialize failed: ${error}`);
      return false;
    }
  }

  /**
   * Get a number from localStorage
   */
  getNumber(key: string): number | null {
    const value = this.get(key);
    if (value === null) return null;
    
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  /**
   * Get a boolean from localStorage
   */
  getBoolean(key: string): boolean | null {
    const value = this.get(key);
    if (value === null) return null;
    
    return value === 'true';
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
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
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
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
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
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
