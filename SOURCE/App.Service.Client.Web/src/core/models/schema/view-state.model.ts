/**
 * ViewState Model
 * 
 * Represents transient, user-specific view state SEPARATE from EntitySchema.
 * 
 * KEY DISTINCTION:
 * - EntitySchema = Definition (stable, versioned, from server/code)
 * - ViewState = User preferences + transient state (personal, can go stale)
 * 
 * ViewState is stored per-user, per-entity, and can be:
 * - Named "saved views" 
 * - User's last used settings
 * - Shared team views
 * 
 * If ViewState references fields/filters that no longer exist in EntitySchema,
 * the invalid references are gracefully ignored (fallback to schema defaults).
 */

import { FilterCriteria, SortCriteria } from '../query/query-criteria.model';
import { ViewMode } from '../../../core.ag/ui/widgets/browse-view/browse-view-schema.model';
import { VersionedSchema, CURRENT_DSL_VERSION } from './schema-version.model';

// ═══════════════════════════════════════════════════════════════════
// View State Types
// ═══════════════════════════════════════════════════════════════════

/**
 * Scope of view state storage
 */
export type ViewStateScope = 
  | 'user'      // Personal to the user
  | 'team'      // Shared with team
  | 'global'    // System-wide default
  | 'session';  // Browser session only (not persisted)

/**
 * Type of view this state applies to
 */
export type ViewStateType = 'browse' | 'edit' | 'add' | 'detail';

// ═══════════════════════════════════════════════════════════════════
// Browse View State
// ═══════════════════════════════════════════════════════════════════

/**
 * State for browse/list views
 */
export interface BrowseViewState {
  /** View mode (cards, tiles, table, etc.) */
  viewMode?: ViewMode;
  
  /** Active filters */
  filters?: FilterCriteria[];
  
  /** Active sorts */
  sorts?: SortCriteria[];
  
  /** Current search query */
  searchQuery?: string;
  
  /** Page size */
  pageSize?: number;
  
  /** Current page (transient, usually not saved) */
  currentPage?: number;
  
  /** Filter panel expanded */
  filtersExpanded?: boolean;
  
  /** Order panel expanded */
  orderExpanded?: boolean;
  
  /** Selected chart ID (for chart view) */
  selectedChartId?: string;
  
  /** Column visibility (for table view) */
  visibleColumns?: string[];
  
  /** Column order (for table view) */
  columnOrder?: string[];
  
  /** Column widths (for table view) */
  columnWidths?: Record<string, number>;
}

// ═══════════════════════════════════════════════════════════════════
// Form View State
// ═══════════════════════════════════════════════════════════════════

/**
 * State for form views (edit, add, detail)
 */
export interface FormViewState {
  /** Active tab */
  activeTab?: string;
  
  /** Collapsed groups */
  collapsedGroups?: string[];
  
  /** Field visibility overrides (user hid optional fields) */
  hiddenFields?: string[];
  
  /** Last draft values (auto-save) */
  draftValues?: Record<string, unknown>;
  
  /** Draft timestamp */
  draftTimestamp?: number;
}

// ═══════════════════════════════════════════════════════════════════
// Combined View State
// ═══════════════════════════════════════════════════════════════════

/**
 * Complete view state for an entity
 */
export interface ViewState extends VersionedSchema {
  // ─────────────────────────────────────────────────────────────────
  // Identity
  // ─────────────────────────────────────────────────────────────────
  
  /** Unique identifier for this saved view */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Description */
  description?: string;
  
  /** Entity type this state applies to */
  entityType: string;
  
  /** View type */
  viewType: ViewStateType;
  
  // ─────────────────────────────────────────────────────────────────
  // Scope & Ownership
  // ─────────────────────────────────────────────────────────────────
  
  /** Storage scope */
  scope: ViewStateScope;
  
  /** Owner user ID (for user scope) */
  ownerId?: string;
  
  /** Team ID (for team scope) */
  teamId?: string;
  
  /** Is this the default view for this scope */
  isDefault?: boolean;
  
  /** Is this pinned/favorite */
  isPinned?: boolean;
  
  // ─────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────
  
  /** Browse view state */
  browse?: BrowseViewState;
  
  /** Form view state */
  form?: FormViewState;
  
  // ─────────────────────────────────────────────────────────────────
  // Timestamps
  // ─────────────────────────────────────────────────────────────────
  
  /** Created timestamp */
  createdAt?: number;
  
  /** Last modified timestamp */
  updatedAt?: number;
  
  /** Last used timestamp */
  lastUsedAt?: number;
  
  /** Usage count */
  useCount?: number;
}

// ═══════════════════════════════════════════════════════════════════
// Quick State (for session/transient storage)
// ═══════════════════════════════════════════════════════════════════

/**
 * Minimal state for quick session storage
 * Used for "remember where I was" functionality
 */
export interface QuickViewState {
  entityType: string;
  viewType: ViewStateType;
  browse?: Partial<BrowseViewState>;
  form?: Partial<FormViewState>;
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════════
// Reconciliation (when schema changes)
// ═══════════════════════════════════════════════════════════════════

/**
 * Result of reconciling ViewState with EntitySchema
 */
export interface ViewStateReconcileResult {
  /** Reconciled state (valid references only) */
  state: ViewState;
  
  /** Fields/filters that were removed (no longer in schema) */
  removed: {
    type: 'filter' | 'sort' | 'column' | 'field';
    id: string;
    reason: string;
  }[];
  
  /** Whether any changes were made */
  wasModified: boolean;
}

/**
 * Reconcile ViewState with current EntitySchema
 * Removes references to fields/filters that no longer exist
 */
export function reconcileViewState(
  state: ViewState,
  validFields: Set<string>
): ViewStateReconcileResult {
  const removed: ViewStateReconcileResult['removed'] = [];
  let wasModified = false;
  
  const reconciled = { ...state };
  
  // Reconcile browse state
  if (reconciled.browse) {
    const browse = { ...reconciled.browse };
    
    // Filters - remove those referencing non-existent fields
    if (browse.filters) {
      const validFilters = browse.filters.filter(f => {
        if (!validFields.has(f.field)) {
          removed.push({ type: 'filter', id: f.id, reason: `Field '${f.field}' no longer exists` });
          wasModified = true;
          return false;
        }
        return true;
      });
      browse.filters = validFilters;
    }
    
    // Sorts - remove those referencing non-existent fields
    if (browse.sorts) {
      const validSorts = browse.sorts.filter(s => {
        if (!validFields.has(s.field)) {
          removed.push({ type: 'sort', id: s.id, reason: `Field '${s.field}' no longer exists` });
          wasModified = true;
          return false;
        }
        return true;
      });
      browse.sorts = validSorts;
    }
    
    // Columns - remove non-existent
    if (browse.visibleColumns) {
      const validColumns = browse.visibleColumns.filter(c => {
        if (!validFields.has(c)) {
          removed.push({ type: 'column', id: c, reason: `Column '${c}' no longer exists` });
          wasModified = true;
          return false;
        }
        return true;
      });
      browse.visibleColumns = validColumns;
    }
    
    reconciled.browse = browse;
  }
  
  // Reconcile form state
  if (reconciled.form) {
    const form = { ...reconciled.form };
    
    // Hidden fields - remove non-existent
    if (form.hiddenFields) {
      const validHidden = form.hiddenFields.filter(f => {
        if (!validFields.has(f)) {
          removed.push({ type: 'field', id: f, reason: `Field '${f}' no longer exists` });
          wasModified = true;
          return false;
        }
        return true;
      });
      form.hiddenFields = validHidden;
    }
    
    // Draft values - remove for non-existent fields
    if (form.draftValues) {
      const validDraft: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(form.draftValues)) {
        if (validFields.has(key)) {
          validDraft[key] = value;
        } else {
          removed.push({ type: 'field', id: key, reason: `Draft field '${key}' no longer exists` });
          wasModified = true;
        }
      }
      form.draftValues = validDraft;
    }
    
    reconciled.form = form;
  }
  
  return {
    state: reconciled,
    removed,
    wasModified,
  };
}

// ═══════════════════════════════════════════════════════════════════
// Factory Functions
// ═══════════════════════════════════════════════════════════════════

/**
 * Create a new ViewState
 */
export function createViewState(
  entityType: string,
  viewType: ViewStateType,
  name: string,
  scope: ViewStateScope = 'user'
): ViewState {
  return {
    dslVersion: CURRENT_DSL_VERSION,
    id: `${entityType}-${viewType}-${Date.now()}`,
    name,
    entityType,
    viewType,
    scope,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    useCount: 0,
  };
}

/**
 * Create a browse view state
 */
export function createBrowseViewState(
  entityType: string,
  name: string,
  browse: BrowseViewState,
  scope: ViewStateScope = 'user'
): ViewState {
  return {
    ...createViewState(entityType, 'browse', name, scope),
    browse,
  };
}

/**
 * Create a QuickViewState for session storage
 */
export function createQuickState(
  entityType: string,
  viewType: ViewStateType,
  state: Partial<BrowseViewState> | Partial<FormViewState>
): QuickViewState {
  return {
    entityType,
    viewType,
    [viewType === 'browse' ? 'browse' : 'form']: state,
    timestamp: Date.now(),
  };
}

// ═══════════════════════════════════════════════════════════════════
// Storage Keys
// ═══════════════════════════════════════════════════════════════════

/**
 * Get storage key for saved views
 */
export function getSavedViewsKey(entityType: string): string {
  return `view-state:saved:${entityType}`;
}

/**
 * Get storage key for quick/session state
 */
export function getQuickStateKey(entityType: string, viewType: ViewStateType): string {
  return `view-state:quick:${entityType}:${viewType}`;
}

/**
 * Get storage key for default view
 */
export function getDefaultViewKey(entityType: string, viewType: ViewStateType): string {
  return `view-state:default:${entityType}:${viewType}`;
}
