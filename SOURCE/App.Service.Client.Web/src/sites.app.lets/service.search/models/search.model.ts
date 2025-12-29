/**
 * Universal Search Models
 * 
 * Engine-agnostic search abstractions that work across all entity types.
 */

/**
 * Search query parameters
 */
export interface SearchQuery {
  /** Search term (full-text) */
  term: string;
  /** Entity type filter (e.g., 'spike', 'product') */
  entityType?: string;
  /** Additional filters */
  filters?: SearchFilter[];
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Page number (1-based) */
  page?: number;
  /** Page size */
  pageSize?: number;
}

/**
 * Search filter
 */
export interface SearchFilter {
  /** Field to filter on */
  field: string;
  /** Filter operator */
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in';
  /** Filter value */
  value: any;
}

/**
 * Search result item (entity-agnostic)
 */
export interface SearchResultItem {
  /** Entity ID */
  id: string;
  /** Entity type (e.g., 'spike', 'product') */
  entityType: string;
  /** Display title */
  title: string;
  /** Display subtitle */
  subtitle?: string;
  /** Description/excerpt with highlights */
  description?: string;
  /** Icon class */
  icon?: string;
  /** Status badge */
  status?: {
    label: string;
    color: string;
  };
  /** Tags/classifications */
  tags?: string[];
  /** Primary metadata */
  metadata?: SearchResultMetadata[];
  /** Route to navigate to for Read view */
  route: string;
  /** Relevance score (0-1) */
  score?: number;
  /** Highlighted matches */
  highlights?: Record<string, string>;
  /** Created date */
  createdAt?: Date;
  /** Modified date */
  modifiedAt?: Date;
}

/**
 * Metadata item for search result
 */
export interface SearchResultMetadata {
  label: string;
  value: string;
  icon?: string;
}

/**
 * Search results response
 */
export interface SearchResults {
  /** Query that produced these results */
  query: SearchQuery;
  /** Result items */
  items: SearchResultItem[];
  /** Total count (for pagination) */
  totalCount: number;
  /** Current page */
  page: number;
  /** Page size */
  pageSize: number;
  /** Total pages */
  totalPages: number;
  /** Facets for filtering */
  facets?: SearchFacet[];
  /** Search execution time (ms) */
  executionTimeMs?: number;
}

/**
 * Search facet for filtering
 */
export interface SearchFacet {
  /** Facet field */
  field: string;
  /** Display label */
  label: string;
  /** Facet values with counts */
  values: SearchFacetValue[];
}

/**
 * Facet value with count
 */
export interface SearchFacetValue {
  value: string;
  label: string;
  count: number;
  selected?: boolean;
}

/**
 * Saved search
 */
export interface SavedSearch {
  id: string;
  name: string;
  query: SearchQuery;
  createdAt: Date;
  lastUsedAt?: Date;
}

/**
 * Recent search
 */
export interface RecentSearch {
  term: string;
  entityType?: string;
  timestamp: Date;
  resultCount?: number;
}

/**
 * Create empty search query
 */
export function createEmptySearchQuery(): SearchQuery {
  return {
    term: '',
    entityType: undefined,
    filters: [],
    sortBy: 'modifiedAt',
    sortDirection: 'desc',
    page: 1,
    pageSize: 20,
  };
}

/**
 * Create empty search results
 */
export function createEmptySearchResults(query: SearchQuery): SearchResults {
  return {
    query,
    items: [],
    totalCount: 0,
    page: query.page || 1,
    pageSize: query.pageSize || 20,
    totalPages: 0,
    facets: [],
  };
}
