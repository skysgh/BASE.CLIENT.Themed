/**
 * Reference Item Models
 * 
 * Extends the traditional {text, value} dropdown pattern to support:
 * - Rich card-based display (icons, badges, descriptions)
 * - Enabled/disabled states with explanations
 * - Categorization and grouping
 * - Multi-field display in selection summary
 * 
 * ARCHITECTURE:
 * 
 * Traditional Dropdown:
 * ┌─────────────────────────────┐
 * │ { text: "USA", value: "US" }│
 * └─────────────────────────────┘
 * 
 * Reference Item:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ {                                                              │
 * │   value: "US",                                                 │
 * │   enabled: true,                                               │
 * │   card: {                                                      │
 * │     id: "US",                                                  │
 * │     title: "United States",                                    │
 * │     subtitle: "North America",                                 │
 * │     icon: "flag-us",                                          │
 * │     status: { label: "Available", variant: "success" },       │
 * │     cells: [ { label: "Code", value: "+1" } ]                 │
 * │   }                                                            │
 * │ }                                                              │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * USAGE:
 * ```typescript
 * const countries: IReferenceItem<string>[] = [
 *   { value: 'US', enabled: true, card: usCard },
 *   { value: 'CU', enabled: false, disabledReason: 'Embargoed', card: cubaCard },
 * ];
 * ```
 */

import { IUniversalCardData } from './universal-card.model';

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE ITEM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reference Item
 * 
 * A selectable item with rich display capabilities.
 * Generic type T is the value type (string, number, object, etc.)
 */
export interface IReferenceItem<T = unknown> {
  /**
   * The actual value (what gets stored when selected)
   * This is the "value" in traditional dropdown terms
   */
  value: T;
  
  /**
   * Whether this item can be selected
   * Disabled items are shown but struck-through/greyed
   */
  enabled: boolean;
  
  /**
   * Reason why item is disabled (shown as tooltip)
   * Only relevant when enabled = false
   */
  disabledReason?: string;
  
  /**
   * Rich display data for the item
   * Uses the Universal Card format for consistent rendering
   */
  card: IUniversalCardData;
  
  /**
   * Optional group/category for grouping items
   * Items with same group are shown together
   */
  group?: string;
  
  /**
   * Sort order within group (lower = first)
   */
  order?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE ITEM GROUP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reference Item Group
 * 
 * Groups related items under a heading
 */
export interface IReferenceItemGroup<T = unknown> {
  /**
   * Group identifier
   */
  id: string;
  
  /**
   * Group display name
   */
  label: string;
  
  /**
   * Optional icon for group header
   */
  icon?: string;
  
  /**
   * Items in this group
   */
  items: IReferenceItem<T>[];
  
  /**
   * Is group collapsed?
   */
  collapsed?: boolean;
  
  /**
   * Sort order (lower = first)
   */
  order?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SELECTION STATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Selection mode
 */
export type SelectionMode = 'single' | 'multi';

/**
 * Selection state for drill-selector
 */
export interface ISelectionState<T = unknown> {
  /**
   * Currently selected values
   * Single mode: array with 0-1 items
   * Multi mode: array with 0-N items
   */
  selectedValues: T[];
  
  /**
   * Reference items for selected values (for display)
   */
  selectedItems: IReferenceItem<T>[];
  
  /**
   * Selection mode
   */
  mode: SelectionMode;
  
  /**
   * Is selection required? (cannot deselect last item)
   */
  required: boolean;
  
  /**
   * Minimum selections (for multi mode)
   */
  minSelection?: number;
  
  /**
   * Maximum selections (for multi mode)
   */
  maxSelection?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// FACTORY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a reference item from value and display text
 * Simple factory for basic use cases
 */
export function createReferenceItem<T>(
  value: T,
  title: string,
  options?: {
    subtitle?: string;
    icon?: string;
    enabled?: boolean;
    disabledReason?: string;
    group?: string;
  }
): IReferenceItem<T> {
  const enabled = options?.enabled !== false;
  
  return {
    value,
    enabled,
    disabledReason: options?.disabledReason,
    group: options?.group,
    card: {
      id: String(value),
      entityType: 'reference',
      title,
      subtitle: options?.subtitle,
      icon: options?.icon,
      payload: { value },
      cells: [],
      selectable: enabled,
    }
  };
}

/**
 * Create multiple reference items from simple array
 */
export function createReferenceItems<T extends string | number>(
  items: Array<{ value: T; text: string; disabled?: boolean; disabledReason?: string }>
): IReferenceItem<T>[] {
  return items.map(item => createReferenceItem(
    item.value,
    item.text,
    { enabled: !item.disabled, disabledReason: item.disabledReason }
  ));
}

/**
 * Group reference items by their group property
 */
export function groupReferenceItems<T>(
  items: IReferenceItem<T>[],
  defaultGroupLabel: string = 'Other'
): IReferenceItemGroup<T>[] {
  const groups = new Map<string, IReferenceItem<T>[]>();
  
  // Group items
  for (const item of items) {
    const groupId = item.group || '__default__';
    if (!groups.has(groupId)) {
      groups.set(groupId, []);
    }
    groups.get(groupId)!.push(item);
  }
  
  // Convert to array
  const result: IReferenceItemGroup<T>[] = [];
  for (const [groupId, groupItems] of groups) {
    result.push({
      id: groupId,
      label: groupId === '__default__' ? defaultGroupLabel : groupId,
      items: groupItems.sort((a, b) => (a.order || 0) - (b.order || 0)),
    });
  }
  
  return result.sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Find reference item by value
 */
export function findReferenceItem<T>(
  items: IReferenceItem<T>[],
  value: T
): IReferenceItem<T> | undefined {
  return items.find(item => item.value === value);
}

/**
 * Get selected items from values
 */
export function getSelectedItems<T>(
  items: IReferenceItem<T>[],
  values: T[]
): IReferenceItem<T>[] {
  return values
    .map(v => findReferenceItem(items, v))
    .filter((item): item is IReferenceItem<T> => item !== undefined);
}
