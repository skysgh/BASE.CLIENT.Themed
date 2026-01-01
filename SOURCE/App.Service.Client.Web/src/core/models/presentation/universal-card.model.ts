/**
 * Universal Card Models
 * 
 * Defines the universal card format that ALL entity types can be brokered into.
 * This is the OUTPUT format - brokers transform entity DTOs into this.
 * 
 * ARCHITECTURE:
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                     UNIVERSAL CARD                             │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ ┌───────┐  TITLE                               [Actions ⋮]    │
 * │ │ Icon/ │  Subtitle / Description                              │
 * │ │ Image │                                                      │
 * │ └───────┘                                                      │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
 * │ │ Cell 1  │ │ Cell 2  │ │ Cell 3  │ │ Cell 4  │ │ Cell 5  │   │
 * │ │ Label   │ │ Label   │ │ Label   │ │ Label   │ │ Label   │   │
 * │ │ Value   │ │ ▂▃▅▇█   │ │ $1,234  │ │ Active  │ │ 42      │   │
 * │ │ (text)  │ │ (spark) │ │ (money) │ │ (badge) │ │ (num)   │   │
 * │ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * CONTAINER PATTERN (Input/Output separation):
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ CARD CONTAINER (orchestrates - no I/O)                         │
 * │  ┌──────────────────────────────────────────────────────────┐  │
 * │  │ SELECTION CONTAINER (Input only)                          │  │
 * │  │  [☐] Checkbox                                             │  │
 * │  └──────────────────────────────────────────────────────────┘  │
 * │  ┌──────────────────────────────────────────────────────────┐  │
 * │  │ CARD CONTENT CONTAINER (Output only)                      │  │
 * │  │  Icon | Title | Cells...                                  │  │
 * │  └──────────────────────────────────────────────────────────┘  │
 * │  ┌──────────────────────────────────────────────────────────┐  │
 * │  │ ACTIONS CONTAINER (Input only)                            │  │
 * │  │  [Edit] [Delete] [...]                                    │  │
 * │  └──────────────────────────────────────────────────────────┘  │
 * └─────────────────────────────────────────────────────────────────┘
 */

import { CellType, BadgeVariant } from './presentation-profile.model';

// ─────────────────────────────────────────────────────────────────────────────
// CARD CELLS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Card cell - a single piece of data displayed in the card
 */
export interface ICardCell {
  /** Display label */
  label: string;
  
  /** The value to display */
  value: unknown;
  
  /** Cell type for rendering */
  type: CellType;
  
  // Type-specific options
  
  /** For 'badge': variant color */
  badgeVariant?: BadgeVariant;
  
  /** For 'spark': array of numbers for sparkline */
  sparkData?: number[];
  
  /** For 'progress': max value (value is current) */
  progressMax?: number;
  
  /** For 'money': currency code */
  currency?: string;
  
  /** For 'date/datetime': format string */
  dateFormat?: string;
  
  /** For 'number': decimal places */
  decimalPlaces?: number;
  
  /** For 'link': URL to navigate to */
  linkUrl?: string;
  
  /** For 'link': open in new tab? */
  linkExternal?: boolean;
  
  /** For 'avatar': fallback initials if image fails */
  avatarInitials?: string;
  
  /** For 'tags': array of tag strings */
  tags?: string[];
  
  /** For 'rating': max stars (default 5) */
  ratingMax?: number;
  
  /** For 'custom': component/template ID */
  customRenderer?: string;
  
  /** Tooltip text (optional) */
  tooltip?: string;
  
  /** CSS class(es) to apply */
  cssClass?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Action handler type
 */
export type ActionHandler = (payload: Record<string, unknown>) => void;

/**
 * Card action - an operation that can be performed on the entity
 */
export interface ICardAction {
  /** Action ID (for tracking) */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Icon class (e.g., 'ri-edit-line') */
  icon?: string;
  
  /** Variant/style */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'link';
  
  /** Is this the primary action? (highlighted) */
  isPrimary?: boolean;
  
  /** Is action disabled? */
  disabled?: boolean;
  
  /** Disabled reason (tooltip when disabled) */
  disabledReason?: string;
  
  /** Requires confirmation? */
  requiresConfirmation?: boolean;
  
  /** Confirmation message */
  confirmationMessage?: string;
  
  // Navigation options (mutually exclusive with handler)
  
  /** Router link (array format: ['/users', id]) */
  routerLink?: string[];
  
  /** Query params */
  queryParams?: Record<string, string>;
  
  /** External URL */
  externalUrl?: string;
  
  // Handler options
  
  /** Which payload keys this action needs */
  requiredPayload?: string[];
  
  /** Action handler (receives payload) */
  handler?: ActionHandler;
  
  // Display options
  
  /** Show in overflow menu (vs inline) */
  showInMenu?: boolean;
  
  /** Show on mobile? */
  showOnMobile?: boolean;
  
  /** Keyboard shortcut */
  shortcut?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIVERSAL CARD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Universal Card Data
 * 
 * The standardized format that ALL entity types can be transformed into.
 * Brokers convert entity DTOs → IUniversalCardData.
 */
export interface IUniversalCardData {
  // ─────────────────────────────────────────────────────────────
  // Identity
  // ─────────────────────────────────────────────────────────────
  
  /** Entity ID */
  id: string;
  
  /** Entity type (e.g., 'user', 'order', 'log') */
  entityType: string;
  
  // ─────────────────────────────────────────────────────────────
  // Visual
  // ─────────────────────────────────────────────────────────────
  
  /** Icon class (fallback if no image) */
  icon?: string;
  
  /** Icon background color class (e.g., 'bg-primary-subtle') */
  iconBackground?: string;
  
  /** Image URL (takes precedence over icon) */
  image?: string;
  
  /** Image alt text */
  imageAlt?: string;
  
  /** Avatar initials (fallback if image fails) */
  initials?: string;
  
  // ─────────────────────────────────────────────────────────────
  // Content
  // ─────────────────────────────────────────────────────────────
  
  /** Primary title */
  title: string;
  
  /** Subtitle (optional) */
  subtitle?: string;
  
  /** Description/summary (optional) */
  description?: string;
  
  /** Status badge (optional) */
  status?: {
    label: string;
    variant: BadgeVariant;
  };
  
  // ─────────────────────────────────────────────────────────────
  // Data Cells (max ~5 recommended for cards)
  // ─────────────────────────────────────────────────────────────
  
  /** Cells to display */
  cells: ICardCell[];
  
  // ─────────────────────────────────────────────────────────────
  // Hidden Payload (for actions, not displayed)
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Hidden data for action handlers
   * 
   * Example:
   * {
   *   phoneNumber: '+1-555-0123',  // For "Call" action
   *   email: 'user@example.com',   // For "Email" action
   *   canDelete: true,             // Permission check
   * }
   */
  payload: Record<string, unknown>;
  
  // ─────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────
  
  /** Primary action (click on card) */
  primaryAction?: ICardAction;
  
  /** Additional actions (menu/inline) */
  actions?: ICardAction[];
  
  // ─────────────────────────────────────────────────────────────
  // Selection
  // ─────────────────────────────────────────────────────────────
  
  /** Is this card selectable? */
  selectable?: boolean;
  
  /** Is this card currently selected? */
  selected?: boolean;
  
  // ─────────────────────────────────────────────────────────────
  // Metadata
  // ─────────────────────────────────────────────────────────────
  
  /** Timestamp for sorting/display */
  timestamp?: Date | string;
  
  /** Tags for filtering */
  tags?: string[];
  
  /** Custom CSS class(es) */
  cssClass?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD COLLECTION (for bulk operations)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Card collection with selection state
 */
export interface ICardCollection {
  /** Cards in the collection */
  cards: IUniversalCardData[];
  
  /** Currently selected card IDs */
  selectedIds: Set<string>;
  
  /** Are all cards selected? */
  allSelected: boolean;
  
  /** Is any card selected? */
  hasSelection: boolean;
  
  /** Selection count */
  selectionCount: number;
}

/**
 * Bulk action (operates on multiple selected cards)
 */
export interface IBulkAction {
  /** Action ID */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Icon class */
  icon?: string;
  
  /** Variant */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  
  /** Minimum selection count required */
  minSelection?: number;
  
  /** Maximum selection count allowed */
  maxSelection?: number;
  
  /** Requires confirmation? */
  requiresConfirmation?: boolean;
  
  /** Handler receives array of selected card IDs */
  handler: (selectedIds: string[], payload: Record<string, unknown>[]) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// FACTORY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a card cell
 */
export function createCell(
  label: string,
  value: unknown,
  type: CellType = 'text',
  options?: Partial<ICardCell>
): ICardCell {
  return { label, value, type, ...options };
}

/**
 * Create a badge cell
 */
export function createBadgeCell(
  label: string,
  value: string,
  variant: BadgeVariant = 'neutral'
): ICardCell {
  return { label, value, type: 'badge', badgeVariant: variant };
}

/**
 * Create a money cell
 */
export function createMoneyCell(
  label: string,
  value: number,
  currency: string = 'USD'
): ICardCell {
  return { label, value, type: 'money', currency };
}

/**
 * Create a sparkline cell
 */
export function createSparkCell(
  label: string,
  data: number[]
): ICardCell {
  return { label, value: null, type: 'spark', sparkData: data };
}

/**
 * Create a card action
 */
export function createAction(
  id: string,
  label: string,
  options?: Partial<ICardAction>
): ICardAction {
  return { id, label, ...options };
}

/**
 * Create a navigation action
 */
export function createNavAction(
  id: string,
  label: string,
  routerLink: string[],
  icon?: string
): ICardAction {
  return { 
    id, 
    label, 
    routerLink, 
    icon, 
    isPrimary: true 
  };
}
