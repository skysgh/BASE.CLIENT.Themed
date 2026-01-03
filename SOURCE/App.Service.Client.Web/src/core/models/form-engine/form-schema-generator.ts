/**
 * Form Schema Generator
 * 
 * Auto-generates FormViewSchema from EntitySchema when none is provided.
 * Creates functional but simple forms as a fallback.
 * 
 * DESIGN PHILOSOPHY:
 * - Generate sensible defaults for any entity
 * - Support multiple form engines via FormEngineSpec
 * - Allow progressive enhancement (start simple, customize later)
 * 
 * USAGE:
 * ```typescript
 * // Auto-generate edit form for any entity
 * const formSchema = generateFormSchema(entity, 'edit');
 * 
 * // Convert to Formly
 * const formlyConfig = formlyAdapter.convertForm(formSchema);
 * ```
 */

import { EntitySchema, EntityFieldDefinition, EntityLookup } from '../schema/entity-schema.model';
import { FormViewSchema, FormAction, DEFAULT_EDIT_ACTIONS, DEFAULT_ADD_ACTIONS, DEFAULT_DETAIL_ACTIONS } from '../schema/form-view-schema.model';
import { FormFieldSchema, FormFieldType, FormFieldGroup, toReadonlyField } from '../schema/form-field-schema.model';
import { FormEngineType, FormEngineSpec, DEFAULT_ENGINE_SPEC, createEngineSpec } from './form-engine.types';

// ═══════════════════════════════════════════════════════════════════
// Generation Options
// ═══════════════════════════════════════════════════════════════════

/**
 * Options for form schema generation
 */
export interface FormGenerationOptions {
  /** Form mode */
  mode: 'add' | 'edit' | 'detail' | 'clone';
  
  /** Target form engine */
  engine?: FormEngineType;
  
  /** Engine spec (overrides engine) */
  engineSpec?: FormEngineSpec;
  
  /** Fields to exclude */
  excludeFields?: string[];
  
  /** Fields to include (if set, only these are included) */
  includeFields?: string[];
  
  /** Field order (field names in order) */
  fieldOrder?: string[];
  
  /** Group system fields (createdAt, updatedAt, etc.) */
  groupSystemFields?: boolean;
  
  /** Group label for system fields */
  systemFieldsGroupLabel?: string;
  
  /** Layout columns */
  columns?: number;
  
  /** Auto-group fields by prefix (e.g., address_city → Address group) */
  autoGroupByPrefix?: boolean;
  
  /** Custom actions */
  actions?: FormAction[];
  
  /** Show all fields (ignore browsable/summary flags) */
  showAllFields?: boolean;
}

/**
 * Default generation options
 */
const DEFAULT_OPTIONS: Partial<FormGenerationOptions> = {
  engine: 'formly',
  groupSystemFields: true,
  systemFieldsGroupLabel: 'System Information',
  columns: 2,
  autoGroupByPrefix: false,
  showAllFields: true,
};

// ═══════════════════════════════════════════════════════════════════
// System Fields
// ═══════════════════════════════════════════════════════════════════

/** Fields typically managed by the system */
const SYSTEM_FIELDS = new Set([
  'id',
  'createdAt',
  'createdBy',
  'createdById',
  'updatedAt',
  'updatedBy',
  'updatedById',
  'deletedAt',
  'deletedBy',
  'isDeleted',
  'version',
  'rowVersion',
]);

/** Fields to exclude from add forms */
const ADD_MODE_EXCLUDE = new Set([
  'id',
  'createdAt',
  'createdBy',
  'createdById',
  'updatedAt',
  'updatedBy',
  'updatedById',
  'deletedAt',
  'deletedBy',
  'isDeleted',
  'version',
  'rowVersion',
]);

// ═══════════════════════════════════════════════════════════════════
// Main Generator
// ═══════════════════════════════════════════════════════════════════

/**
 * Generate a FormViewSchema from an EntitySchema
 */
export function generateFormSchema(
  entity: EntitySchema,
  options: FormGenerationOptions
): FormViewSchema {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Determine which fields to include
  let fields = selectFields(entity.fields, opts);
  
  // Order fields
  fields = orderFields(fields, opts);
  
  // Convert to FormFieldSchema
  const formFields = fields.map(f => convertToFormField(f, entity, opts));
  
  // Apply mode-specific transforms
  const transformedFields = applyModeTransforms(formFields, opts.mode);
  
  // Build groups
  const groups = buildGroups(fields, opts);
  
  // Get actions
  const actions = opts.actions || getDefaultActions(opts.mode);
  
  // Build the schema
  const schema: FormViewSchema = {
    version: '1.0',
    id: `${entity.id}-${opts.mode}`,
    name: getFormName(entity, opts.mode),
    title: getFormTitle(entity, opts.mode),
    icon: entity.icon,
    fields: transformedFields,
    groups: groups.length > 0 ? groups : undefined,
    layout: {
      columns: opts.columns,
      style: 'vertical',
      showRequiredIndicator: true,
    },
    actions,
    showBottomActions: true,
    warnOnUnsavedChanges: opts.mode !== 'detail',
    validateOnBlur: true,
    scrollToError: true,
  };
  
  // Attach engine spec as metadata
  const engineSpec = opts.engineSpec || createEngineSpec(opts.engine || 'formly');
  schema.metadata = {
    ...schema.metadata,
    formEngine: engineSpec,
    generatedAt: new Date().toISOString(),
    generatorVersion: '1.0.0',
  };
  
  return schema;
}

/**
 * Generate all standard form schemas for an entity
 */
export function generateAllFormSchemas(
  entity: EntitySchema,
  baseOptions?: Partial<FormGenerationOptions>
): {
  edit: FormViewSchema;
  add: FormViewSchema;
  detail: FormViewSchema;
} {
  return {
    edit: generateFormSchema(entity, { ...baseOptions, mode: 'edit' }),
    add: generateFormSchema(entity, { ...baseOptions, mode: 'add' }),
    detail: generateFormSchema(entity, { ...baseOptions, mode: 'detail' }),
  };
}

// ═══════════════════════════════════════════════════════════════════
// Field Selection
// ═══════════════════════════════════════════════════════════════════

/**
 * Select which fields to include in the form
 */
function selectFields(
  fields: EntityFieldDefinition[],
  options: FormGenerationOptions
): EntityFieldDefinition[] {
  let selected = [...fields];
  
  // Filter by include list
  if (options.includeFields?.length) {
    const includeSet = new Set(options.includeFields);
    selected = selected.filter(f => includeSet.has(f.field));
  }
  
  // Filter by exclude list
  if (options.excludeFields?.length) {
    const excludeSet = new Set(options.excludeFields);
    selected = selected.filter(f => !excludeSet.has(f.field));
  }
  
  // Mode-specific exclusions
  if (options.mode === 'add') {
    selected = selected.filter(f => !ADD_MODE_EXCLUDE.has(f.field));
  }
  
  // Exclude system-managed fields from edit forms
  if (options.mode === 'edit' || options.mode === 'add') {
    selected = selected.filter(f => !f.systemManaged);
  }
  
  return selected;
}

/**
 * Order fields according to options
 */
function orderFields(
  fields: EntityFieldDefinition[],
  options: FormGenerationOptions
): EntityFieldDefinition[] {
  if (options.fieldOrder?.length) {
    const orderMap = new Map(options.fieldOrder.map((f, i) => [f, i]));
    return [...fields].sort((a, b) => {
      const aOrder = orderMap.get(a.field) ?? 999;
      const bOrder = orderMap.get(b.field) ?? 999;
      return aOrder - bOrder;
    });
  }
  
  // Default ordering: primary first, then by layout order, then alphabetically
  return [...fields].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    if (a.layout?.order !== undefined && b.layout?.order !== undefined) {
      return a.layout.order - b.layout.order;
    }
    return 0;
  });
}

// ═══════════════════════════════════════════════════════════════════
// Field Conversion
// ═══════════════════════════════════════════════════════════════════

/**
 * Convert EntityFieldDefinition to FormFieldSchema
 */
function convertToFormField(
  field: EntityFieldDefinition,
  entity: EntitySchema,
  options: FormGenerationOptions
): FormFieldSchema {
  const formField: FormFieldSchema = {
    field: field.field,
    type: field.type,
    label: field.label,
    labelKey: field.labelKey,
    placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
    helpText: field.helpText,
    tooltip: field.tooltip,
    required: field.required,
    readonly: field.readonly,
    disabled: field.disabled,
    hidden: field.hidden,
    defaultValue: field.defaultValue,
    // Validation
    minLength: field.minLength,
    maxLength: field.maxLength,
    min: field.min,
    max: field.max,
    pattern: field.pattern,
    validations: field.validations,
    // Options
    options: field.options,
    optionsSource: resolveOptionsSource(field, entity),
    // Conditional
    visibleWhen: field.visibleWhen,
    enabledWhen: field.enabledWhen,
    requiredWhen: field.requiredWhen,
    // Layout
    layout: calculateLayout(field, options),
    group: field.group || (SYSTEM_FIELDS.has(field.field) && options.groupSystemFields ? 'system' : undefined),
    // Type-specific
    rows: field.rows,
    accept: field.accept,
    dateFormat: field.dateFormat,
    currency: field.currency,
    customComponent: field.customComponent,
    customConfig: field.customConfig,
  };
  
  return formField;
}

/**
 * Resolve options source, handling lookup references
 */
function resolveOptionsSource(
  field: EntityFieldDefinition,
  entity: EntitySchema
): FormFieldSchema['optionsSource'] {
  // If field has direct optionsSource, use it
  if (field.optionsSource) {
    return field.optionsSource;
  }
  
  // If field references a lookup, resolve it
  if (field.lookupRef && entity.lookups) {
    const lookup = entity.lookups.find(l => l.id === field.lookupRef);
    if (lookup) {
      return lookup.source;
    }
  }
  
  return undefined;
}

/**
 * Calculate field layout
 */
function calculateLayout(
  field: EntityFieldDefinition,
  options: FormGenerationOptions
): FormFieldSchema['layout'] {
  // Use field's layout if defined
  if (field.layout) {
    return field.layout;
  }
  
  // Calculate column span based on field type
  const defaultSpan = calculateDefaultColSpan(field.type, options.columns || 2);
  
  return {
    colSpan: defaultSpan,
  };
}

/**
 * Calculate default column span based on field type
 */
function calculateDefaultColSpan(type: FormFieldType, totalColumns: number): number {
  // Full width for certain types
  const fullWidthTypes: FormFieldType[] = ['textarea', 'richtext', 'divider', 'heading'];
  if (fullWidthTypes.includes(type)) {
    return totalColumns;
  }
  
  // Default to half width (1 column in 2-column layout)
  return Math.ceil(totalColumns / 2);
}

// ═══════════════════════════════════════════════════════════════════
// Mode Transforms
// ═══════════════════════════════════════════════════════════════════

/**
 * Apply mode-specific transforms to fields
 */
function applyModeTransforms(
  fields: FormFieldSchema[],
  mode: FormGenerationOptions['mode']
): FormFieldSchema[] {
  switch (mode) {
    case 'detail':
      // Convert all fields to readonly
      return fields.map(toReadonlyField);
    
    case 'add':
      // Clear any existing values (use defaults only)
      return fields.map(f => ({
        ...f,
        // Keep defaultValue but don't show existing data
      }));
    
    case 'clone':
      // Similar to add but might preserve some values
      return fields.map(f => ({
        ...f,
        // Clone-specific logic
      }));
    
    case 'edit':
    default:
      return fields;
  }
}

// ═══════════════════════════════════════════════════════════════════
// Groups
// ═══════════════════════════════════════════════════════════════════

/**
 * Build field groups
 */
function buildGroups(
  fields: EntityFieldDefinition[],
  options: FormGenerationOptions
): FormFieldGroup[] {
  const groups: FormFieldGroup[] = [];
  
  // System fields group
  if (options.groupSystemFields) {
    const systemFields = fields.filter(f => SYSTEM_FIELDS.has(f.field));
    if (systemFields.length > 0) {
      groups.push({
        id: 'system',
        label: options.systemFieldsGroupLabel || 'System Information',
        icon: 'ri-settings-3-line',
        collapsible: true,
        collapsed: true,
        fields: systemFields.map(f => f.field),
      });
    }
  }
  
  // Auto-group by prefix (e.g., address_city → Address)
  if (options.autoGroupByPrefix) {
    const prefixGroups = groupByPrefix(fields);
    for (const [prefix, fieldNames] of Object.entries(prefixGroups)) {
      if (fieldNames.length >= 2) { // Only group if 2+ fields
        groups.push({
          id: prefix.toLowerCase().replace(/\s+/g, '-'),
          label: prefix,
          fields: fieldNames,
        });
      }
    }
  }
  
  // Collect explicit groups from fields
  const explicitGroups = new Map<string, string[]>();
  for (const field of fields) {
    if (field.group && field.group !== 'system') {
      if (!explicitGroups.has(field.group)) {
        explicitGroups.set(field.group, []);
      }
      explicitGroups.get(field.group)!.push(field.field);
    }
  }
  
  for (const [groupId, fieldNames] of explicitGroups) {
    groups.push({
      id: groupId,
      label: groupId.charAt(0).toUpperCase() + groupId.slice(1).replace(/-/g, ' '),
      fields: fieldNames,
    });
  }
  
  return groups;
}

/**
 * Group fields by prefix (e.g., address_city → 'Address')
 */
function groupByPrefix(fields: EntityFieldDefinition[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  
  for (const field of fields) {
    const parts = field.field.split(/[_-]/);
    if (parts.length >= 2) {
      const prefix = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      if (!groups[prefix]) {
        groups[prefix] = [];
      }
      groups[prefix].push(field.field);
    }
  }
  
  return groups;
}

// ═══════════════════════════════════════════════════════════════════
// Actions & Labels
// ═══════════════════════════════════════════════════════════════════

/**
 * Get default actions for mode
 */
function getDefaultActions(mode: FormGenerationOptions['mode']): FormAction[] {
  switch (mode) {
    case 'add':
      return DEFAULT_ADD_ACTIONS;
    case 'detail':
      return DEFAULT_DETAIL_ACTIONS;
    case 'edit':
    default:
      return DEFAULT_EDIT_ACTIONS;
  }
}

/**
 * Get form name for mode
 */
function getFormName(entity: EntitySchema, mode: FormGenerationOptions['mode']): string {
  const modeLabels = {
    add: 'Add',
    edit: 'Edit',
    detail: 'View',
    clone: 'Clone',
  };
  return `${modeLabels[mode]} ${entity.name}`;
}

/**
 * Get form title for mode
 */
function getFormTitle(entity: EntitySchema, mode: FormGenerationOptions['mode']): string {
  return getFormName(entity, mode);
}

// ═══════════════════════════════════════════════════════════════════
// Convenience Functions
// ═══════════════════════════════════════════════════════════════════

/**
 * Quick generate edit form
 */
export function generateEditForm(entity: EntitySchema, engine?: FormEngineType): FormViewSchema {
  return generateFormSchema(entity, { mode: 'edit', engine });
}

/**
 * Quick generate add form
 */
export function generateAddForm(entity: EntitySchema, engine?: FormEngineType): FormViewSchema {
  return generateFormSchema(entity, { mode: 'add', engine });
}

/**
 * Quick generate detail/view form
 */
export function generateDetailForm(entity: EntitySchema, engine?: FormEngineType): FormViewSchema {
  return generateFormSchema(entity, { mode: 'detail', engine });
}
