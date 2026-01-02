/**
 * Universal Search Service
 * 
 * Provides a unified search, filter, and sort interface for any entity type.
 * Works with the Card Broker infrastructure to provide consistent search UX.
 */
import { Injectable, signal, computed, Signal } from '@angular/core';
import { CardBrokerRegistry } from '../models/presentation/card-broker.model';
import { IUniversalCardData } from '../models/presentation/universal-card.model';
import { IColumnDefinition, SortDirection } from '../models/presentation/presentation-profile.model';
import { FilterCriteria, SortCriteria } from '../models/query/query-criteria.model';

/**
 * Filter value types supported by the search service
 */
export type FilterValue = 
  | string 
  | number 
  | boolean 
  | string[] 
  | { min?: number; max?: number } 
  | { from?: string; to?: string }
  | null;

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH STATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Search state for a specific entity type
 */
export interface ISearchState<T = unknown> {
  /** Entity type */
  entityType: string;
  
  /** Full-text search query */
  query: string;
  
  /** Active filters */
  filters: Map<string, FilterValue>;
  
  /** Current sorting */
  sortColumn: string | null;
  sortDirection: SortDirection;
  
  /** Pagination */
  page: number;
  pageSize: number;
  
  /** Source data */
  sourceData: T[];
  
  /** Filtered/sorted results */
  results: T[];
  
  /** Total count (before pagination) */
  totalCount: number;
  
  /** Is loading */
  loading: boolean;
  
  /** Error message */
  error: string | null;
}

/**
 * Search state manager
 */
export class SearchStateManager<T> {
  // Signals
  private _query = signal('');
  private _filters = signal<Map<string, FilterValue>>(new Map());
  private _sortColumn = signal<string | null>(null);
  private _sortDirection = signal<SortDirection>('asc');
  private _page = signal(1);
  private _pageSize = signal(20);
  private _sourceData = signal<T[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly signals
  readonly query = this._query.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly sortColumn = this._sortColumn.asReadonly();
  readonly sortDirection = this._sortDirection.asReadonly();
  readonly page = this._page.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed: filtered and sorted results
  readonly results = computed(() => {
    let data = [...this._sourceData()];
    
    // Apply full-text search
    const query = this._query().toLowerCase().trim();
    if (query) {
      data = data.filter(item => this.matchesQuery(item, query));
    }
    
    // Apply filters
    const filters = this._filters();
    if (filters.size > 0) {
      data = data.filter(item => this.matchesFilters(item, filters));
    }
    
    // Apply sorting
    const sortCol = this._sortColumn();
    if (sortCol) {
      const direction = this._sortDirection();
      data = this.sortData(data, sortCol, direction);
    }
    
    return data;
  });
  
  // Computed: total count before pagination
  readonly totalCount = computed(() => this.results().length);
  
  // Computed: paginated results
  readonly paginatedResults = computed(() => {
    const results = this.results();
    const page = this._page();
    const pageSize = this._pageSize();
    const start = (page - 1) * pageSize;
    return results.slice(start, start + pageSize);
  });
  
  // Computed: total pages
  readonly totalPages = computed(() => {
    const total = this.totalCount();
    const pageSize = this._pageSize();
    return Math.ceil(total / pageSize);
  });
  
  // Computed: has next/prev page
  readonly hasNextPage = computed(() => this._page() < this.totalPages());
  readonly hasPrevPage = computed(() => this._page() > 1);
  
  constructor(
    public readonly entityType: string,
    private brokerRegistry: CardBrokerRegistry,
    private searchableFields: string[] = []
  ) {}
  
  // ─────────────────────────────────────────────────────────────
  // Setters
  // ─────────────────────────────────────────────────────────────
  
  setSourceData(data: T[]): void {
    this._sourceData.set(data);
    this._page.set(1); // Reset to first page
  }
  
  setQuery(query: string): void {
    this._query.set(query);
    this._page.set(1);
  }
  
  setFilter(field: string, value: FilterValue): void {
    const filters = new Map(this._filters());
    if (value === null || value === undefined || value === '') {
      filters.delete(field);
    } else {
      filters.set(field, value);
    }
    this._filters.set(filters);
    this._page.set(1);
  }
  
  clearFilter(field: string): void {
    const filters = new Map(this._filters());
    filters.delete(field);
    this._filters.set(filters);
    this._page.set(1);
  }
  
  clearAllFilters(): void {
    this._filters.set(new Map());
    this._page.set(1);
  }
  
  /**
   * Apply FilterCriteria array (from BrowseView)
   * Converts to internal filter format and triggers re-filter
   */
  applyFilterCriteria(criteria: FilterCriteria[]): void {
    const filters = new Map<string, FilterValue>();
    
    for (const filter of criteria) {
      // Convert criteria to filter value based on operator
      let value: FilterValue;
      
      switch (filter.operator) {
        case 'between':
          // Could be date or number, check if value looks like date
          const isDate = this.looksLikeDate(filter.value);
          if (isDate) {
            value = { from: filter.value, to: filter.value2 };
          } else {
            value = { 
              min: parseFloat(filter.value), 
              max: filter.value2 ? parseFloat(filter.value2) : undefined 
            };
          }
          break;
        case 'in':
          value = Array.isArray(filter.value) 
            ? filter.value 
            : filter.value.split(',').map((v: string) => v.trim());
          break;
        case 'gte':
        case 'gt':
          if (this.looksLikeDate(filter.value)) {
            value = { from: filter.value };
          } else {
            value = { min: parseFloat(filter.value) };
          }
          break;
        case 'lte':
        case 'lt':
          if (this.looksLikeDate(filter.value)) {
            value = { to: filter.value };
          } else {
            value = { max: parseFloat(filter.value) };
          }
          break;
        default:
          value = filter.value;
      }
      
      filters.set(filter.field, value);
    }
    
    this._filters.set(filters);
    this._page.set(1);
  }
  
  /**
   * Check if a value looks like an ISO date string
   */
  private looksLikeDate(value: any): boolean {
    if (typeof value !== 'string') return false;
    // ISO date pattern: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
    return /^\d{4}-\d{2}-\d{2}/.test(value);
  }
  
  /**
   * Apply SortCriteria array (from BrowseView)
   * Uses first sort criterion for now (multi-sort TBD)
   */
  applySortCriteria(criteria: SortCriteria[]): void {
    if (criteria.length > 0) {
      this._sortColumn.set(criteria[0].field);
      this._sortDirection.set(criteria[0].direction);
    } else {
      this._sortColumn.set(null);
      this._sortDirection.set('asc');
    }
  }
  
  setSorting(column: string | null, direction: SortDirection = 'asc'): void {
    this._sortColumn.set(column);
    this._sortDirection.set(direction);
  }
  
  toggleSorting(column: string): void {
    if (this._sortColumn() === column) {
      // Toggle direction
      this._sortDirection.set(this._sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to asc
      this._sortColumn.set(column);
      this._sortDirection.set('asc');
    }
  }
  
  setPage(page: number): void {
    this._page.set(Math.max(1, Math.min(page, this.totalPages())));
  }
  
  nextPage(): void {
    if (this.hasNextPage()) {
      this._page.update(p => p + 1);
    }
  }
  
  prevPage(): void {
    if (this.hasPrevPage()) {
      this._page.update(p => p - 1);
    }
  }
  
  setPageSize(size: number): void {
    this._pageSize.set(size);
    this._page.set(1);
  }
  
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }
  
  setError(error: string | null): void {
    this._error.set(error);
  }
  
  reset(): void {
    this._query.set('');
    this._filters.set(new Map());
    this._sortColumn.set(null);
    this._sortDirection.set('asc');
    this._page.set(1);
  }
  
  // ─────────────────────────────────────────────────────────────
  // Card transformation
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Get paginated results as universal cards
   */
  getCards(): Signal<IUniversalCardData[]> {
    return computed(() => {
      const results = this.paginatedResults();
      return this.brokerRegistry.toCards(this.entityType, results);
    });
  }
  
  /**
   * Get all results as universal cards (no pagination)
   */
  getAllCards(): Signal<IUniversalCardData[]> {
    return computed(() => {
      const results = this.results();
      return this.brokerRegistry.toCards(this.entityType, results);
    });
  }
  
  // ─────────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────────
  
  private matchesQuery(item: T, query: string): boolean {
    // Search in all string fields
    const searchFields = this.searchableFields.length > 0 
      ? this.searchableFields 
      : Object.keys(item as object);
    
    for (const field of searchFields) {
      const value = this.brokerRegistry.getFieldValue(this.entityType, item, field);
      if (typeof value === 'string' && value.toLowerCase().includes(query)) {
        return true;
      }
    }
    return false;
  }
  
  private matchesFilters(item: T, filters: Map<string, FilterValue>): boolean {
    for (const [field, filterValue] of filters) {
      const itemValue = this.brokerRegistry.getFieldValue(this.entityType, item, field);
      
      if (!this.matchesFilter(itemValue, filterValue)) {
        return false;
      }
    }
    return true;
  }
  
  private matchesFilter(itemValue: unknown, filterValue: FilterValue): boolean {
    if (filterValue === null || filterValue === undefined) return true;
    
    // Array filter (OR logic)
    if (Array.isArray(filterValue)) {
      return filterValue.includes(itemValue as string);
    }
    
    // Range filter
    if (typeof filterValue === 'object' && ('min' in filterValue || 'max' in filterValue)) {
      const rangeFilter = filterValue as { min?: number; max?: number };
      const num = typeof itemValue === 'number' ? itemValue : Number(itemValue);
      if (isNaN(num)) return false;
      
      if (rangeFilter.min !== undefined && num < rangeFilter.min) return false;
      if (rangeFilter.max !== undefined && num > rangeFilter.max) return false;
      return true;
    }
    
    // Date range
    if (typeof filterValue === 'object' && ('from' in filterValue || 'to' in filterValue)) {
      const dateFilter = filterValue as { from?: string; to?: string };
      const date = itemValue instanceof Date ? itemValue : new Date(itemValue as string);
      if (isNaN(date.getTime())) return false;
      
      if (dateFilter.from && date < new Date(dateFilter.from)) return false;
      if (dateFilter.to && date > new Date(dateFilter.to)) return false;
      return true;
    }
    
    // String contains
    if (typeof filterValue === 'string' && typeof itemValue === 'string') {
      return itemValue.toLowerCase().includes(filterValue.toLowerCase());
    }
    
    // Exact match
    return itemValue === filterValue;
  }
  
  private sortData(data: T[], column: string, direction: SortDirection): T[] {
    return [...data].sort((a, b) => {
      const aVal = this.brokerRegistry.getFieldValue(this.entityType, a, column);
      const bVal = this.brokerRegistry.getFieldValue(this.entityType, b, column);
      
      let comparison = 0;
      
      if (aVal === bVal) {
        comparison = 0;
      } else if (aVal === null || aVal === undefined) {
        comparison = 1;
      } else if (bVal === null || bVal === undefined) {
        comparison = -1;
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime();
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }
      
      return direction === 'desc' ? -comparison : comparison;
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIVERSAL SEARCH SERVICE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Universal Search Service
 * 
 * Factory for creating search state managers for different entity types.
 */
@Injectable({ providedIn: 'root' })
export class UniversalSearchService {
  
  constructor(private brokerRegistry: CardBrokerRegistry) {}
  
  /**
   * Create a search state manager for an entity type
   * 
   * @param entityType Entity type (must have a registered broker)
   * @param searchableFields Fields to include in full-text search (optional)
   */
  createSearchState<T>(entityType: string, searchableFields?: string[]): SearchStateManager<T> {
    if (!this.brokerRegistry.hasBroker(entityType)) {
      throw new Error(`No broker registered for entity type: ${entityType}. Register a broker first.`);
    }
    
    return new SearchStateManager<T>(entityType, this.brokerRegistry, searchableFields);
  }
  
  /**
   * Get available columns for an entity type
   */
  getColumns(entityType: string): IColumnDefinition[] {
    return this.brokerRegistry.getColumns(entityType);
  }
}
