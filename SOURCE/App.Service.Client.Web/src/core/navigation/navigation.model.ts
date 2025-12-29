/**
 * Navigation Data Models
 * 
 * Theme-agnostic navigation data structures.
 * These models are the "canonical" format - themes adapt FROM this.
 * 
 * WHY:
 * - Different themes need different menu data shapes
 * - Some themes need icons, others don't
 * - Some themes support deep nesting, others don't
 * - Having a canonical format allows any theme to adapt
 */

/**
 * Navigation Item - Canonical Format
 * 
 * This is the "rich" format that contains ALL possible properties.
 * Theme adapters will transform this to their specific format.
 */
export interface NavigationItem {
  /** Unique identifier */
  id: string;
  /** Display label (can be i18n key) */
  label: string;
  /** Description for tooltips/accessibility */
  description?: string;
  /** Icon identifier (theme-neutral, e.g., 'home' not 'bx-home') */
  icon?: string;
  /** Badge text (e.g., "New", "3") */
  badge?: string;
  /** Badge color/variant */
  badgeVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Route path */
  route?: string;
  /** External URL (opens in new tab) */
  externalUrl?: string;
  /** Child items */
  children?: NavigationItem[];
  /** Is this a section header/title only? */
  isTitle?: boolean;
  /** Is this item disabled? */
  disabled?: boolean;
  /** Is this item hidden? */
  hidden?: boolean;
  /** Sort order */
  order?: number;
  /** Required permission to view */
  permission?: string;
  /** Required feature flag */
  featureFlag?: string;
  /** Accessibility label (for screen readers) */
  ariaLabel?: string;
  /** Custom metadata (for theme-specific needs) */
  meta?: Record<string, unknown>;
}

/**
 * Navigation Section
 * 
 * A group of navigation items with a title.
 */
export interface NavigationSection {
  id: string;
  title?: string;
  items: NavigationItem[];
  order?: number;
}

/**
 * Navigation Data
 * 
 * Complete navigation structure for the application.
 */
export interface NavigationData {
  /** Main navigation sections */
  sections: NavigationSection[];
  /** Footer navigation items */
  footer?: NavigationItem[];
  /** User menu items */
  userMenu?: NavigationItem[];
  /** Quick action items (for toolbars) */
  quickActions?: NavigationItem[];
}

/**
 * Theme-Specific Menu Item
 * 
 * Example of what a specific theme might need.
 * Each theme defines its own interface.
 */
export interface ThemeMenuItem {
  id: number;
  label: string;
  icon?: string;
  link?: string;
  parentId?: number;
  isTitle?: boolean;
  isCollapsed?: boolean;
  badge?: { variant: string; text: string };
  subItems?: ThemeMenuItem[];
  collapseid?: string;
}
