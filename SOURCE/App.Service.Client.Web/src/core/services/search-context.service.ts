/**
 * Search Context Service
 * 
 * Enables synchronization between header search input and browse views.
 * 
 * Pattern:
 * - Header search input binds to this service
 * - Browse views subscribe to search state
 * - On route change, context is cleared or restored
 * 
 * Why separate from UniversalSearchService?
 * - UniversalSearchService manages search STATE (results, filters, pagination)
 * - SearchContext manages search INPUT synchronization (what's typed, where to show)
 * - Browse views own their SearchStateManager, but sync query from SearchContext
 */
import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';

export interface SearchContextConfig {
  /** Entity type being searched (e.g., 'spike', 'support-item') */
  entityType: string;
  /** Base route for this search context */
  baseRoute: string;
  /** Placeholder text for search input */
  placeholder: string;
  /** Icon for search context */
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class SearchContextService {
  private router = inject(Router);
  private logger = inject(SystemDiagnosticsTraceService);

  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────
  
  /** Current search query */
  private _query = signal('');
  
  /** Active search context (which browse view is active) */
  private _activeContext = signal<SearchContextConfig | null>(null);
  
  /** Is search expanded in header? */
  private _isExpanded = signal(false);
  
  /** Registered contexts by route */
  private _contexts = new Map<string, SearchContextConfig>();

  // Public signals
  readonly query = this._query.asReadonly();
  readonly activeContext = this._activeContext.asReadonly();
  readonly isExpanded = this._isExpanded.asReadonly();
  
  // Computed
  readonly hasActiveContext = computed(() => this._activeContext() !== null);
  readonly placeholder = computed(() => 
    this._activeContext()?.placeholder || 'Search...'
  );

  constructor() {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.onRouteChange(event.urlAfterRedirects);
    });
    
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  // ─────────────────────────────────────────────────────────────
  // Context Registration
  // ─────────────────────────────────────────────────────────────

  /**
   * Register a search context for a route
   * Called by browse components on init
   */
  registerContext(config: SearchContextConfig): void {
    this._contexts.set(config.baseRoute, config);
    this.logger.debug(`[SearchContext] Registered: ${config.entityType} at ${config.baseRoute}`);
  }

  /**
   * Unregister a search context
   * Called by browse components on destroy
   */
  unregisterContext(baseRoute: string): void {
    this._contexts.delete(baseRoute);
    if (this._activeContext()?.baseRoute === baseRoute) {
      this._activeContext.set(null);
    }
  }

  /**
   * Activate context for current route
   */
  activateContext(config: SearchContextConfig): void {
    this._activeContext.set(config);
    // Preserve query if same entity type
    if (this._activeContext()?.entityType !== config.entityType) {
      this._query.set('');
    }
    this.logger.debug(`[SearchContext] Activated: ${config.entityType}`);
  }

  /**
   * Deactivate current context
   */
  deactivateContext(): void {
    this._activeContext.set(null);
    this._query.set('');
    this._isExpanded.set(false);
  }

  // ─────────────────────────────────────────────────────────────
  // Query Management
  // ─────────────────────────────────────────────────────────────

  /**
   * Set search query (called by header search input)
   */
  setQuery(value: string): void {
    this._query.set(value);
  }

  /**
   * Clear search query
   */
  clearQuery(): void {
    this._query.set('');
  }

  /**
   * Expand search in header
   */
  expand(): void {
    this._isExpanded.set(true);
  }

  /**
   * Collapse search in header
   */
  collapse(): void {
    this._isExpanded.set(false);
  }

  /**
   * Toggle expansion
   */
  toggle(): void {
    this._isExpanded.update(v => !v);
  }

  // ─────────────────────────────────────────────────────────────
  // Route Handling
  // ─────────────────────────────────────────────────────────────

  /**
   * Handle route change - activate/deactivate context
   */
  private onRouteChange(url: string): void {
    // Find matching context
    let matchedContext: SearchContextConfig | null = null;
    
    for (const [route, config] of this._contexts) {
      if (url.startsWith(route)) {
        matchedContext = config;
        break;
      }
    }
    
    if (matchedContext) {
      this._activeContext.set(matchedContext);
      this.logger.debug(`[SearchContext] Route match: ${matchedContext.entityType}`);
    } else {
      // Clear context when leaving browse views
      if (this._activeContext() !== null) {
        this._activeContext.set(null);
        // Don't clear query - user might navigate back
      }
    }
  }
}
