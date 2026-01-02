/**
 * Query Criteria Models
 * 
 * Models for dynamic filtering and sorting in BrowseView.
 * These are serialized to URL query params for bookmarkability.
 * 
 * URL Format:
 * ?filter=category:eq:technical,status:in:active|pending&sort=title:asc,modified:desc
 */

// ─────────────────────────────────────────────────────────────────────────────
// FILTER CRITERIA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filter operators by field type
 */
export type TextOperator = 'eq' | 'ne' | 'contains' | 'startsWith' | 'endsWith';
export type NumberOperator = 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'between';
export type DateOperator = 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'between';
export type SelectOperator = 'eq' | 'ne' | 'in' | 'notIn';
export type BooleanOperator = 'eq';

export type FilterOperator = TextOperator | NumberOperator | DateOperator | SelectOperator | BooleanOperator;

/**
 * Field types for determining available operators
 */
export type FieldType = 'text' | 'number' | 'date' | 'datetime' | 'select' | 'multiselect' | 'boolean';

/**
 * Operator metadata for UI display
 */
export interface OperatorInfo {
  id: FilterOperator;
  label: string;
  requiresValue: boolean;
  requiresSecondValue?: boolean; // for 'between'
}

/**
 * Operators by field type
 */
export const OPERATORS_BY_TYPE: Record<FieldType, OperatorInfo[]> = {
  text: [
    { id: 'eq', label: 'equals', requiresValue: true },
    { id: 'ne', label: 'not equals', requiresValue: true },
    { id: 'contains', label: 'contains', requiresValue: true },
    { id: 'startsWith', label: 'starts with', requiresValue: true },
    { id: 'endsWith', label: 'ends with', requiresValue: true },
  ],
  number: [
    { id: 'eq', label: '=', requiresValue: true },
    { id: 'ne', label: '≠', requiresValue: true },
    { id: 'lt', label: '<', requiresValue: true },
    { id: 'lte', label: '≤', requiresValue: true },
    { id: 'gt', label: '>', requiresValue: true },
    { id: 'gte', label: '≥', requiresValue: true },
    { id: 'between', label: 'between', requiresValue: true, requiresSecondValue: true },
  ],
  date: [
    { id: 'eq', label: 'is', requiresValue: true },
    { id: 'ne', label: 'is not', requiresValue: true },
    { id: 'lt', label: 'before', requiresValue: true },
    { id: 'gt', label: 'after', requiresValue: true },
    { id: 'between', label: 'between', requiresValue: true, requiresSecondValue: true },
  ],
  datetime: [
    { id: 'eq', label: 'is', requiresValue: true },
    { id: 'ne', label: 'is not', requiresValue: true },
    { id: 'lt', label: 'before', requiresValue: true },
    { id: 'gt', label: 'after', requiresValue: true },
    { id: 'between', label: 'between', requiresValue: true, requiresSecondValue: true },
  ],
  select: [
    { id: 'eq', label: 'is', requiresValue: true },
    { id: 'ne', label: 'is not', requiresValue: true },
    { id: 'in', label: 'is any of', requiresValue: true },
    { id: 'notIn', label: 'is not any of', requiresValue: true },
  ],
  multiselect: [
    { id: 'in', label: 'includes any of', requiresValue: true },
    { id: 'notIn', label: 'excludes all of', requiresValue: true },
  ],
  boolean: [
    { id: 'eq', label: 'is', requiresValue: true },
  ],
};

/**
 * Field definition for filter/sort configuration
 */
export interface FieldDefinition {
  /** Field key (matches data property) */
  field: string;
  /** Display label */
  label: string;
  /** Field type (determines operators and value input) */
  type: FieldType;
  /** Icon for display */
  icon?: string;
  /** Available options (for select/multiselect) */
  options?: Array<{ value: string; label: string }>;
  /** Is field sortable? */
  sortable?: boolean;
  /** Is field filterable? */
  filterable?: boolean;
  /** Default operator */
  defaultOperator?: FilterOperator;
}

/**
 * A single filter criterion
 */
export interface FilterCriteria {
  /** Unique ID for tracking in UI */
  id: string;
  /** Field to filter on */
  field: string;
  /** Operator */
  operator: FilterOperator;
  /** Primary value */
  value: any;
  /** Secondary value (for 'between') */
  value2?: any;
}

/**
 * Create a new filter criterion with generated ID
 */
export function createFilterCriteria(
  field: string,
  operator: FilterOperator = 'eq',
  value: any = ''
): FilterCriteria {
  return {
    id: generateId(),
    field,
    operator,
    value,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SORT CRITERIA
// ─────────────────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

/**
 * A single sort criterion
 */
export interface SortCriteria {
  /** Unique ID for tracking in UI */
  id: string;
  /** Field to sort by */
  field: string;
  /** Sort direction */
  direction: SortDirection;
}

/**
 * Create a new sort criterion with generated ID
 */
export function createSortCriteria(
  field: string,
  direction: SortDirection = 'asc'
): SortCriteria {
  return {
    id: generateId(),
    field,
    direction,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// QUERY STATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Complete query state for BrowseView
 */
export interface QueryState {
  /** Search text (full-text search) */
  search: string;
  /** Filter criteria */
  filters: FilterCriteria[];
  /** Sort criteria (ordered) */
  sorts: SortCriteria[];
  /** Current page (1-based) */
  page: number;
  /** Items per page */
  pageSize: number;
}

/**
 * Create default query state
 */
export function createDefaultQueryState(): QueryState {
  return {
    search: '',
    filters: [],
    sorts: [],
    page: 1,
    pageSize: 20,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// URL SERIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Serialize filters to URL format
 * Format: field:operator:value,field:operator:value
 * Multi-value: field:in:val1|val2|val3
 * Between: field:between:val1|val2
 */
export function serializeFilters(filters: FilterCriteria[]): string | null {
  if (filters.length === 0) return null;
  
  return filters.map(f => {
    let valueStr = Array.isArray(f.value) 
      ? f.value.join('|') 
      : String(f.value);
    
    if (f.value2 !== undefined) {
      valueStr += '|' + String(f.value2);
    }
    
    return `${f.field}:${f.operator}:${encodeURIComponent(valueStr)}`;
  }).join(',');
}

/**
 * Deserialize filters from URL format
 */
export function deserializeFilters(str: string | null): FilterCriteria[] {
  if (!str) return [];
  
  return str.split(',').map(part => {
    const [field, operator, valueStr] = part.split(':');
    const decodedValue = decodeURIComponent(valueStr || '');
    const values = decodedValue.split('|');
    
    const criteria = createFilterCriteria(field, operator as FilterOperator, values[0]);
    
    if (values.length > 1) {
      if (operator === 'between') {
        criteria.value2 = values[1];
      } else {
        criteria.value = values;
      }
    }
    
    return criteria;
  });
}

/**
 * Serialize sorts to URL format
 * Format: field:direction,field:direction
 */
export function serializeSorts(sorts: SortCriteria[]): string | null {
  if (sorts.length === 0) return null;
  return sorts.map(s => `${s.field}:${s.direction}`).join(',');
}

/**
 * Deserialize sorts from URL format
 */
export function deserializeSorts(str: string | null): SortCriteria[] {
  if (!str) return [];
  
  return str.split(',').map(part => {
    const [field, direction] = part.split(':');
    return createSortCriteria(field, direction as SortDirection);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Get operators for a field type
 */
export function getOperatorsForType(type: FieldType): OperatorInfo[] {
  return OPERATORS_BY_TYPE[type] || OPERATORS_BY_TYPE.text;
}

/**
 * Get operator label
 */
export function getOperatorLabel(operator: FilterOperator, type: FieldType): string {
  const operators = getOperatorsForType(type);
  const info = operators.find(o => o.id === operator);
  return info?.label || operator;
}

/**
 * Format filter for display (read mode)
 * Text values are wrapped in quotes for clarity
 */
export function formatFilterForDisplay(
  filter: FilterCriteria,
  fieldDef?: FieldDefinition
): string {
  const fieldLabel = fieldDef?.label || filter.field;
  const operatorLabel = getOperatorLabel(filter.operator, fieldDef?.type || 'text');
  const fieldType = fieldDef?.type || 'text';
  
  let valueLabel = filter.value;
  
  // Look up option label if available (for select types)
  if (fieldDef?.options && !Array.isArray(filter.value)) {
    const option = fieldDef.options.find(o => o.value === filter.value);
    if (option) valueLabel = option.label;
  }
  
  // Quote text values
  const shouldQuote = fieldType === 'text' && typeof valueLabel === 'string';
  const formatValue = (val: any) => shouldQuote ? `"${val}"` : val;
  
  if (filter.operator === 'between') {
    return `${fieldLabel} ${operatorLabel} ${formatValue(valueLabel)} and ${formatValue(filter.value2)}`;
  }
  
  if (Array.isArray(filter.value)) {
    const quotedValues = filter.value.map(v => formatValue(v)).join(', ');
    return `${fieldLabel} ${operatorLabel} [${quotedValues}]`;
  }
  
  return `${fieldLabel} ${operatorLabel} ${formatValue(valueLabel)}`;
}

/**
 * Format sort for display (read mode)
 */
export function formatSortForDisplay(
  sort: SortCriteria,
  fieldDef?: FieldDefinition
): string {
  const fieldLabel = fieldDef?.label || sort.field;
  const dirLabel = sort.direction === 'asc' ? 'A→Z' : 'Z→A';
  return `${fieldLabel} (${dirLabel})`;
}
