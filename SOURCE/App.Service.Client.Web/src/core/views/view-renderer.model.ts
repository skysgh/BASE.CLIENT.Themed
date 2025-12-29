/**
 * View Renderer Type Definitions
 * 
 * Abstracts how data is rendered, allowing users to choose their preferred view.
 * 
 * ARCHITECTURE:
 * 
 * ┌──────────────────────────────────────────────────────────────────┐
 * │                     ViewContext (Action + Data)                 │
 * └───────────────────────────┬──────────────────────────────────────┘
 *                             │
 *           ┌─────────────────┼─────────────────┐
 *           ↓                 ↓                 ↓
 *      ┌─────────┐      ┌─────────┐      ┌─────────┐
 *      │ BROWSE  │      │  READ   │      │  EDIT   │
 *      │ (List)  │      │ (Single)│      │ (Form)  │
 *      └────┬────┘      └────┬────┘      └────┬────┘
 *           │                │                │
 *      Preference       Preference       Preference
 *           │                │                │
 *      ┌────┴────┐      ┌────┴────┐      ┌────┴────┐
 *      │ Renderer│      │ Renderer│      │ Renderer│
 *      └────┬────┘      └────┬────┘      └────┬────┘
 *           │                │                │
 *    ┌──────┼──────┐   ┌─────┼─────┐   ┌─────┼─────┐
 *    ↓      ↓      ↓   ↓     ↓     ↓   ↓     ↓     ↓
 *  Cards  Table  Chart Formly Custom Formly Custom
 *                      Labels Labels Inputs Inputs
 * 
 * KEY CONCEPTS:
 * - ViewAction: BROWSE, READ, EDIT, ADD (from BREAD)
 * - RendererType: How to display (cards, table, formly, custom)
 * - ViewPreference: User's preferred renderer per action
 */

/**
 * View actions (BREAD without Delete + State Transfer)
 */
export type ViewAction = 'browse' | 'read' | 'edit' | 'add';

/**
 * Browse renderer types
 */
export type BrowseRendererType = 'cards' | 'table' | 'chart' | 'list';

/**
 * Read renderer types
 */
export type ReadRendererType = 'formly-labels' | 'custom' | 'card';

/**
 * Edit/Add renderer types
 */
export type EditRendererType = 'formly' | 'custom' | 'jsonforms';

/**
 * Combined renderer type
 */
export type RendererType = BrowseRendererType | ReadRendererType | EditRendererType;

/**
 * View renderer definition
 */
export interface ViewRendererDefinition {
  /** Unique renderer ID */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description?: string;
  /** Icon class */
  icon: string;
  /** Actions this renderer supports */
  supportedActions: ViewAction[];
  /** Renderer type */
  type: RendererType;
  /** Is default for its action? */
  isDefault?: boolean;
  /** Is available (feature flag) */
  available: boolean;
}

/**
 * View preference (per entity type + action)
 */
export interface ViewPreference {
  /** Entity type (e.g., 'spike') */
  entityType: string;
  /** Action */
  action: ViewAction;
  /** Preferred renderer ID */
  rendererId: string;
}

/**
 * Default renderers
 */
export const DEFAULT_RENDERERS: ViewRendererDefinition[] = [
  // Browse renderers
  {
    id: 'browse-cards',
    name: 'Cards',
    description: 'Display items as cards in a grid',
    icon: 'bx-grid-alt',
    supportedActions: ['browse'],
    type: 'cards',
    isDefault: true,
    available: true,
  },
  {
    id: 'browse-table',
    name: 'Table',
    description: 'Display items in a traditional table',
    icon: 'bx-table',
    supportedActions: ['browse'],
    type: 'table',
    available: true,
  },
  {
    id: 'browse-chart',
    name: 'Chart',
    description: 'Display items as a chart visualization',
    icon: 'bx-bar-chart-alt-2',
    supportedActions: ['browse'],
    type: 'chart',
    available: false, // Future
  },
  {
    id: 'browse-list',
    name: 'List',
    description: 'Simple compact list view',
    icon: 'bx-list-ul',
    supportedActions: ['browse'],
    type: 'list',
    available: true,
  },
  
  // Read renderers
  {
    id: 'read-formly-labels',
    name: 'Form View',
    description: 'Display using form schema with labels',
    icon: 'bx-detail',
    supportedActions: ['read'],
    type: 'formly-labels',
    isDefault: true,
    available: true,
  },
  {
    id: 'read-custom',
    name: 'Custom View',
    description: 'Hand-crafted custom layout',
    icon: 'bx-customize',
    supportedActions: ['read'],
    type: 'custom',
    available: true,
  },
  {
    id: 'read-card',
    name: 'Card View',
    description: 'Compact card-style view',
    icon: 'bx-id-card',
    supportedActions: ['read'],
    type: 'card',
    available: true,
  },
  
  // Edit/Add renderers
  {
    id: 'edit-formly',
    name: 'Dynamic Form',
    description: 'Form generated from schema (Formly)',
    icon: 'bx-edit',
    supportedActions: ['edit', 'add'],
    type: 'formly',
    isDefault: true,
    available: true,
  },
  {
    id: 'edit-custom',
    name: 'Custom Form',
    description: 'Hand-crafted custom form',
    icon: 'bx-customize',
    supportedActions: ['edit', 'add'],
    type: 'custom',
    available: true,
  },
  {
    id: 'edit-jsonforms',
    name: 'JSON Forms',
    description: 'Form generated from JSON Schema',
    icon: 'bx-code-alt',
    supportedActions: ['edit', 'add'],
    type: 'jsonforms',
    available: false, // Future
  },
];

/**
 * Get renderers for a specific action
 */
export function getRenderersForAction(action: ViewAction): ViewRendererDefinition[] {
  return DEFAULT_RENDERERS.filter(r => 
    r.supportedActions.includes(action) && r.available
  );
}

/**
 * Get default renderer for an action
 */
export function getDefaultRenderer(action: ViewAction): ViewRendererDefinition | undefined {
  return DEFAULT_RENDERERS.find(r => 
    r.supportedActions.includes(action) && r.isDefault && r.available
  );
}
