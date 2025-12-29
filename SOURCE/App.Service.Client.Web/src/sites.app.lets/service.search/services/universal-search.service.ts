import { Injectable, signal, computed } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  SearchQuery, 
  SearchResults, 
  SearchResultItem, 
  RecentSearch,
  SavedSearch,
  createEmptySearchQuery,
  createEmptySearchResults 
} from '../models/search.model';
import { SearchAdapter, SearchableEntityType, DEFAULT_SEARCHABLE_TYPES } from '../models/searchable-entity.model';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

/**
 * Universal Search Service
 * 
 * Orchestrates search across all registered entity types.
 * Entity types register their search adapters here.
 */
@Injectable({ providedIn: 'root' })
export class UniversalSearchService {
  /** Current query */
  query = signal<SearchQuery>(createEmptySearchQuery());
  
  /** Current results */
  results = signal<SearchResults>(createEmptySearchResults(createEmptySearchQuery()));
  
  /** Loading state */
  loading = signal(false);
  
  /** Error state */
  error = signal<string | null>(null);
  
  /** Recent searches */
  recentSearches = signal<RecentSearch[]>([]);
  
  /** Saved searches */
  savedSearches = signal<SavedSearch[]>([]);
  
  /** Registered entity types */
  entityTypes = signal<SearchableEntityType[]>([...DEFAULT_SEARCHABLE_TYPES]);
  
  /** Registered search adapters */
  private adapters = new Map<string, SearchAdapter>();
  
  /** Max recent searches to keep */
  private readonly MAX_RECENT_SEARCHES = 10;
  
  /** Computed: Has results */
  hasResults = computed(() => this.results().items.length > 0);
  
  /** Computed: Is empty search */
  isEmptySearch = computed(() => !this.query().term && !this.query().entityType);

  constructor(private logger: SystemDiagnosticsTraceService) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadRecentSearches();
    this.loadSavedSearches();
  }

  /**
   * Register a search adapter for an entity type
   */
  registerAdapter(adapter: SearchAdapter): void {
    this.adapters.set(adapter.entityType.typeId, adapter);
    
    // Add to entity types if not already present
    const types = this.entityTypes();
    if (!types.find(t => t.typeId === adapter.entityType.typeId)) {
      this.entityTypes.set([...types, adapter.entityType]);
    }
    
    this.logger.debug(`Registered search adapter for: ${adapter.entityType.typeId}`);
  }

  /**
   * Unregister a search adapter
   */
  unregisterAdapter(typeId: string): void {
    this.adapters.delete(typeId);
    this.entityTypes.set(this.entityTypes().filter(t => t.typeId !== typeId));
    this.logger.debug(`Unregistered search adapter for: ${typeId}`);
  }

  /**
   * Execute search
   */
  search(query: SearchQuery): void {
    this.query.set(query);
    this.loading.set(true);
    this.error.set(null);
    
    // Get adapters to search
    const adaptersToSearch = query.entityType
      ? [this.adapters.get(query.entityType)].filter(Boolean) as SearchAdapter[]
      : Array.from(this.adapters.values());
    
    if (adaptersToSearch.length === 0) {
      this.logger.warn('No search adapters registered');
      this.results.set(createEmptySearchResults(query));
      this.loading.set(false);
      return;
    }
    
    // Execute search across all adapters
    const searchObservables = adaptersToSearch.map(adapter =>
      adapter.search(query).pipe(
        catchError(err => {
          this.logger.error(`Search error for ${adapter.entityType.typeId}: ${err}`);
          return of([] as SearchResultItem[]);
        })
      )
    );
    
    forkJoin(searchObservables).subscribe({
      next: (resultsArrays) => {
        // Combine results from all adapters
        const allItems = resultsArrays.flat();
        
        // Sort by score or date
        const sortedItems = this.sortResults(allItems, query);
        
        // Paginate
        const startIndex = ((query.page || 1) - 1) * (query.pageSize || 20);
        const paginatedItems = sortedItems.slice(startIndex, startIndex + (query.pageSize || 20));
        
        const results: SearchResults = {
          query,
          items: paginatedItems,
          totalCount: allItems.length,
          page: query.page || 1,
          pageSize: query.pageSize || 20,
          totalPages: Math.ceil(allItems.length / (query.pageSize || 20)),
        };
        
        this.results.set(results);
        this.loading.set(false);
        
        // Add to recent searches
        if (query.term) {
          this.addRecentSearch(query, allItems.length);
        }
        
        this.logger.debug(`Search completed: ${allItems.length} results`);
      },
      error: (err) => {
        this.error.set('Search failed');
        this.loading.set(false);
        this.logger.error(`Search failed: ${err}`);
      }
    });
  }

  /**
   * Quick search (just term, no filters)
   */
  quickSearch(term: string): void {
    this.search({
      ...createEmptySearchQuery(),
      term,
    });
  }

  /**
   * Filter by entity type
   */
  filterByType(typeId: string | undefined): void {
    const currentQuery = this.query();
    this.search({
      ...currentQuery,
      entityType: typeId,
      page: 1, // Reset to first page
    });
  }

  /**
   * Go to page
   */
  goToPage(page: number): void {
    const currentQuery = this.query();
    this.search({
      ...currentQuery,
      page,
    });
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.query.set(createEmptySearchQuery());
    this.results.set(createEmptySearchResults(createEmptySearchQuery()));
    this.error.set(null);
  }

  /**
   * Save current search
   */
  saveSearch(name: string): void {
    const search: SavedSearch = {
      id: crypto.randomUUID(),
      name,
      query: this.query(),
      createdAt: new Date(),
    };
    
    this.savedSearches.set([search, ...this.savedSearches()]);
    this.persistSavedSearches();
  }

  /**
   * Delete saved search
   */
  deleteSavedSearch(id: string): void {
    this.savedSearches.set(this.savedSearches().filter(s => s.id !== id));
    this.persistSavedSearches();
  }

  /**
   * Execute saved search
   */
  executeSavedSearch(id: string): void {
    const saved = this.savedSearches().find(s => s.id === id);
    if (saved) {
      // Update last used
      saved.lastUsedAt = new Date();
      this.persistSavedSearches();
      
      // Execute
      this.search(saved.query);
    }
  }

  /**
   * Clear recent searches
   */
  clearRecentSearches(): void {
    this.recentSearches.set([]);
    localStorage.removeItem('search_recent');
  }

  // Private helpers
  
  private sortResults(items: SearchResultItem[], query: SearchQuery): SearchResultItem[] {
    const sortBy = query.sortBy || 'score';
    const sortDir = query.sortDirection || 'desc';
    
    return [...items].sort((a, b) => {
      let aVal: any;
      let bVal: any;
      
      if (sortBy === 'score') {
        aVal = a.score || 0;
        bVal = b.score || 0;
      } else if (sortBy === 'createdAt' || sortBy === 'modifiedAt') {
        aVal = (a as any)[sortBy]?.getTime() || 0;
        bVal = (b as any)[sortBy]?.getTime() || 0;
      } else {
        aVal = (a as any)[sortBy] || '';
        bVal = (b as any)[sortBy] || '';
      }
      
      if (sortDir === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
  }
  
  private addRecentSearch(query: SearchQuery, resultCount: number): void {
    const recent: RecentSearch = {
      term: query.term,
      entityType: query.entityType,
      timestamp: new Date(),
      resultCount,
    };
    
    const recents = this.recentSearches();
    // Remove duplicates
    const filtered = recents.filter(r => r.term !== query.term || r.entityType !== query.entityType);
    // Add to front, limit size
    const updated = [recent, ...filtered].slice(0, this.MAX_RECENT_SEARCHES);
    
    this.recentSearches.set(updated);
    localStorage.setItem('search_recent', JSON.stringify(updated));
  }
  
  private loadRecentSearches(): void {
    try {
      const stored = localStorage.getItem('search_recent');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.recentSearches.set(parsed.map((r: any) => ({
          ...r,
          timestamp: new Date(r.timestamp)
        })));
      }
    } catch {
      // Ignore
    }
  }
  
  private loadSavedSearches(): void {
    try {
      const stored = localStorage.getItem('search_saved');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.savedSearches.set(parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          lastUsedAt: s.lastUsedAt ? new Date(s.lastUsedAt) : undefined
        })));
      }
    } catch {
      // Ignore
    }
  }
  
  private persistSavedSearches(): void {
    localStorage.setItem('search_saved', JSON.stringify(this.savedSearches()));
  }
}
