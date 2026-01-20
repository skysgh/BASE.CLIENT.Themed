/**
 * Navigation Tree Models
 * 
 * Defines the logical navigation hierarchy for the application.
 * Used by NavigationTreeService for logical parent resolution.
 */

/**
 * A node in the navigation tree
 */
export interface NavigationNode {
  /** Route path segment (e.g., 'support', 'new', ':id') */
  path: string;
  
  /** Full path from root (computed) */
  fullPath?: string;
  
  /** i18n key for the label (e.g., 'BASE.SUPPORT.SINGULAR') */
  labelKey: string;
  
  /** Fallback label if i18n not available */
  labelDefault: string;
  
  /** Icon class (optional) */
  icon?: string;
  
  /** Child nodes */
  children?: NavigationNode[];
  
  /** 
   * Navigation type - affects back behavior
   * - 'hub': Top-level entry point (back goes to system hub)
   * - 'browse': List view (back goes to parent hub)
   * - 'read': Detail view (back goes to browse)
   * - 'add': Create form (cancel goes to browse/parent)
   * - 'edit': Edit form (cancel goes to read/parent)
   * - 'delete': Delete confirmation (cancel goes to read)
   */
  navType?: 'hub' | 'browse' | 'read' | 'add' | 'edit' | 'delete';
}

/**
 * Navigation context for current page
 */
export interface NavigationContext {
  /** Current path */
  currentPath: string;
  
  /** Current node in tree (if found) */
  currentNode?: NavigationNode;
  
  /** Logical parent node */
  parentNode?: NavigationNode;
  
  /** Path to logical parent */
  parentPath?: string;
  
  /** Label key for parent (for i18n) */
  parentLabelKey?: string;
  
  /** Default parent label */
  parentLabelDefault?: string;
  
  /** Where user actually came from (historical) */
  historicalPrevious?: string;
  
  /** Is current location a hyperjump? (historical != logical parent) */
  isHyperjumped: boolean;
}

/**
 * Navigation entry in history stack
 */
export interface NavigationEntry {
  path: string;
  timestamp: number;
  title?: string;
}

/**
 * Breadcrumb item for display
 */
export interface BreadcrumbItem {
  /** Display label (translated if possible) */
  label: string;
  
  /** i18n key for translation */
  labelKey?: string;
  
  /** Route path to navigate to */
  path: string;
  
  /** Icon class (optional) */
  icon?: string;
  
  /** Is this the current/active item? */
  active: boolean;
}
