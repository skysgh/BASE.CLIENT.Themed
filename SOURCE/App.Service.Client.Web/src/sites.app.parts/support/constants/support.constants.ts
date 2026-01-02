/**
 * Support Constants
 * 
 * Central configuration for the Support app.part.
 * Defines statuses, item types, and paths.
 */

// ─────────────────────────────────────────────────────────────
// Item Types
// ─────────────────────────────────────────────────────────────

export type SupportItemType = 'issue' | 'idea' | 'praise';

export interface SupportItemTypeConfig {
  id: SupportItemType;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const SUPPORT_ITEM_TYPES: SupportItemTypeConfig[] = [
  {
    id: 'issue',
    name: 'Issue',
    icon: 'bx-bug',
    description: 'Report a bug or problem',
    color: '#dc3545',  // danger
  },
  {
    id: 'idea',
    name: 'Idea',
    icon: 'bx-bulb',
    description: 'Suggest a feature or improvement',
    color: '#0d6efd',  // primary
  },
  {
    id: 'praise',
    name: 'Praise',
    icon: 'bx-heart',
    description: 'Share positive feedback or testimonial',
    color: '#28a745',  // success
  },
];

// ─────────────────────────────────────────────────────────────
// Statuses (Kanban columns)
// ─────────────────────────────────────────────────────────────

export type SupportItemStatus = 
  | 'new' 
  | 'triaged' 
  | 'in-progress' 
  | 'resolved' 
  | 'closed';

export interface SupportStatusConfig {
  id: SupportItemStatus;
  name: string;
  icon: string;
  color: string;
  /** Order in workflow (for progress bar) */
  order: number;
  /** Can user see items in this status? */
  userVisible: boolean;
  /** Is this a terminal status? */
  terminal: boolean;
}

export const SUPPORT_STATUSES: SupportStatusConfig[] = [
  {
    id: 'new',
    name: 'New',
    icon: 'bx-plus-circle',
    color: '#6c757d',  // secondary
    order: 1,
    userVisible: true,
    terminal: false,
  },
  {
    id: 'triaged',
    name: 'Triaged',
    icon: 'bx-check-circle',
    color: '#17a2b8',  // info
    order: 2,
    userVisible: true,
    terminal: false,
  },
  {
    id: 'in-progress',
    name: 'In Progress',
    icon: 'bx-loader-circle',
    color: '#ffc107',  // warning
    order: 3,
    userVisible: true,
    terminal: false,
  },
  {
    id: 'resolved',
    name: 'Resolved',
    icon: 'bx-check-double',
    color: '#28a745',  // success
    order: 4,
    userVisible: true,
    terminal: false,
  },
  {
    id: 'closed',
    name: 'Closed',
    icon: 'bx-lock',
    color: '#343a40',  // dark
    order: 5,
    userVisible: true,
    terminal: true,
  },
];

// ─────────────────────────────────────────────────────────────
// Priority
// ─────────────────────────────────────────────────────────────

export type SupportPriority = 'low' | 'medium' | 'high' | 'critical';

export interface SupportPriorityConfig {
  id: SupportPriority;
  name: string;
  icon: string;
  color: string;
  order: number;
}

export const SUPPORT_PRIORITIES: SupportPriorityConfig[] = [
  { id: 'low', name: 'Low', icon: 'bx-down-arrow', color: '#6c757d', order: 1 },
  { id: 'medium', name: 'Medium', icon: 'bx-minus', color: '#17a2b8', order: 2 },
  { id: 'high', name: 'High', icon: 'bx-up-arrow', color: '#ffc107', order: 3 },
  { id: 'critical', name: 'Critical', icon: 'bx-error', color: '#dc3545', order: 4 },
];

// ─────────────────────────────────────────────────────────────
// Default Configuration
// ─────────────────────────────────────────────────────────────

export interface SupportConfiguration {
  /** Is support module enabled? */
  enabled: boolean;
  /** Mode: internal (in-app) or external (redirect to external URL) */
  mode: 'internal' | 'external';
  /** External support URL (if mode is external) */
  externalUrl?: string;
  /** Allow users to submit issues */
  allowIssues: boolean;
  /** Allow users to submit ideas */
  allowIdeas: boolean;
  /** Base path for API calls (future integration) */
  apiBasePath: string;
  /** Base path for local JSON data */
  assetsBasePath: string;
}

export const DEFAULT_SUPPORT_CONFIG: SupportConfiguration = {
  enabled: true,
  mode: 'internal',
  allowIssues: true,
  allowIdeas: true,
  apiBasePath: '/api/support',
  assetsBasePath: '/assets/data/support',
};

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────

export const SUPPORT_ROUTES = {
  hub: '/apps/system/support',
  myItems: '/apps/system/support/my-items',
  newIssue: '/apps/system/support/new/issue',
  newIdea: '/apps/system/support/new/idea',
  item: (id: string) => `/apps/system/support/item/${id}`,
  admin: '/apps/system/support/admin',
  adminBoard: '/apps/system/support/admin/board',
};

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

export function getStatusConfig(statusId: SupportItemStatus): SupportStatusConfig | undefined {
  return SUPPORT_STATUSES.find(s => s.id === statusId);
}

export function getTypeConfig(typeId: SupportItemType): SupportItemTypeConfig | undefined {
  return SUPPORT_ITEM_TYPES.find(t => t.id === typeId);
}

export function getPriorityConfig(priorityId: SupportPriority): SupportPriorityConfig | undefined {
  return SUPPORT_PRIORITIES.find(p => p.id === priorityId);
}

/**
 * Calculate progress percentage based on status
 */
export function getStatusProgress(statusId: SupportItemStatus): number {
  const status = getStatusConfig(statusId);
  if (!status) return 0;
  const maxOrder = Math.max(...SUPPORT_STATUSES.map(s => s.order));
  return Math.round((status.order / maxOrder) * 100);
}
