/**
 * ViewDescription Model
 * 
 * Captures the complete state of a browse/list view for persistence.
 * Enables users to save and recall their preferred view settings.
 * 
 * USE CASES:
 * 1. MRU (Most Recently Used) - Auto-save view state on navigation
 * 2. Saved Views - User can name and save specific configurations
 * 3. Shared Views - Export/import view configurations
 * 4. Default Views - Admin can set team defaults
 * 
 * COMPONENTS:
 * - Filter: What data to show (search, filters)
 * - Sort: How to order data
 * - Page: Which page, page size
 * - Presentation: How to display (table, cards, list)
 * 
 * STORAGE:
 * - MRU: localStorage (per view key)
 * - Saved: API/database (named views)
 */

/**
 * Filter criteria for a view
 */
export interface ViewFilter {
  /** Free text search query */
  searchQuery?: string;
  
  /** Field-specific filters */
  fieldFilters?: FieldFilter[];
  
  /** Date range filter */
  dateRange?: DateRangeFilter;
  
  /** Status/state filters */
  statuses?: string[];
  
  /** Tag filters */
  tags?: string[];
  
  /** Custom filters (key-value pairs) */
  custom?: Record<string, any>;
}

/**
 * Filter on a specific field
 */
export interface FieldFilter {
  /** Field name/path */
  field: string;
  
  /** Comparison operator */
  operator: FilterOperator;
  
  /** Value to compare against */
  value: any;
  
  /** Data type hint */
  type?: 'string' | 'number' | 'date' | 'boolean' | 'array';
}

/**
 * Filter operators
 */
export type FilterOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'startsWith' 
  | 'endsWith'
  | 'greaterThan' 
  | 'lessThan' 
  | 'greaterOrEqual' 
  | 'lessOrEqual'
  | 'between'
  | 'in' 
  | 'notIn'
  | 'isNull' 
  | 'isNotNull';

/**
 * Date range filter
 */
export interface DateRangeFilter {
  /** Start date (ISO string) */
  from?: string;
  
  /** End date (ISO string) */
  to?: string;
  
  /** Preset (overrides from/to) */
  preset?: DateRangePreset;
}

/**
 * Common date range presets
 */
export type DateRangePreset = 
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisQuarter'
  | 'lastQuarter'
  | 'thisYear'
  | 'lastYear'
  | 'last7Days'
  | 'last30Days'
  | 'last90Days';

/**
 * Sort configuration for a view
 */
export interface ViewSort {
  /** Primary sort field */
  field: string;
  
  /** Sort direction */
  direction: 'asc' | 'desc';
  
  /** Secondary sorts (for tie-breaking) */
  thenBy?: ViewSort[];
}

/**
 * Pagination state
 */
export interface ViewPage {
  /** Current page number (1-based) */
  pageNumber: number;
  
  /** Items per page */
  pageSize: number;
  
  /** Available page size options */
  pageSizeOptions?: number[];
}

/**
 * Presentation/display mode
 */
export interface ViewPresentation {
  /** Display mode */
  mode: PresentationMode;
  
  /** Density (compact, normal, comfortable) */
  density?: 'compact' | 'normal' | 'comfortable';
  
  /** Visible columns (for table mode) */
  visibleColumns?: string[];
  
  /** Column widths (for table mode) */
  columnWidths?: Record<string, number>;
  
  /** Card size (for card mode) */
  cardSize?: 'small' | 'medium' | 'large';
  
  /** Group by field */
  groupBy?: string;
  
  /** Expanded groups */
  expandedGroups?: string[];
}

/**
 * Presentation modes
 */
export type PresentationMode = 
  | 'table'
  | 'cards'
  | 'list'
  | 'grid'
  | 'timeline'
  | 'kanban'
  | 'calendar';

/**
 * Complete view description
 */
export interface ViewDescription {
  /** Unique identifier for this view description */
  id?: string;
  
  /** View key (identifies which browse view this is for) */
  viewKey: string;
  
  /** Human-readable name (for saved views) */
  name?: string;
  
  /** Description (for saved views) */
  description?: string;
  
  /** Filter configuration */
  filter: ViewFilter;
  
  /** Sort configuration */
  sort: ViewSort;
  
  /** Pagination state */
  page: ViewPage;
  
  /** Presentation settings */
  presentation: ViewPresentation;
  
  /** When this view was last used */
  lastUsedAt?: string;
  
  /** Number of times this view has been used */
  useCount?: number;
  
  /** Who created this view (for saved views) */
  createdBy?: string;
  
  /** When created */
  createdAt?: string;
  
  /** Is this a system default? */
  isDefault?: boolean;
  
  /** Is this shared with team? */
  isShared?: boolean;
  
  /** Tags for categorization */
  tags?: string[];
}

/**
 * Default values
 */
export const DEFAULT_PAGE: ViewPage = {
  pageNumber: 1,
  pageSize: 20,
  pageSizeOptions: [10, 20, 50, 100]
};

export const DEFAULT_SORT: ViewSort = {
  field: 'createdAt',
  direction: 'desc'
};

export const DEFAULT_PRESENTATION: ViewPresentation = {
  mode: 'table',
  density: 'normal'
};

export const DEFAULT_FILTER: ViewFilter = {};

/**
 * Create a default view description for a given view key
 */
export function createDefaultViewDescription(viewKey: string): ViewDescription {
  return {
    viewKey,
    filter: { ...DEFAULT_FILTER },
    sort: { ...DEFAULT_SORT },
    page: { ...DEFAULT_PAGE },
    presentation: { ...DEFAULT_PRESENTATION }
  };
}

/**
 * Merge partial view changes into existing view description
 */
export function mergeViewDescription(
  base: ViewDescription,
  changes: Partial<ViewDescription>
): ViewDescription {
  return {
    ...base,
    ...changes,
    filter: changes.filter ? { ...base.filter, ...changes.filter } : base.filter,
    sort: changes.sort ? { ...base.sort, ...changes.sort } : base.sort,
    page: changes.page ? { ...base.page, ...changes.page } : base.page,
    presentation: changes.presentation 
      ? { ...base.presentation, ...changes.presentation } 
      : base.presentation,
    lastUsedAt: new Date().toISOString(),
    useCount: (base.useCount || 0) + 1
  };
}
