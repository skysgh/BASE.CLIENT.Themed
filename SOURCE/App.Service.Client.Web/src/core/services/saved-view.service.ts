/**
 * Saved View Service
 * 
 * Manages saved views for browse/list views with:
 * - MRU (Most Recently Used) auto-save per entity type
 * - User-created named views
 * - localStorage persistence (future: API sync)
 * 
 * Key Features:
 * - Auto-saves MRU view when URL params change
 * - Restores MRU view on component init
 * - CRUD operations for named views
 * - Per-entity-type view collections
 */
import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  SavedView,
  SavedViewCollection,
  SavedViewStorage,
  CreateSavedViewInput,
  UpdateSavedViewInput,
  createSavedView,
  createMruView,
  createDefaultView,
  extractUrlParams,
  areUrlParamsEqual,
} from '../models/view/saved-view.model';

const STORAGE_KEY = 'saved-views';
const STORAGE_VERSION = '1.0';

@Injectable({
  providedIn: 'root'
})
export class SavedViewService {
  private router = inject(Router);
  
  // Reactive state
  private _storage = signal<SavedViewStorage>(this.loadStorage());
  
  /**
   * Get all views for an entity type
   */
  getViews(entityType: string): SavedView[] {
    const collection = this._storage().collections[entityType];
    return collection?.views || [];
  }
  
  /**
   * Get views as a signal for reactive updates
   */
  getViewsSignal(entityType: string) {
    return computed(() => {
      const collection = this._storage().collections[entityType];
      return collection?.views || [];
    });
  }
  
  /**
   * Get a specific view by ID
   */
  getView(entityType: string, viewId: string): SavedView | undefined {
    return this.getViews(entityType).find(v => v.id === viewId);
  }
  
  /**
   * Get the MRU (Most Recently Used) view for an entity type
   */
  getMruView(entityType: string): SavedView | undefined {
    return this.getViews(entityType).find(v => v.isMru);
  }
  
  /**
   * Get the default view for an entity type
   */
  getDefaultView(entityType: string): SavedView | undefined {
    return this.getViews(entityType).find(v => v.isDefault);
  }
  
  /**
   * Get user-created views (not MRU, not default)
   */
  getUserViews(entityType: string): SavedView[] {
    return this.getViews(entityType).filter(v => !v.isMru && !v.isDefault);
  }
  
  /**
   * Save or update the MRU view for an entity type
   * Called automatically when URL params change
   */
  saveMruView(entityType: string, urlParams: Record<string, string>): void {
    // Don't save empty params (that's the default view)
    if (Object.keys(urlParams).filter(k => urlParams[k]).length === 0) {
      return;
    }
    
    const mruView = createMruView(entityType, urlParams);
    
    this._storage.update(storage => {
      const collections = { ...storage.collections };
      const collection = collections[entityType] || this.createCollection(entityType);
      
      // Remove existing MRU view
      const views = collection.views.filter(v => !v.isMru);
      
      // Add new MRU view at the beginning
      views.unshift(mruView);
      
      collections[entityType] = {
        ...collection,
        views,
        mruViewId: mruView.id,
      };
      
      return {
        ...storage,
        collections,
        updatedAt: new Date().toISOString(),
      };
    });
    
    this.saveStorage();
    console.log(`[SavedViewService] Saved MRU view for ${entityType}:`, urlParams);
  }
  
  /**
   * Create a new user-saved view
   */
  createView(input: CreateSavedViewInput): SavedView {
    const view = createSavedView(input);
    
    this._storage.update(storage => {
      const collections = { ...storage.collections };
      const collection = collections[input.entityType] || this.createCollection(input.entityType);
      
      collections[input.entityType] = {
        ...collection,
        views: [...collection.views, view],
      };
      
      return {
        ...storage,
        collections,
        updatedAt: new Date().toISOString(),
      };
    });
    
    this.saveStorage();
    console.log(`[SavedViewService] Created view "${view.title}" for ${input.entityType}`);
    return view;
  }
  
  /**
   * Update an existing view
   */
  updateView(entityType: string, viewId: string, input: UpdateSavedViewInput): SavedView | undefined {
    let updatedView: SavedView | undefined;
    
    this._storage.update(storage => {
      const collections = { ...storage.collections };
      const collection = collections[entityType];
      if (!collection) return storage;
      
      const views = collection.views.map(v => {
        if (v.id === viewId) {
          updatedView = {
            ...v,
            ...input,
            updatedAt: new Date().toISOString(),
          };
          return updatedView;
        }
        return v;
      });
      
      collections[entityType] = { ...collection, views };
      
      return {
        ...storage,
        collections,
        updatedAt: new Date().toISOString(),
      };
    });
    
    this.saveStorage();
    return updatedView;
  }
  
  /**
   * Delete a saved view
   * Cannot delete default views
   */
  deleteView(entityType: string, viewId: string): boolean {
    const view = this.getView(entityType, viewId);
    if (!view || view.isDefault) {
      console.warn(`[SavedViewService] Cannot delete view ${viewId}`);
      return false;
    }
    
    this._storage.update(storage => {
      const collections = { ...storage.collections };
      const collection = collections[entityType];
      if (!collection) return storage;
      
      collections[entityType] = {
        ...collection,
        views: collection.views.filter(v => v.id !== viewId),
      };
      
      return {
        ...storage,
        collections,
        updatedAt: new Date().toISOString(),
      };
    });
    
    this.saveStorage();
    console.log(`[SavedViewService] Deleted view ${viewId}`);
    return true;
  }
  
  /**
   * Apply a saved view by navigating to its URL params
   */
  applyView(view: SavedView, route: ActivatedRoute): void {
    // Update last used timestamp
    this.markViewUsed(view.entityType, view.id);
    
    // Navigate with the view's URL params
    this.router.navigate([], {
      relativeTo: route,
      queryParams: view.urlParams,
      queryParamsHandling: 'replace', // Replace all params
    });
    
    console.log(`[SavedViewService] Applied view "${view.title}":`, view.urlParams);
  }
  
  /**
   * Mark a view as recently used
   */
  markViewUsed(entityType: string, viewId: string): void {
    this._storage.update(storage => {
      const collections = { ...storage.collections };
      const collection = collections[entityType];
      if (!collection) return storage;
      
      const views = collection.views.map(v => {
        if (v.id === viewId) {
          return { ...v, lastUsedAt: new Date().toISOString() };
        }
        return v;
      });
      
      collections[entityType] = { ...collection, views };
      
      return {
        ...storage,
        collections,
        updatedAt: new Date().toISOString(),
      };
    });
    
    this.saveStorage();
  }
  
  /**
   * Check if the current URL params match any saved view
   */
  findMatchingView(entityType: string, currentParams: Record<string, string>): SavedView | undefined {
    const views = this.getViews(entityType);
    return views.find(v => areUrlParamsEqual(v.urlParams, currentParams));
  }
  
  /**
   * Get the view to restore on initial load
   * Priority: URL params > MRU > Default
   */
  getInitialView(entityType: string, currentParams: Record<string, string>): SavedView | undefined {
    // If URL has params, don't override
    if (Object.keys(currentParams).filter(k => currentParams[k]).length > 0) {
      return this.findMatchingView(entityType, currentParams);
    }
    
    // Try MRU view
    const mru = this.getMruView(entityType);
    if (mru) {
      return mru;
    }
    
    // Fall back to default
    return this.getDefaultView(entityType);
  }
  
  /**
   * Check if we should restore MRU view on navigation
   * Returns true if URL has no params and MRU exists
   */
  shouldRestoreMru(entityType: string, currentParams: Record<string, string>): boolean {
    const hasParams = Object.keys(currentParams).filter(k => currentParams[k]).length > 0;
    if (hasParams) return false;
    
    return !!this.getMruView(entityType);
  }
  
  /**
   * Initialize views for an entity type with defaults
   */
  initializeEntity(entityType: string, defaultTitle?: string): void {
    if (this._storage().collections[entityType]) {
      return; // Already initialized
    }
    
    const defaultView = createDefaultView(entityType, defaultTitle);
    
    this._storage.update(storage => ({
      ...storage,
      collections: {
        ...storage.collections,
        [entityType]: {
          entityType,
          views: [defaultView],
          defaultViewId: defaultView.id,
        },
      },
      updatedAt: new Date().toISOString(),
    }));
    
    this.saveStorage();
    console.log(`[SavedViewService] Initialized entity ${entityType}`);
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Private Helpers
  // ═══════════════════════════════════════════════════════════════════
  
  private createCollection(entityType: string): SavedViewCollection {
    const defaultView = createDefaultView(entityType);
    return {
      entityType,
      views: [defaultView],
      defaultViewId: defaultView.id,
    };
  }
  
  private loadStorage(): SavedViewStorage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedViewStorage;
        // Version check for future migrations
        if (parsed.version === STORAGE_VERSION) {
          return parsed;
        }
        console.log('[SavedViewService] Storage version mismatch, starting fresh');
      }
    } catch (e) {
      console.warn('[SavedViewService] Failed to load storage:', e);
    }
    
    return this.createEmptyStorage();
  }
  
  private createEmptyStorage(): SavedViewStorage {
    return {
      version: STORAGE_VERSION,
      collections: {},
      updatedAt: new Date().toISOString(),
    };
  }
  
  private saveStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._storage()));
    } catch (e) {
      console.warn('[SavedViewService] Failed to save storage:', e);
    }
  }
  
  /**
   * Clear all saved views (for testing/reset)
   */
  clearAll(): void {
    this._storage.set(this.createEmptyStorage());
    localStorage.removeItem(STORAGE_KEY);
    console.log('[SavedViewService] Cleared all saved views');
  }
}
