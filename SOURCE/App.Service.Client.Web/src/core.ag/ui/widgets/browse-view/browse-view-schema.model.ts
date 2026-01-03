/**
 * BrowseViewSchema
 * 
 * Schema definition for configuring a BrowseView component.
 * Can be serialized to JSON for storage/transmission.
 * 
 * This allows:
 * - Server-driven UI configuration
 * - Saved/named views
 * - User preferences persistence
 * - Declarative browse view definitions
 * 
 * USAGE:
 * ```html
 * <!-- From object -->
 * <app-browse-view [schema]="mySchema"></app-browse-view>
 * 
 * <!-- From JSON string -->
 * <app-browse-view [serialisedSchema]="jsonFromServer"></app-browse-view>
 * ```
 */

import { FilterCriteria, SortCriteria, FieldDefinition, FieldType, FilterOperator } from '../../../../core/models/query/query-criteria.model';
import { ChartDefinition } from '../../../../core/models/query/chart-definition.model';
import { IColumnDefinition } from '../../../../core/models/presentation/presentation-profile.model';
import { BatchAction } from '../../../../core/models/query/batch-action.model';

// ═══════════════════════════════════════════════════════════════════
// View Mode Types
// ═══════════════════════════════════════════════════════════════════

export type ViewMode = 'cards' | 'tiles' | 'table' | 'list' | 'chart';

// ═══════════════════════════════════════════════════════════════════
// Schema Field Definitions
// ═══════════════════════════════════════════════════════════════════

/**
 * Option for dropdown/reference fields
 * Compatible with FieldDefinition.options
 */
export interface SchemaFieldOption {
  /** Value stored/used (string for compatibility) */
  value: string;
  
  /** Display label */
  label: string;
  
  /** Optional icon */
  icon?: string;
  
  /** Optional description */
  description?: string;
  
  /** Whether this is the default option */
  isDefault?: boolean;
  
  /** Whether this option is disabled */
  disabled?: boolean;
}

/**
 * Extended field definition with current value and dynamic options
 * Extends FieldDefinition for full compatibility
 */
export interface SchemaFieldDefinition extends FieldDefinition {
  /** Current/default value for this field */
  currentValue?: unknown;
  
  /** URL to fetch options dynamically (options[] will be populated from this) */
  optionsUrl?: string;
  
  /** Whether options are currently loading */
  optionsLoading?: boolean;
  
  /** Additional metadata for schema purposes */
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════
// Filter Schema
// ═══════════════════════════════════════════════════════════════════

/**
 * Schema for filter panel configuration
 */
export interface BrowseFilterSchema {
  /** Show/hide filter panel */
  enabled?: boolean;
  
  /** Panel initially expanded */
  expanded?: boolean;
  
  /** Available filter fields */
  fields?: SchemaFieldDefinition[];
  
  /** Current active filters */
  activeFilters?: FilterCriteria[];
  
  /** Maximum number of filters allowed */
  maxFilters?: number;
  
  /** Default filter to apply */
  defaultFilter?: FilterCriteria;
}

// ═══════════════════════════════════════════════════════════════════
// Order/Sort Schema
// ═══════════════════════════════════════════════════════════════════

/**
 * Schema for order panel configuration
 */
export interface BrowseOrderSchema {
  /** Show/hide order panel */
  enabled?: boolean;
  
  /** Panel initially expanded */
  expanded?: boolean;
  
  /** Available sort fields */
  fields?: SchemaFieldDefinition[];
  
  /** Current active sorts */
  activeSorts?: SortCriteria[];
  
  /** Maximum number of sort levels */
  maxSorts?: number;
  
  /** Default sort to apply */
  defaultSort?: SortCriteria;
}

// ═══════════════════════════════════════════════════════════════════
// Display Schema
// ═══════════════════════════════════════════════════════════════════

/**
 * Schema for display/presentation configuration
 */
export interface BrowseDisplaySchema {
  /** Show/hide display panel */
  enabled?: boolean;
  
  /** Available view modes */
  availableModes?: ViewMode[];
  
  /** Current/default view mode */
  defaultMode?: ViewMode;
  
  /** Column definitions for table view */
  columns?: IColumnDefinition[];
  
  /** Chart definitions for chart view */
  charts?: ChartDefinition[];
  
  /** Default chart to show */
  defaultChartId?: string;
  
  /** Cards per row (for cards/tiles) */
  cardsPerRow?: number;
  
  /** Show card images */
  showCardImages?: boolean;
  
  /** Show card badges */
  showCardBadges?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// Search Schema
// ═══════════════════════════════════════════════════════════════════

/**
 * Schema for search configuration
 */
export interface BrowseSearchSchema {
  /** Show/hide search panel */
  enabled?: boolean;
  
  /** Search placeholder text */
  placeholder?: string;
  
  /** i18n resource key for placeholder */
  placeholderKey?: string;
  
  /** Current search query */
  query?: string;
  
  /** Minimum characters before search triggers */
  minLength?: number;
  
  /** Debounce time in ms */
  debounceMs?: number;
  
  /** Fields to search across */
  searchFields?: string[];
}

// ═══════════════════════════════════════════════════════════════════
// Pagination Schema
// ═══════════════════════════════════════════════════════════════════

/**
 * Schema for pagination configuration
 */
export interface BrowsePaginationSchema {
  /** Show/hide pagination */
  enabled?: boolean;
  
  /** Default page size */
  pageSize?: number;
  
  /** Available page size options */
  pageSizeOptions?: number[];
  
  /** Current page (1-based) */
  page?: number;
}

// ═══════════════════════════════════════════════════════════════════
// Actions Schema
// ═══════════════════════════════════════════════════════════════════

/**
 * Schema for batch actions configuration
 */
export interface BrowseActionsSchema {
  /** Show/hide actions bar */
  enabled?: boolean;
  
  /** Available batch actions */
  actions?: BatchAction[];
  
  /** Show selection count */
  showSelectionCount?: boolean;
  
  /** Allow multi-select */
  multiSelect?: boolean;
  
  /** Show "select all" option */
  showSelectAll?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// Empty State Schema
// ═══════════════════════════════════════════════════════════════════

/**
 * Schema for empty state configuration
 */
export interface BrowseEmptyStateSchema {
  /** Empty state message */
  message?: string;
  
  /** i18n resource key for message */
  messageKey?: string;
  
  /** Empty state icon class */
  icon?: string;
  
  /** Show "add new" button */
  showAddButton?: boolean;
  
  /** Add button label */
  addButtonLabel?: string;
  
  /** Add button route */
  addButtonRoute?: string;
}

// ═══════════════════════════════════════════════════════════════════
// Main Schema
// ═══════════════════════════════════════════════════════════════════

/**
 * Complete schema for BrowseView configuration
 * 
 * This schema can be:
 * - Defined in code
 * - Loaded from server API
 * - Stored in user preferences
 * - Serialized to/from JSON
 */
export interface BrowseViewSchema {
  /** Schema version for migrations */
  version?: string;
  
  /** Unique identifier for this schema */
  id?: string;
  
  /** Schema name (for saved views) */
  name?: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Header
  // ─────────────────────────────────────────────────────────────────
  
  /** View title */
  title?: string;
  
  /** i18n resource key for title */
  titleKey?: string;
  
  /** View description */
  description?: string;
  
  /** i18n resource key for description */
  descriptionKey?: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Panels
  // ─────────────────────────────────────────────────────────────────
  
  /** Search panel configuration */
  search?: BrowseSearchSchema;
  
  /** Filter panel configuration */
  filter?: BrowseFilterSchema;
  
  /** Order panel configuration */
  order?: BrowseOrderSchema;
  
  /** Display panel configuration */
  display?: BrowseDisplaySchema;
  
  /** Pagination configuration */
  pagination?: BrowsePaginationSchema;
  
  /** Actions bar configuration */
  actions?: BrowseActionsSchema;
  
  /** Empty state configuration */
  emptyState?: BrowseEmptyStateSchema;
  
  // ─────────────────────────────────────────────────────────────────
  // Data Source
  // ─────────────────────────────────────────────────────────────────
  
  /** 
   * Data source configuration 
   * NOTE: Actual data is still passed via [cards] input
   * This is for metadata only
   */
  dataSource?: {
    /** Entity/record type */
    entityType?: string;
    
    /** API endpoint */
    endpoint?: string;
    
    /** Whether data is read-only */
    readOnly?: boolean;
  };
}

// ═══════════════════════════════════════════════════════════════════
// Schema Helpers
// ═══════════════════════════════════════════════════════════════════

/**
 * Parse a JSON string into a BrowseViewSchema
 */
export function parseBrowseViewSchema(json: string): BrowseViewSchema | null {
  try {
    const parsed = JSON.parse(json);
    return validateBrowseViewSchema(parsed);
  } catch (error) {
    console.error('Failed to parse BrowseViewSchema:', error);
    return null;
  }
}

/**
 * Validate and return a BrowseViewSchema
 * Applies defaults for missing optional fields
 */
export function validateBrowseViewSchema(obj: unknown): BrowseViewSchema | null {
  if (!obj || typeof obj !== 'object') {
    return null;
  }
  
  // For now, just cast and return
  // TODO: Add Zod or similar validation
  return obj as BrowseViewSchema;
}

/**
 * Create a default/empty schema
 */
export function createDefaultBrowseViewSchema(): BrowseViewSchema {
  return {
    version: '1.0',
    search: { enabled: true },
    filter: { enabled: true, fields: [] },
    order: { enabled: true, fields: [] },
    display: { 
      enabled: true, 
      availableModes: ['cards', 'tiles', 'table', 'list', 'chart'],
      defaultMode: 'tiles' 
    },
    pagination: { enabled: true, pageSize: 10 },
    actions: { enabled: true, multiSelect: true },
    emptyState: { 
      message: 'No items found',
      icon: 'bx bx-folder-open' 
    },
  };
}

/**
 * Merge a partial schema with defaults
 */
export function mergeBrowseViewSchema(
  partial: Partial<BrowseViewSchema>
): BrowseViewSchema {
  const defaults = createDefaultBrowseViewSchema();
  
  return {
    ...defaults,
    ...partial,
    search: { ...defaults.search, ...partial.search },
    filter: { ...defaults.filter, ...partial.filter },
    order: { ...defaults.order, ...partial.order },
    display: { ...defaults.display, ...partial.display },
    pagination: { ...defaults.pagination, ...partial.pagination },
    actions: { ...defaults.actions, ...partial.actions },
    emptyState: { ...defaults.emptyState, ...partial.emptyState },
  };
}

/**
 * Serialize a schema to JSON string
 */
export function serializeBrowseViewSchema(schema: BrowseViewSchema): string {
  return JSON.stringify(schema, null, 2);
}
