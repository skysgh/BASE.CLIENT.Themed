import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LocalStorageService } from './browser/local-storage.service';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { 
  ViewDescription, 
  ViewFilter, 
  ViewSort, 
  ViewPage, 
  ViewPresentation,
  createDefaultViewDescription,
  mergeViewDescription 
} from '../models/view/view-description.model';

/**
 * ViewStateService
 * 
 * Manages persistence of browse view states (filter, sort, page, presentation).
 * Provides MRU (Most Recently Used) functionality so users don't have to
 * reconfigure views each time they navigate.
 * 
 * STORAGE STRATEGY:
 * - MRU views: localStorage (keyed by viewKey)
 * - Saved views: TODO - API/database for named views
 * - Default views: TODO - API/database for team defaults
 * 
 * KEY FORMAT:
 * - MRU: `view_mru_{viewKey}` (e.g., `view_mru_spikes_browse`)
 * - Saved: `view_saved_{viewId}` (when we add saved views feature)
 * 
 * USAGE:
 * ```typescript
 * // In a browse component:
 * ngOnInit() {
 *   // Load MRU view state
 *   this.viewState = this.viewStateService.loadMru('spikes_browse');
 *   this.applyViewState(this.viewState);
 * }
 * 
 * onFilterChange(filter: ViewFilter) {
 *   this.viewState.filter = filter;
 *   this.viewStateService.saveMru('spikes_browse', this.viewState);
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ViewStateService {
  private localStorage = inject(LocalStorageService);
  private diagnostics = inject(SystemDiagnosticsTraceService);

  // Cache of loaded view states
  private viewCache = new Map<string, ViewDescription>();

  // Observable streams for reactive updates
  private viewSubjects = new Map<string, BehaviorSubject<ViewDescription>>();

  // Storage key prefix
  private readonly MRU_PREFIX = 'view_mru_';
  private readonly SAVED_PREFIX = 'view_saved_';

  // ============================================
  // MRU (Most Recently Used) Views
  // ============================================

  /**
   * Load MRU view state for a view key
   * Returns default if no MRU exists
   */
  loadMru(viewKey: string): ViewDescription {
    this.diagnostics.debug(`ViewStateService.loadMru('${viewKey}')`);

    // Check cache first
    if (this.viewCache.has(viewKey)) {
      return this.viewCache.get(viewKey)!;
    }

    // Try to load from storage
    const stored = this.localStorage.getObject<ViewDescription>(
      this.getMruKey(viewKey)
    );

    if (stored) {
      this.diagnostics.debug(`ViewStateService: Loaded MRU for ${viewKey}`);
      this.viewCache.set(viewKey, stored);
      return stored;
    }

    // Return default
    this.diagnostics.debug(`ViewStateService: No MRU for ${viewKey}, using default`);
    const defaultView = createDefaultViewDescription(viewKey);
    this.viewCache.set(viewKey, defaultView);
    return defaultView;
  }

  /**
   * Save MRU view state
   */
  saveMru(viewKey: string, view: Partial<ViewDescription>): void {
    this.diagnostics.debug(`ViewStateService.saveMru('${viewKey}')`);

    // Get current state or default
    const current = this.viewCache.get(viewKey) || createDefaultViewDescription(viewKey);

    // Merge changes
    const updated = mergeViewDescription(current, view);

    // Update cache
    this.viewCache.set(viewKey, updated);

    // Persist to storage
    this.localStorage.setObject(this.getMruKey(viewKey), updated);

    // Notify subscribers
    this.notifySubscribers(viewKey, updated);
  }

  /**
   * Get observable for view state changes
   */
  getViewState$(viewKey: string): Observable<ViewDescription> {
    if (!this.viewSubjects.has(viewKey)) {
      const initial = this.loadMru(viewKey);
      this.viewSubjects.set(viewKey, new BehaviorSubject(initial));
    }
    return this.viewSubjects.get(viewKey)!.asObservable();
  }

  /**
   * Clear MRU for a view (reset to default)
   */
  clearMru(viewKey: string): void {
    this.diagnostics.debug(`ViewStateService.clearMru('${viewKey}')`);
    
    this.localStorage.remove(this.getMruKey(viewKey));
    this.viewCache.delete(viewKey);
    
    const defaultView = createDefaultViewDescription(viewKey);
    this.notifySubscribers(viewKey, defaultView);
  }

  /**
   * Clear all MRU views
   */
  clearAllMru(): void {
    this.diagnostics.info('ViewStateService.clearAllMru()');
    
    // Get all MRU keys
    const keys = this.localStorage.keys().filter(k => k.startsWith(this.MRU_PREFIX));
    
    // Remove each
    keys.forEach(key => this.localStorage.remove(key));
    
    // Clear cache
    this.viewCache.clear();
  }

  // ============================================
  // Individual State Updates (Convenience)
  // ============================================

  /**
   * Update just the filter
   */
  updateFilter(viewKey: string, filter: ViewFilter): void {
    this.saveMru(viewKey, { filter });
  }

  /**
   * Update just the sort
   */
  updateSort(viewKey: string, sort: ViewSort): void {
    this.saveMru(viewKey, { sort });
  }

  /**
   * Update just the page
   */
  updatePage(viewKey: string, page: Partial<ViewPage>): void {
    const current = this.loadMru(viewKey);
    this.saveMru(viewKey, { 
      page: { ...current.page, ...page } 
    });
  }

  /**
   * Update just the presentation
   */
  updatePresentation(viewKey: string, presentation: Partial<ViewPresentation>): void {
    const current = this.loadMru(viewKey);
    this.saveMru(viewKey, { 
      presentation: { ...current.presentation, ...presentation } 
    });
  }

  // ============================================
  // Saved Views (Future)
  // ============================================

  /**
   * Save a named view
   * TODO: Implement with API when backend ready
   */
  async saveNamedView(view: ViewDescription): Promise<ViewDescription> {
    this.diagnostics.warn('ViewStateService.saveNamedView() - TODO: Implement with API');
    
    // For now, save to localStorage with ID
    const id = view.id || this.generateId();
    const savedView: ViewDescription = {
      ...view,
      id,
      createdAt: view.createdAt || new Date().toISOString()
    };
    
    this.localStorage.setObject(`${this.SAVED_PREFIX}${id}`, savedView);
    
    return savedView;
  }

  /**
   * Load a named view
   * TODO: Implement with API when backend ready
   */
  async loadNamedView(viewId: string): Promise<ViewDescription | null> {
    this.diagnostics.debug(`ViewStateService.loadNamedView('${viewId}')`);
    
    return this.localStorage.getObject<ViewDescription>(`${this.SAVED_PREFIX}${viewId}`);
  }

  /**
   * List saved views for a view key
   * TODO: Implement with API when backend ready
   */
  async listSavedViews(viewKey: string): Promise<ViewDescription[]> {
    this.diagnostics.debug(`ViewStateService.listSavedViews('${viewKey}')`);
    
    // For now, scan localStorage
    const savedViews: ViewDescription[] = [];
    const keys = this.localStorage.keys().filter(k => k.startsWith(this.SAVED_PREFIX));
    
    for (const key of keys) {
      const view = this.localStorage.getObject<ViewDescription>(key);
      if (view && view.viewKey === viewKey) {
        savedViews.push(view);
      }
    }
    
    return savedViews;
  }

  /**
   * Delete a saved view
   * TODO: Implement with API when backend ready
   */
  async deleteSavedView(viewId: string): Promise<void> {
    this.diagnostics.debug(`ViewStateService.deleteSavedView('${viewId}')`);
    
    this.localStorage.remove(`${this.SAVED_PREFIX}${viewId}`);
  }

  // ============================================
  // Private Helpers
  // ============================================

  private getMruKey(viewKey: string): string {
    return `${this.MRU_PREFIX}${viewKey}`;
  }

  private notifySubscribers(viewKey: string, view: ViewDescription): void {
    const subject = this.viewSubjects.get(viewKey);
    if (subject) {
      subject.next(view);
    }
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
