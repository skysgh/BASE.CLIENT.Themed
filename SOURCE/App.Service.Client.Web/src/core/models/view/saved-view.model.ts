/**
 * Saved View Model
 * 
 * Represents a user-saved view configuration for a browse/list view.
 * The view captures the complete query state as URL parameters,
 * making it bookmarkable and shareable.
 * 
 * Usage:
 * - MRU (Most Recently Used) view is auto-saved per entity type
 * - Users can explicitly save views with custom names
 * - Views are stored per-user in localStorage (future: per-user in API)
 * 
 * URL Pattern Example:
 * /apps/spike/spikes?q=search&filter=status:eq:active&sort=title:asc&view=tiles&page=1
 */

/**
 * A saved view configuration
 */
export interface SavedView {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Display title (e.g., "Active Spikes", "Recent Items") */
  title: string;
  
  /** Optional description */
  description?: string;
  
  /** Icon class (e.g., "bx bx-filter", "bx bx-star") */
  icon?: string;
  
  /** Entity type this view applies to (e.g., "spike", "faq", "user") */
  entityType: string;
  
  /** 
   * URL query parameters that define this view
   * These are applied when the view is selected
   * 
   * Example:
   * {
   *   q: 'search term',
   *   filter: 'status:eq:active,category:eq:technical',
   *   sort: 'title:asc',
   *   view: 'tiles',
   *   page: '1'
   * }
   */
  urlParams: Record<string, string>;
  
  /** When the view was created */
  createdAt: string;
  
  /** When the view was last modified */
  updatedAt: string;
  
  /** When the view was last used (for MRU tracking) */
  lastUsedAt?: string;
  
  /** Is this the system default view? (cannot be deleted) */
  isDefault?: boolean;
  
  /** Is this the MRU (auto-saved) view? */
  isMru?: boolean;
  
  /** User who created the view (for future multi-user support) */
  createdBy?: string;
  
  /** Is this view shared with others? (future) */
  isShared?: boolean;
}

/**
 * Input for creating a new saved view
 */
export interface CreateSavedViewInput {
  title: string;
  description?: string;
  icon?: string;
  entityType: string;
  urlParams: Record<string, string>;
}

/**
 * Input for updating an existing saved view
 */
export interface UpdateSavedViewInput {
  title?: string;
  description?: string;
  icon?: string;
  urlParams?: Record<string, string>;
}

/**
 * Collection of saved views for an entity type
 */
export interface SavedViewCollection {
  /** Entity type (e.g., "spike") */
  entityType: string;
  
  /** All saved views for this entity */
  views: SavedView[];
  
  /** ID of the default view (shown on first load) */
  defaultViewId?: string;
  
  /** ID of the MRU view (auto-saved) */
  mruViewId?: string;
}

/**
 * Storage format for all saved views
 */
export interface SavedViewStorage {
  /** Version for migration support */
  version: string;
  
  /** Collections keyed by entity type */
  collections: Record<string, SavedViewCollection>;
  
  /** Last updated timestamp */
  updatedAt: string;
}

/**
 * Event emitted when a saved view is selected
 */
export interface SavedViewSelectedEvent {
  view: SavedView;
  source: 'dropdown' | 'mru' | 'default' | 'url';
}

/**
 * Create a new SavedView with generated ID and timestamps
 */
export function createSavedView(input: CreateSavedViewInput): SavedView {
  const now = new Date().toISOString();
  return {
    id: generateViewId(),
    title: input.title,
    description: input.description,
    icon: input.icon || 'bx bx-filter-alt',
    entityType: input.entityType,
    urlParams: { ...input.urlParams },
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create the MRU (Most Recently Used) view for an entity
 */
export function createMruView(entityType: string, urlParams: Record<string, string>): SavedView {
  const now = new Date().toISOString();
  return {
    id: `mru-${entityType}`,
    title: 'Last Used',
    description: 'Automatically saved last view',
    icon: 'bx bx-history',
    entityType,
    urlParams: { ...urlParams },
    createdAt: now,
    updatedAt: now,
    lastUsedAt: now,
    isMru: true,
  };
}

/**
 * Create the default "All Items" view for an entity
 */
export function createDefaultView(entityType: string, title?: string): SavedView {
  const now = new Date().toISOString();
  return {
    id: `default-${entityType}`,
    title: title || 'All Items',
    description: 'Show all items with default sorting',
    icon: 'bx bx-list-ul',
    entityType,
    urlParams: {},
    createdAt: now,
    updatedAt: now,
    isDefault: true,
  };
}

/**
 * Generate a unique view ID
 */
function generateViewId(): string {
  return 'view-' + crypto.randomUUID();
}

/**
 * Extract URL params from current query string
 */
export function extractUrlParams(queryParams: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  
  // Only include non-empty values
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== null && value !== undefined && value !== '') {
      result[key] = String(value);
    }
  }
  
  return result;
}

/**
 * Check if two URL param sets are equivalent
 */
export function areUrlParamsEqual(
  a: Record<string, string>,
  b: Record<string, string>
): boolean {
  const keysA = Object.keys(a).filter(k => a[k]);
  const keysB = Object.keys(b).filter(k => b[k]);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => a[key] === b[key]);
}

/**
 * Get a human-readable summary of a view's filters
 */
export function getViewSummary(view: SavedView): string {
  const parts: string[] = [];
  
  if (view.urlParams['q']) {
    parts.push(`Search: "${view.urlParams['q']}"`);
  }
  
  if (view.urlParams['filter']) {
    const filterCount = view.urlParams['filter'].split(',').length;
    parts.push(`${filterCount} filter${filterCount > 1 ? 's' : ''}`);
  }
  
  if (view.urlParams['sort']) {
    parts.push('Sorted');
  }
  
  if (view.urlParams['view']) {
    parts.push(`${view.urlParams['view']} view`);
  }
  
  return parts.length > 0 ? parts.join(' • ') : 'No filters';
}
