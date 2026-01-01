/**
 * Presentation Profile Models
 * 
 * Captures user's preferred way to VIEW data:
 * - Which columns/fields to show (and in what order)
 * - How to filter data
 * - How to sort data
 * - Pagination preferences
 * 
 * ARCHITECTURE:
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                  PRESENTATION PROFILE                          │
 * │  (How the user wants to see data)                              │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  columns[]     - What fields to show, in what order            │
 * │  filters[]     - Pre-set filter constraints                    │
 * │  sorting[]     - Default sort order                            │
 * │  pagination    - Page size, infinite vs paged                  │
 * │  rendering     - Cards vs table vs chart                       │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * USAGE:
 * - System profiles (admin-defined, shared with all)
 * - User profiles (user-defined, private)
 * - Per-entity-type profiles (different views for Users vs Orders)
 */

// ─────────────────────────────────────────────────────────────────────────────
// COLUMN DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cell/Column data types for rendering
 */
export type CellType = 
  | 'text'       // Plain text
  | 'number'     // Formatted number
  | 'money'      // Currency formatted
  | 'date'       // Localized date
  | 'datetime'   // Localized date + time
  | 'time'       // Localized time only
  | 'badge'      // Status chip/badge
  | 'spark'      // Mini sparkline chart
  | 'progress'   // Progress bar
  | 'avatar'     // Small image/initials
  | 'link'       // Clickable URL
  | 'boolean'    // Yes/No, Check/X
  | 'tags'       // Array of tags
  | 'rating'     // Star rating
  | 'custom';    // Custom renderer

/**
 * Badge/status variant colors
 */
export type BadgeVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info' 
  | 'neutral'
  | 'light'
  | 'dark';

/**
 * Column definition for table/card display
 */
export interface IColumnDefinition {
  /** Field path in entity (supports dot notation: 'address.city') */
  field: string;
  
  /** Display label */
  label: string;
  
  /** Cell type for rendering */
  type: CellType;
  
  /** Column width (CSS value: '150px', '20%', 'auto') */
  width?: string;
  
  /** Is this column sortable? */
  sortable?: boolean;
  
  /** Is this column filterable? */
  filterable?: boolean;
  
  /** Is this column visible? (for column toggle) */
  visible?: boolean;
  
  /** Sort order when multiple columns selected */
  sortOrder?: number;
  
  // Type-specific options
  
  /** For 'badge' type: variant mapping (value → variant) */
  badgeMapping?: Record<string, BadgeVariant>;
  
  /** For 'money' type: currency code */
  currency?: string;
  
  /** For 'date/datetime' type: format string */
  dateFormat?: string;
  
  /** For 'number' type: decimal places */
  decimalPlaces?: number;
  
  /** For 'progress' type: max value */
  progressMax?: number;
  
  /** For 'spark' type: data path for array */
  sparkDataPath?: string;
  
  /** For 'link' type: URL template with {field} placeholders */
  linkTemplate?: string;
  
  /** For 'custom' type: component/template ID */
  customRenderer?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filter operators
 */
export type FilterOperator = 
  | 'eq'         // Equals
  | 'neq'        // Not equals
  | 'gt'         // Greater than
  | 'gte'        // Greater than or equal
  | 'lt'         // Less than
  | 'lte'        // Less than or equal
  | 'contains'   // String contains
  | 'startsWith' // String starts with
  | 'endsWith'   // String ends with
  | 'in'         // In array
  | 'notIn'      // Not in array
  | 'between'    // Between two values
  | 'isNull'     // Is null/undefined
  | 'isNotNull'; // Is not null/undefined

/**
 * Filter constraint
 */
export interface IFilterConstraint {
  /** Field path to filter on */
  field: string;
  
  /** Filter operator */
  operator: FilterOperator;
  
  /** Filter value (type depends on operator) */
  value: unknown;
  
  /** Second value for 'between' operator */
  valueTo?: unknown;
  
  /** Is this filter active? */
  active?: boolean;
  
  /** Display label for this filter (for summary display) */
  label?: string;
}

/**
 * Filter group (for AND/OR logic)
 */
export interface IFilterGroup {
  /** How to combine filters in this group */
  logic: 'and' | 'or';
  
  /** Filters in this group */
  filters: IFilterConstraint[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SORTING DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort specification
 */
export interface ISortSpec {
  /** Field to sort by */
  field: string;
  
  /** Sort direction */
  direction: SortDirection;
  
  /** Sort priority (for multi-column sort) */
  priority?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pagination mode
 */
export type PaginationMode = 'paged' | 'infinite' | 'hybrid';

/**
 * Pagination configuration
 */
export interface IPaginationConfig {
  /** Pagination mode */
  mode: PaginationMode;
  
  /** Items per page */
  pageSize: number;
  
  /** Available page size options */
  pageSizeOptions?: number[];
  
  /** For hybrid mode: behavior on touch devices */
  touchMode?: 'infinite' | 'paged';
  
  /** For hybrid mode: behavior on desktop */
  desktopMode?: 'infinite' | 'paged';
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDERING DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rendering mode (how to display the data)
 */
export type RenderingMode = 'cards' | 'table' | 'list' | 'chart';

/**
 * Rendering configuration
 */
export interface IRenderingConfig {
  /** Current rendering mode */
  mode: RenderingMode;
  
  /** For 'cards': cards per row (responsive) */
  cardsPerRow?: { sm: number; md: number; lg: number; xl: number };
  
  /** For 'table': compact vs comfortable spacing */
  tableSpacing?: 'compact' | 'comfortable' | 'spacious';
  
  /** For 'chart': chart type */
  chartType?: 'bar' | 'line' | 'pie' | 'donut';
  
  /** For 'chart': field to group by */
  chartGroupBy?: string;
  
  /** For 'chart': field to aggregate */
  chartValueField?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRESENTATION PROFILE (THE MAIN MODEL)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Profile scope
 */
export type ProfileScope = 
  | 'system'   // Admin-defined, shared with all users
  | 'account'  // Account-specific, shared with account members
  | 'user';    // User-defined, private

/**
 * Presentation Profile
 * 
 * Complete specification for how to display a list of entities.
 * Can be saved, shared, and applied per entity type.
 */
export interface IPresentationProfile {
  /** Unique identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Description */
  description?: string;
  
  /** Entity type this profile applies to (e.g., 'user', 'order', '*' for all) */
  entityType: string;
  
  /** Profile scope */
  scope: ProfileScope;
  
  /** Owner ID (userId for 'user' scope, accountId for 'account' scope) */
  ownerId?: string;
  
  /** Is this the default profile for the entity type? */
  isDefault?: boolean;
  
  // ─────────────────────────────────────────────────────────────
  // Columns (what to show)
  // ─────────────────────────────────────────────────────────────
  
  /** Column definitions (order matters) */
  columns: IColumnDefinition[];
  
  // ─────────────────────────────────────────────────────────────
  // Filtering (what subset)
  // ─────────────────────────────────────────────────────────────
  
  /** Pre-set filters */
  filters?: IFilterGroup;
  
  /** Quick filters (shown in UI for easy toggle) */
  quickFilters?: IFilterConstraint[];
  
  // ─────────────────────────────────────────────────────────────
  // Sorting (what order)
  // ─────────────────────────────────────────────────────────────
  
  /** Default sort */
  defaultSort?: ISortSpec[];
  
  // ─────────────────────────────────────────────────────────────
  // Pagination
  // ─────────────────────────────────────────────────────────────
  
  /** Pagination config */
  pagination?: IPaginationConfig;
  
  // ─────────────────────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────────────────────
  
  /** Rendering config */
  rendering?: IRenderingConfig;
  
  // ─────────────────────────────────────────────────────────────
  // Metadata
  // ─────────────────────────────────────────────────────────────
  
  /** Created timestamp */
  createdAt?: string;
  
  /** Updated timestamp */
  updatedAt?: string;
  
  /** Is this profile shared/public? */
  isShared?: boolean;
  
  /** Users this profile is shared with (for 'user' scope) */
  sharedWithUserIds?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// FACTORY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a default presentation profile
 */
export function createDefaultProfile(entityType: string, name: string = 'Default'): IPresentationProfile {
  return {
    id: `${entityType}-default`,
    name,
    entityType,
    scope: 'user',
    isDefault: true,
    columns: [],
    pagination: {
      mode: 'hybrid',
      pageSize: 25,
      pageSizeOptions: [10, 25, 50, 100],
      touchMode: 'infinite',
      desktopMode: 'paged',
    },
    rendering: {
      mode: 'cards',
      cardsPerRow: { sm: 1, md: 2, lg: 3, xl: 4 },
    },
  };
}

/**
 * Create a column definition
 */
export function createColumn(
  field: string, 
  label: string, 
  type: CellType = 'text',
  options?: Partial<IColumnDefinition>
): IColumnDefinition {
  return {
    field,
    label,
    type,
    visible: true,
    sortable: true,
    filterable: true,
    ...options,
  };
}

/**
 * Create a filter constraint
 */
export function createFilter(
  field: string,
  operator: FilterOperator,
  value: unknown,
  options?: Partial<IFilterConstraint>
): IFilterConstraint {
  return {
    field,
    operator,
    value,
    active: true,
    ...options,
  };
}
