/**
 * OptionsSource DSL Model
 * 
 * Defines how to load options for select/dropdown fields.
 * Supports:
 * - Static inline options
 * - API-driven dynamic options
 * - Named resolver escape hatch for complex logic
 * - Caching and dependency tracking
 * 
 * USAGE IN SCHEMA:
 * ```json
 * {
 *   "field": "categoryId",
 *   "type": "select",
 *   "optionsSource": {
 *     "api": {
 *       "endpoint": "/api/categories",
 *       "valueField": "id",
 *       "labelField": "name",
 *       "filter": "active == true"
 *     }
 *   }
 * }
 * ```
 */

// ═══════════════════════════════════════════════════════════════════
// Field Option (the result)
// ═══════════════════════════════════════════════════════════════════

/**
 * A single option for a select/dropdown field
 */
export interface FieldOption {
  /** Value to store/submit */
  value: string;
  
  /** Display label */
  label: string;
  
  /** Optional icon class */
  icon?: string;
  
  /** Optional description/subtitle */
  description?: string;
  
  /** Optional badge/tag */
  badge?: string;
  
  /** Badge color variant */
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Whether this option is disabled */
  disabled?: boolean;
  
  /** Whether this is the default option */
  isDefault?: boolean;
  
  /** Optional grouping key */
  group?: string;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════
// API Source Definition
// ═══════════════════════════════════════════════════════════════════

/**
 * Configuration for loading options from an API endpoint
 */
export interface ApiOptionsSource {
  /** API endpoint URL (can include ${field} placeholders) */
  endpoint: string;
  
  /** HTTP method (default: GET) */
  method?: 'GET' | 'POST';
  
  /** Field in response to use as option value */
  valueField: string;
  
  /** Field in response to use as option label */
  labelField: string;
  
  /** Optional field for icon */
  iconField?: string;
  
  /** Optional field for description */
  descriptionField?: string;
  
  /** Optional field for badge */
  badgeField?: string;
  
  /** Optional field for grouping */
  groupField?: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Filtering & Sorting
  // ─────────────────────────────────────────────────────────────────
  
  /** 
   * Simple filter expression
   * Format: "fieldName operator value"
   * Examples:
   * - "active == true"
   * - "type == 'category'"
   * - "parentId != null"
   */
  filter?: string;
  
  /**
   * Sort expression
   * Format: "fieldName:direction"
   * Examples:
   * - "name:asc"
   * - "order:asc,name:asc"
   */
  sort?: string;
  
  /** Static query params to include */
  params?: Record<string, string | number | boolean>;
  
  // ─────────────────────────────────────────────────────────────────
  // Response Mapping
  // ─────────────────────────────────────────────────────────────────
  
  /** 
   * Path to array in response (dot notation)
   * Examples:
   * - "data" (response.data)
   * - "results.items" (response.results.items)
   * - "" or undefined = response is the array
   */
  responsePath?: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Dependencies & Reactivity
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Fields this lookup depends on
   * When any of these change, options are reloaded
   * The field values are available as ${fieldName} in endpoint
   */
  dependsOn?: string[];
  
  /**
   * Condition for when to load options
   * If not met, returns empty array
   * Format: "fieldName operator value"
   * Examples:
   * - "parentId != null"
   * - "type == 'category'"
   */
  loadWhen?: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Caching
  // ─────────────────────────────────────────────────────────────────
  
  /** 
   * Cache key for storing loaded options
   * If not set, caching is disabled for this source
   */
  cacheKey?: string;
  
  /** Cache TTL in seconds (default: 300 = 5 minutes) */
  cacheTtl?: number;
  
  /** 
   * Cache scope
   * - 'global': Shared across all forms/views
   * - 'entity': Per entity type
   * - 'instance': Per form instance (no caching effectively)
   */
  cacheScope?: 'global' | 'entity' | 'instance';
}

// ═══════════════════════════════════════════════════════════════════
// Resolver Source Definition
// ═══════════════════════════════════════════════════════════════════

/**
 * Configuration for loading options via a named resolver
 * Use for complex logic that can't be expressed in API config
 */
export interface ResolverOptionsSource {
  /** Name of registered resolver */
  resolver: string;
  
  /** Parameters to pass to resolver */
  params?: Record<string, unknown>;
  
  /** Fields this resolver depends on (for reactivity) */
  dependsOn?: string[];
  
  /** Cache key (if resolver supports caching) */
  cacheKey?: string;
}

// ═══════════════════════════════════════════════════════════════════
// Combined OptionsSource
// ═══════════════════════════════════════════════════════════════════

/**
 * Complete options source definition
 * Exactly one of: options, api, or resolver should be set
 */
export interface OptionsSource {
  // ─────────────────────────────────────────────────────────────────
  // Static Options
  // ─────────────────────────────────────────────────────────────────
  
  /** Inline static options */
  options?: FieldOption[];
  
  // ─────────────────────────────────────────────────────────────────
  // API-driven Options
  // ─────────────────────────────────────────────────────────────────
  
  /** Load options from API */
  api?: ApiOptionsSource;
  
  // ─────────────────────────────────────────────────────────────────
  // Resolver (escape hatch)
  // ─────────────────────────────────────────────────────────────────
  
  /** Load options via named resolver */
  resolver?: ResolverOptionsSource;
  
  // ─────────────────────────────────────────────────────────────────
  // Common Options
  // ─────────────────────────────────────────────────────────────────
  
  /** Include an empty/null option at the start */
  includeEmpty?: boolean;
  
  /** Label for empty option (default: "Select...") */
  emptyLabel?: string;
  
  /** Value for empty option (default: "") */
  emptyValue?: string;
  
  /** Minimum characters before searching (for autocomplete) */
  minSearchLength?: number;
  
  /** Debounce time for search in ms (default: 300) */
  searchDebounceMs?: number;
}

// ═══════════════════════════════════════════════════════════════════
// Loading Context
// ═══════════════════════════════════════════════════════════════════

/**
 * Context passed to options loader
 * Contains current form values for dependency resolution
 */
export interface OptionsLoadContext {
  /** Current form/entity values */
  formValues: Record<string, unknown>;
  
  /** Entity type being edited */
  entityType?: string;
  
  /** Entity ID (for edit mode) */
  entityId?: string;
  
  /** Search query (for autocomplete) */
  searchQuery?: string;
  
  /** Additional context */
  extra?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════
// Resolver Interface
// ═══════════════════════════════════════════════════════════════════

import { Observable } from 'rxjs';

/**
 * Interface for custom options resolvers
 * Implement this for complex lookup logic
 */
export interface OptionsResolver {
  /** Resolver name (for registration) */
  readonly name: string;
  
  /** Load options */
  resolve(
    params: Record<string, unknown> | undefined,
    context: OptionsLoadContext
  ): Observable<FieldOption[]>;
}

// ═══════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════

/**
 * Check if OptionsSource has any source defined
 */
export function hasOptionsSource(source: OptionsSource | undefined): boolean {
  if (!source) return false;
  return !!(source.options || source.api || source.resolver);
}

/**
 * Check if OptionsSource is static (no API/resolver)
 */
export function isStaticOptionsSource(source: OptionsSource | undefined): boolean {
  if (!source) return false;
  return !!source.options && !source.api && !source.resolver;
}

/**
 * Check if OptionsSource requires loading
 */
export function isDynamicOptionsSource(source: OptionsSource | undefined): boolean {
  if (!source) return false;
  return !!(source.api || source.resolver);
}

/**
 * Get dependency fields from OptionsSource
 */
export function getOptionsDependencies(source: OptionsSource | undefined): string[] {
  if (!source) return [];
  if (source.api?.dependsOn) return source.api.dependsOn;
  if (source.resolver?.dependsOn) return source.resolver.dependsOn;
  return [];
}

/**
 * Create a simple static OptionsSource from an array
 */
export function createStaticOptionsSource(
  options: Array<{ value: string; label: string }>
): OptionsSource {
  return { options };
}

/**
 * Create an API-driven OptionsSource
 */
export function createApiOptionsSource(
  endpoint: string,
  valueField: string = 'id',
  labelField: string = 'name'
): OptionsSource {
  return {
    api: {
      endpoint,
      valueField,
      labelField,
    },
  };
}
