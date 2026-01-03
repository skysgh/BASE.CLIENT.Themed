/**
 * FormViewSchema Model
 * 
 * Defines the schema for form-based views (Add, Edit, Detail).
 * Supports:
 * - Field definitions with layout
 * - Tabs and groups
 * - Actions (buttons)
 * - Fallback logic (detail → edit, add → edit)
 * - Multiple form engines (Formly, JSON Forms, etc.)
 * 
 * USAGE:
 * ```json
 * {
 *   "id": "spike-edit",
 *   "title": "Edit Spike",
 *   "engineSpec": { "engine": "formly" },
 *   "fields": [...],
 *   "actions": [
 *     { "id": "save", "label": "Save", "type": "submit" },
 *     { "id": "cancel", "label": "Cancel", "type": "cancel" }
 *   ]
 * }
 * ```
 */

import { FormFieldSchema, FormFieldGroup, FormFieldTab } from './form-field-schema.model';
import { FormEngineSpec, DEFAULT_ENGINE_SPEC } from '../form-engine/form-engine.types';

// ═══════════════════════════════════════════════════════════════════
// Form View Mode
// ═══════════════════════════════════════════════════════════════════

/**
 * Mode the form is rendered in
 */
export type FormViewMode = 'add' | 'edit' | 'detail' | 'clone';

// ═══════════════════════════════════════════════════════════════════
// Form Actions
// ═══════════════════════════════════════════════════════════════════

/**
 * Action button types
 */
export type FormActionType = 
  | 'submit'     // Submit form
  | 'cancel'     // Cancel/close
  | 'reset'      // Reset form
  | 'delete'     // Delete entity
  | 'clone'      // Clone entity
  | 'navigate'   // Navigate to route
  | 'custom';    // Custom action

/**
 * Form action button definition
 */
export interface FormAction {
  /** Action ID */
  id: string;
  
  /** Button label */
  label: string;
  
  /** i18n key for label */
  labelKey?: string;
  
  /** Action type */
  type: FormActionType;
  
  /** Icon class */
  icon?: string;
  
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' | 'link';
  
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether button is outline style */
  outline?: boolean;
  
  /** Position in action bar */
  position?: 'left' | 'right';
  
  /** Order within position */
  order?: number;
  
  /** Whether to show in specific modes */
  showInModes?: FormViewMode[];
  
  /** Whether to hide in specific modes */
  hideInModes?: FormViewMode[];
  
  /** Confirmation message before action */
  confirmMessage?: string;
  
  /** i18n key for confirmation */
  confirmMessageKey?: string;
  
  /** Route to navigate to (for 'navigate' type) */
  route?: string;
  
  /** Query params for navigation */
  queryParams?: Record<string, string>;
  
  /** Custom action handler name */
  handler?: string;
  
  /** Whether button is disabled */
  disabled?: boolean;
  
  /** Condition for visibility */
  visibleWhen?: string;
  
  /** Condition for enabled state */
  enabledWhen?: string;
  
  /** Keyboard shortcut (e.g., "ctrl+s") */
  shortcut?: string;
}

// ═══════════════════════════════════════════════════════════════════
// Form Layout
// ═══════════════════════════════════════════════════════════════════

/**
 * Form layout configuration
 */
export interface FormLayout {
  /** Layout style */
  style?: 'vertical' | 'horizontal' | 'inline';
  
  /** Label width (for horizontal layout) */
  labelWidth?: number | string;
  
  /** Default column span for fields */
  defaultColSpan?: number;
  
  /** Number of columns in grid */
  columns?: number;
  
  /** Spacing between fields */
  spacing?: 'compact' | 'normal' | 'relaxed';
  
  /** CSS class for form */
  formClass?: string;
  
  /** CSS class for field wrapper */
  fieldWrapperClass?: string;
  
  /** Show required indicator (*) on labels */
  showRequiredIndicator?: boolean;
  
  /** Position of validation messages */
  validationPosition?: 'below' | 'right' | 'tooltip';
}

// ═══════════════════════════════════════════════════════════════════
// Form View Schema
// ═══════════════════════════════════════════════════════════════════

/**
 * Complete form view schema
 */
export interface FormViewSchema {
  // ─────────────────────────────────────────────────────────────────
  // Identity
  // ─────────────────────────────────────────────────────────────────
  
  /** Schema version */
  version?: string;
  
  /** Unique identifier */
  id?: string;
  
  /** Schema name */
  name?: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Form Engine
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Form engine specification
   * Determines which form engine renders this schema
   * 
   * @default { engine: 'formly' }
   */
  engineSpec?: FormEngineSpec;
  
  // ─────────────────────────────────────────────────────────────────
  // Header
  // ─────────────────────────────────────────────────────────────────
  
  /** Form title */
  title?: string;
  
  /** i18n key for title */
  titleKey?: string;
  
  /** Title template with placeholders (e.g., "Edit {{title}}") */
  titleTemplate?: string;
  
  /** Form subtitle/description */
  description?: string;
  
  /** i18n key for description */
  descriptionKey?: string;
  
  /** Icon for form header */
  icon?: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Fields
  // ─────────────────────────────────────────────────────────────────
  
  /** Field definitions */
  fields: FormFieldSchema[];
  
  /** Field groups */
  groups?: FormFieldGroup[];
  
  /** Tabs for organizing fields */
  tabs?: FormFieldTab[];
  
  // ─────────────────────────────────────────────────────────────────
  // Layout
  // ─────────────────────────────────────────────────────────────────
  
  /** Layout configuration */
  layout?: FormLayout;
  
  // ─────────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────────
  
  /** Action buttons */
  actions?: FormAction[];
  
  /** Show actions bar at top */
  showTopActions?: boolean;
  
  /** Show actions bar at bottom */
  showBottomActions?: boolean;
  
  /** Sticky actions bar */
  stickyActions?: boolean;
  
  // ─────────────────────────────────────────────────────────────────
  // Behavior
  // ─────────────────────────────────────────────────────────────────
  
  /** Auto-save on field change (debounced) */
  autoSave?: boolean;
  
  /** Auto-save debounce in ms */
  autoSaveDebounceMs?: number;
  
  /** Warn on unsaved changes when navigating away */
  warnOnUnsavedChanges?: boolean;
  
  /** Validate on field blur */
  validateOnBlur?: boolean;
  
  /** Validate on field change */
  validateOnChange?: boolean;
  
  /** Show validation summary */
  showValidationSummary?: boolean;
  
  /** Scroll to first error on submit */
  scrollToError?: boolean;
  
  // ─────────────────────────────────────────────────────────────────
  // Mode-Specific Overrides
  // ─────────────────────────────────────────────────────────────────
  
  /** Overrides for add mode */
  addModeOverrides?: Partial<FormViewSchema>;
  
  /** Overrides for detail/view mode */
  detailModeOverrides?: Partial<FormViewSchema>;
  
  /** Overrides for clone mode */
  cloneModeOverrides?: Partial<FormViewSchema>;
  
  // ─────────────────────────────────────────────────────────────────
  // Metadata
  // ─────────────────────────────────────────────────────────────────
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════
// Default Actions
// ═══════════════════════════════════════════════════════════════════

/**
 * Default actions for edit mode
 */
export const DEFAULT_EDIT_ACTIONS: FormAction[] = [
  {
    id: 'save',
    label: 'Save',
    labelKey: 'common.actions.save',
    type: 'submit',
    icon: 'ri-save-line',
    variant: 'primary',
    position: 'right',
    order: 100,
    shortcut: 'ctrl+s',
  },
  {
    id: 'cancel',
    label: 'Cancel',
    labelKey: 'common.actions.cancel',
    type: 'cancel',
    icon: 'ri-close-line',
    variant: 'light',
    position: 'right',
    order: 90,
  },
  {
    id: 'delete',
    label: 'Delete',
    labelKey: 'common.actions.delete',
    type: 'delete',
    icon: 'ri-delete-bin-line',
    variant: 'danger',
    outline: true,
    position: 'left',
    order: 10,
    hideInModes: ['add'],
    confirmMessage: 'Are you sure you want to delete this item?',
  },
];

/**
 * Default actions for add mode
 */
export const DEFAULT_ADD_ACTIONS: FormAction[] = [
  {
    id: 'create',
    label: 'Create',
    labelKey: 'common.actions.create',
    type: 'submit',
    icon: 'ri-add-line',
    variant: 'primary',
    position: 'right',
    order: 100,
  },
  {
    id: 'cancel',
    label: 'Cancel',
    labelKey: 'common.actions.cancel',
    type: 'cancel',
    icon: 'ri-close-line',
    variant: 'light',
    position: 'right',
    order: 90,
  },
];

/**
 * Default actions for detail/view mode
 */
export const DEFAULT_DETAIL_ACTIONS: FormAction[] = [
  {
    id: 'edit',
    label: 'Edit',
    labelKey: 'common.actions.edit',
    type: 'navigate',
    icon: 'ri-pencil-line',
    variant: 'primary',
    position: 'right',
    order: 100,
    route: './edit', // Relative route to edit
  },
  {
    id: 'back',
    label: 'Back',
    labelKey: 'common.actions.back',
    type: 'navigate',
    icon: 'ri-arrow-left-line',
    variant: 'light',
    position: 'left',
    order: 10,
    route: '../', // Go up one level
  },
];

// ═══════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════

import { toReadonlyField } from './form-field-schema.model';

/**
 * Create a detail view schema from an edit schema
 * Converts all editable fields to readonly
 */
export function deriveDetailFromEdit(editSchema: FormViewSchema): FormViewSchema {
  return {
    ...editSchema,
    id: editSchema.id ? `${editSchema.id}-detail` : undefined,
    name: editSchema.name ? `${editSchema.name} (Detail)` : undefined,
    title: editSchema.title?.replace('Edit', 'View'),
    fields: editSchema.fields.map(toReadonlyField),
    actions: DEFAULT_DETAIL_ACTIONS,
    ...editSchema.detailModeOverrides,
  };
}

/**
 * Create an add view schema from an edit schema
 * Removes ID field, applies defaults
 */
export function deriveAddFromEdit(
  editSchema: FormViewSchema,
  options?: {
    excludeFields?: string[];
    overrideDefaults?: Record<string, unknown>;
  }
): FormViewSchema {
  const excludeSet = new Set(options?.excludeFields || ['id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy']);
  
  return {
    ...editSchema,
    id: editSchema.id ? `${editSchema.id}-add` : undefined,
    name: editSchema.name ? `${editSchema.name} (Add)` : undefined,
    title: editSchema.title?.replace('Edit', 'Add'),
    fields: editSchema.fields
      .filter(f => !excludeSet.has(f.field))
      .map(f => ({
        ...f,
        defaultValue: options?.overrideDefaults?.[f.field] ?? f.defaultValue,
      })),
    actions: DEFAULT_ADD_ACTIONS,
    ...editSchema.addModeOverrides,
  };
}

/**
 * Create a clone view from an edit schema
 * Similar to add but pre-populated with existing data
 */
export function deriveCloneFromEdit(editSchema: FormViewSchema): FormViewSchema {
  const addSchema = deriveAddFromEdit(editSchema);
  
  return {
    ...addSchema,
    id: editSchema.id ? `${editSchema.id}-clone` : undefined,
    name: editSchema.name ? `${editSchema.name} (Clone)` : undefined,
    title: editSchema.title?.replace('Edit', 'Clone'),
    ...editSchema.cloneModeOverrides,
  };
}

/**
 * Get the appropriate schema for a given mode
 */
export function getSchemaForMode(
  editSchema: FormViewSchema,
  mode: FormViewMode
): FormViewSchema {
  switch (mode) {
    case 'add':
      return deriveAddFromEdit(editSchema);
    case 'detail':
      return deriveDetailFromEdit(editSchema);
    case 'clone':
      return deriveCloneFromEdit(editSchema);
    case 'edit':
    default:
      return editSchema;
  }
}

/**
 * Merge a partial schema with defaults
 */
export function mergeFormViewSchema(
  partial: Partial<FormViewSchema>,
  defaults?: Partial<FormViewSchema>
): FormViewSchema {
  const base: FormViewSchema = {
    version: '1.0',
    fields: [],
    engineSpec: DEFAULT_ENGINE_SPEC,
    showBottomActions: true,
    warnOnUnsavedChanges: true,
    validateOnBlur: true,
    scrollToError: true,
    ...defaults,
  };
  
  // Safely merge engine specs, ensuring 'engine' is always defined
  const mergedEngineSpec: FormEngineSpec = {
    engine: partial.engineSpec?.engine ?? base.engineSpec?.engine ?? DEFAULT_ENGINE_SPEC.engine,
    adapterVersion: partial.engineSpec?.adapterVersion ?? base.engineSpec?.adapterVersion ?? DEFAULT_ENGINE_SPEC.adapterVersion,
    engineConfig: partial.engineSpec?.engineConfig ?? base.engineSpec?.engineConfig,
    fallback: partial.engineSpec?.fallback ?? base.engineSpec?.fallback ?? DEFAULT_ENGINE_SPEC.fallback,
  };
  
  return {
    ...base,
    ...partial,
    layout: { ...base.layout, ...partial.layout },
    engineSpec: mergedEngineSpec,
  };
}

/**
 * Parse a JSON string into FormViewSchema
 */
export function parseFormViewSchema(json: string): FormViewSchema | null {
  try {
    const parsed = JSON.parse(json);
    return mergeFormViewSchema(parsed);
  } catch (error) {
    console.error('Failed to parse FormViewSchema:', error);
    return null;
  }
}

/**
 * Serialize a FormViewSchema to JSON
 */
export function serializeFormViewSchema(schema: FormViewSchema): string {
  return JSON.stringify(schema, null, 2);
}
