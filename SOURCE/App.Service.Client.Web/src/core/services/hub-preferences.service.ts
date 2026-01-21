/**
 * Hub Preferences Service
 * 
 * Persists and retrieves hub tile preferences (order, visibility).
 * Uses localStorage for persistence with optional server sync.
 * 
 * Features:
 * - Per-hub tile ordering and visibility
 * - Automatic localStorage persistence
 * - Observable-based API for reactive updates
 * - Optional merge with server-side preferences
 * 
 * Usage:
 * ```typescript
 * // Save preferences
 * hubPreferencesService.savePreferences('astronomy-hub', tiles);
 * 
 * // Load preferences
 * const prefs = hubPreferencesService.getPreferences('astronomy-hub');
 * 
 * // Apply to tiles
 * const orderedTiles = hubPreferencesService.applyPreferences('astronomy-hub', tiles);
 * ```
 */
import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LocalStorageService } from './browser/local-storage.service';
import { 
  IUniversalTile, 
  IHubTilePreferences, 
  ITilePreference,
  applyTilePreferences,
  extractTilePreferences 
} from '../models/presentation';

const STORAGE_KEY = 'hub_preferences';

/**
 * All hub preferences stored together
 */
interface HubPreferencesStore {
  [hubId: string]: IHubTilePreferences;
}

@Injectable({
  providedIn: 'root'
})
export class HubPreferencesService {
  private localStorage = inject(LocalStorageService);
  
  /** In-memory cache of all hub preferences */
  private store = signal<HubPreferencesStore>({});
  
  /** Subject for preference changes */
  private preferencesChanged$ = new BehaviorSubject<string | null>(null);

  constructor() {
    this.loadFromStorage();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Read Operations
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get preferences for a specific hub
   */
  getPreferences(hubId: string): IHubTilePreferences | null {
    return this.store()[hubId] ?? null;
  }

  /**
   * Get preferences as observable (emits on changes)
   */
  getPreferences$(hubId: string): Observable<IHubTilePreferences | null> {
    return this.preferencesChanged$.pipe(
      map(() => this.getPreferences(hubId))
    );
  }

  /**
   * Check if preferences exist for a hub
   */
  hasPreferences(hubId: string): boolean {
    return !!this.store()[hubId];
  }

  /**
   * Get all hub IDs that have stored preferences
   */
  getStoredHubIds(): string[] {
    return Object.keys(this.store());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Write Operations
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Save preferences for a hub
   */
  savePreferences(hubId: string, tiles: IUniversalTile[]): void {
    const preferences = extractTilePreferences(hubId, tiles);
    this.savePreferencesObject(preferences);
  }

  /**
   * Save preferences object directly
   */
  savePreferencesObject(preferences: IHubTilePreferences): void {
    const current = { ...this.store() };
    current[preferences.hubId] = preferences;
    this.store.set(current);
    this.persistToStorage();
    this.preferencesChanged$.next(preferences.hubId);
  }

  /**
   * Update a single tile's preference
   */
  updateTilePreference(
    hubId: string, 
    tileId: string, 
    updates: Partial<ITilePreference>
  ): void {
    const existing = this.getPreferences(hubId);
    if (!existing) return;
    
    const updatedTiles = existing.tiles.map(t => 
      t.id === tileId ? { ...t, ...updates } : t
    );
    
    this.savePreferencesObject({
      ...existing,
      tiles: updatedTiles,
      lastModified: new Date().toISOString(),
    });
  }

  /**
   * Clear preferences for a specific hub
   */
  clearPreferences(hubId: string): void {
    const current = { ...this.store() };
    delete current[hubId];
    this.store.set(current);
    this.persistToStorage();
    this.preferencesChanged$.next(hubId);
  }

  /**
   * Clear all hub preferences
   */
  clearAllPreferences(): void {
    this.store.set({});
    this.persistToStorage();
    this.preferencesChanged$.next(null);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Apply Operations
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Apply stored preferences to tiles, returning reordered tiles
   */
  applyPreferences(hubId: string, tiles: IUniversalTile[]): IUniversalTile[] {
    const preferences = this.getPreferences(hubId);
    return applyTilePreferences(tiles, preferences);
  }

  /**
   * Get visible tiles with preferences applied
   */
  getVisibleTiles(hubId: string, tiles: IUniversalTile[]): IUniversalTile[] {
    return this.applyPreferences(hubId, tiles).filter(t => t.config.visible);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Storage Operations
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Load preferences from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = this.localStorage.getObject<HubPreferencesStore>(STORAGE_KEY);
      if (stored) {
        this.store.set(stored);
      }
    } catch (error) {
      console.warn('[HubPreferencesService] Failed to load from storage:', error);
      this.store.set({});
    }
  }

  /**
   * Persist preferences to localStorage
   */
  private persistToStorage(): void {
    try {
      this.localStorage.setObject(STORAGE_KEY, this.store());
    } catch (error) {
      console.error('[HubPreferencesService] Failed to persist to storage:', error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Migration Helpers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Import preferences from external source (e.g., server sync)
   */
  importPreferences(preferences: IHubTilePreferences[], merge = true): void {
    const current = merge ? { ...this.store() } : {};
    
    for (const pref of preferences) {
      current[pref.hubId] = pref;
    }
    
    this.store.set(current);
    this.persistToStorage();
    this.preferencesChanged$.next(null);
  }

  /**
   * Export all preferences for backup/sync
   */
  exportPreferences(): IHubTilePreferences[] {
    return Object.values(this.store());
  }
}
