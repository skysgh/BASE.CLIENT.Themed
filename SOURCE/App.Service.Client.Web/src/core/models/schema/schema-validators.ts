/**
 * Schema Validators using Zod
 * 
 * Provides runtime validation with clear, actionable error messages.
 */

import { z, ZodError, ZodIssue } from 'zod';
import { CURRENT_DSL_VERSION } from './schema-version.model';

// ═══════════════════════════════════════════════════════════════════
// Validation Result Types
// ═══════════════════════════════════════════════════════════════════

export interface SchemaValidationError {
  path: string;
  message: string;
  code: string;
  received?: unknown;
  expected?: string;
}

export interface SchemaValidationResult<T> {
  success: boolean;
  data?: T;
  errors: SchemaValidationError[];
  warnings: string[];
}

// ═══════════════════════════════════════════════════════════════════
// Zod Schemas - Options Source
// ═══════════════════════════════════════════════════════════════════

const FieldOptionSchema = z.object({
  value: z.string().min(1, 'Option value cannot be empty'),
  label: z.string().min(1, 'Option label cannot be empty'),
  icon: z.string().optional(),
  description: z.string().optional(),
  badge: z.string().optional(),
  badgeVariant: z.enum(['primary', 'secondary', 'success', 'warning', 'danger', 'info']).optional(),
  disabled: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  group: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const ApiOptionsSourceSchema = z.object({
  endpoint: z.string().min(1, 'API endpoint is required'),
  method: z.enum(['GET', 'POST']).optional(),
  valueField: z.string().min(1, 'Value field is required'),
  labelField: z.string().min(1, 'Label field is required'),
  iconField: z.string().optional(),
  descriptionField: z.string().optional(),
  badgeField: z.string().optional(),
  groupField: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
  params: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  responsePath: z.string().optional(),
  dependsOn: z.array(z.string()).optional(),
  loadWhen: z.string().optional(),
  cacheKey: z.string().optional(),
  cacheTtl: z.number().positive().optional(),
  cacheScope: z.enum(['global', 'entity', 'instance']).optional(),
});

const ResolverOptionsSourceSchema = z.object({
  resolver: z.string().min(1, 'Resolver name is required'),
  params: z.record(z.string(), z.unknown()).optional(),
  dependsOn: z.array(z.string()).optional(),
  cacheKey: z.string().optional(),
});

const OptionsSourceSchema = z.object({
  options: z.array(FieldOptionSchema).optional(),
  api: ApiOptionsSourceSchema.optional(),
  resolver: ResolverOptionsSourceSchema.optional(),
  includeEmpty: z.boolean().optional(),
  emptyLabel: z.string().optional(),
  emptyValue: z.string().optional(),
  minSearchLength: z.number().nonnegative().optional(),
  searchDebounceMs: z.number().nonnegative().optional(),
}).refine(
  data => !!(data.options || data.api || data.resolver) || Object.keys(data).length === 0,
  { message: 'OptionsSource must have options, api, or resolver defined (or be empty)' }
);

// ═══════════════════════════════════════════════════════════════════
// Zod Schemas - Form Field
// ═══════════════════════════════════════════════════════════════════

const FormFieldTypeSchema = z.enum([
  'text', 'textarea', 'richtext', 'password', 'email', 'url', 'phone',
  'number', 'currency', 'percentage',
  'select', 'multiselect', 'radio', 'checkbox', 'toggle',
  'date', 'datetime', 'time', 'daterange',
  'file', 'image', 'color', 'rating', 'slider',
  'label', 'link', 'badge',
  'divider', 'heading', 'spacer',
  'custom'
]);

const ValidationRuleSchema = z.object({
  type: z.enum(['required', 'minLength', 'maxLength', 'min', 'max', 'pattern', 'email', 'url', 'custom']),
  value: z.union([z.string(), z.number()]).optional(),
  message: z.string().optional(),
  messageKey: z.string().optional(),
  resolver: z.string().optional(),
});

const FieldLayoutSchema = z.object({
  colSpan: z.number().min(1).max(12).optional(),
  colSpanSm: z.number().min(1).max(12).optional(),
  colSpanMd: z.number().min(1).max(12).optional(),
  colSpanLg: z.number().min(1).max(12).optional(),
  newRow: z.boolean().optional(),
  wrapperClass: z.string().optional(),
  inputClass: z.string().optional(),
  order: z.number().optional(),
});

const FormFieldSchemaSchema = z.object({
  field: z.string().min(1, 'Field name is required'),
  type: FormFieldTypeSchema,
  label: z.string().min(1, 'Field label is required'),
  labelKey: z.string().optional(),
  placeholder: z.string().optional(),
  placeholderKey: z.string().optional(),
  helpText: z.string().optional(),
  helpTextKey: z.string().optional(),
  tooltip: z.string().optional(),
  icon: z.string().optional(),
  iconPosition: z.enum(['left', 'right', 'label']).optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  required: z.boolean().optional(),
  minLength: z.number().nonnegative().optional(),
  maxLength: z.number().positive().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().positive().optional(),
  pattern: z.string().optional(),
  validations: z.array(ValidationRuleSchema).optional(),
  optionsSource: OptionsSourceSchema.optional(),
  options: z.array(FieldOptionSchema).optional(),
  defaultValue: z.unknown().optional(),
  readonly: z.boolean().optional(),
  disabled: z.boolean().optional(),
  hidden: z.boolean().optional(),
  visibleWhen: z.union([z.string(), z.object({ expression: z.string(), dependsOn: z.array(z.string()).optional() })]).optional(),
  enabledWhen: z.union([z.string(), z.object({ expression: z.string(), dependsOn: z.array(z.string()).optional() })]).optional(),
  requiredWhen: z.union([z.string(), z.object({ expression: z.string(), dependsOn: z.array(z.string()).optional() })]).optional(),
  layout: FieldLayoutSchema.optional(),
  group: z.string().optional(),
  tab: z.string().optional(),
  rows: z.number().positive().optional(),
  accept: z.string().optional(),
  maxFileSize: z.number().positive().optional(),
  showPreview: z.boolean().optional(),
  maxRating: z.number().positive().optional(),
  showValue: z.boolean().optional(),
  dateFormat: z.string().optional(),
  currency: z.string().optional(),
  customComponent: z.string().optional(),
  customConfig: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// ═══════════════════════════════════════════════════════════════════
// Zod Schemas - Entity Field Definition
// ═══════════════════════════════════════════════════════════════════

const EntityFieldDefinitionSchema = FormFieldSchemaSchema.extend({
  browsable: z.boolean().optional(),
  sortable: z.boolean().optional(),
  filterable: z.boolean().optional(),
  summary: z.boolean().optional(),
  isPrimary: z.boolean().optional(),
  isIdentifier: z.boolean().optional(),
  systemManaged: z.boolean().optional(),
  searchable: z.boolean().optional(),
  searchWeight: z.number().optional(),
  lookupRef: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════
// Zod Schemas - Form View
// ═══════════════════════════════════════════════════════════════════

const FormActionSchema = z.object({
  id: z.string().min(1, 'Action id is required'),
  label: z.string().min(1, 'Action label is required'),
  labelKey: z.string().optional(),
  type: z.enum(['submit', 'cancel', 'reset', 'delete', 'clone', 'navigate', 'custom']),
  icon: z.string().optional(),
  variant: z.enum(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark', 'link']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  outline: z.boolean().optional(),
  position: z.enum(['left', 'right']).optional(),
  order: z.number().optional(),
  showInModes: z.array(z.enum(['add', 'edit', 'detail', 'clone'])).optional(),
  hideInModes: z.array(z.enum(['add', 'edit', 'detail', 'clone'])).optional(),
  confirmMessage: z.string().optional(),
  confirmMessageKey: z.string().optional(),
  route: z.string().optional(),
  queryParams: z.record(z.string(), z.string()).optional(),
  handler: z.string().optional(),
  disabled: z.boolean().optional(),
  visibleWhen: z.string().optional(),
  enabledWhen: z.string().optional(),
  shortcut: z.string().optional(),
});

// Define FormViewSchemaSchema with explicit type to avoid circular reference issues
const FormViewSchemaSchemaBase = z.object({
  version: z.string().optional(),
  dslVersion: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  titleKey: z.string().optional(),
  titleTemplate: z.string().optional(),
  description: z.string().optional(),
  descriptionKey: z.string().optional(),
  icon: z.string().optional(),
  fields: z.array(FormFieldSchemaSchema).min(1, 'At least one field is required'),
  groups: z.array(z.object({
    id: z.string().min(1),
    label: z.string().optional(),
    labelKey: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    collapsible: z.boolean().optional(),
    collapsed: z.boolean().optional(),
    fields: z.array(z.string()).optional(),
    layout: z.object({
      columns: z.number().optional(),
      className: z.string().optional(),
    }).optional(),
  })).optional(),
  tabs: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    labelKey: z.string().optional(),
    icon: z.string().optional(),
    badge: z.union([z.string(), z.number()]).optional(),
    fields: z.array(z.string()).optional(),
    groups: z.array(z.string()).optional(),
    disabled: z.boolean().optional(),
  })).optional(),
  layout: z.object({
    style: z.enum(['vertical', 'horizontal', 'inline']).optional(),
    labelWidth: z.union([z.number(), z.string()]).optional(),
    defaultColSpan: z.number().optional(),
    columns: z.number().optional(),
    spacing: z.enum(['compact', 'normal', 'relaxed']).optional(),
    formClass: z.string().optional(),
    fieldWrapperClass: z.string().optional(),
    showRequiredIndicator: z.boolean().optional(),
    validationPosition: z.enum(['below', 'right', 'tooltip']).optional(),
  }).optional(),
  actions: z.array(FormActionSchema).optional(),
  showTopActions: z.boolean().optional(),
  showBottomActions: z.boolean().optional(),
  stickyActions: z.boolean().optional(),
  autoSave: z.boolean().optional(),
  autoSaveDebounceMs: z.number().optional(),
  warnOnUnsavedChanges: z.boolean().optional(),
  validateOnBlur: z.boolean().optional(),
  validateOnChange: z.boolean().optional(),
  showValidationSummary: z.boolean().optional(),
  scrollToError: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Simplified form view schema (without self-reference for mode overrides)
const FormViewSchemaSchema = FormViewSchemaSchemaBase;

// ═══════════════════════════════════════════════════════════════════
// Zod Schemas - Entity Schema
// ═══════════════════════════════════════════════════════════════════

const EntityLookupSchema = z.object({
  id: z.string().min(1, 'Lookup id is required'),
  name: z.string().min(1, 'Lookup name is required'),
  source: OptionsSourceSchema,
  preload: z.boolean().optional(),
  cache: z.object({
    enabled: z.boolean(),
    ttlSeconds: z.number().optional(),
    scope: z.enum(['global', 'entity', 'user']).optional(),
  }).optional(),
});

const EntityDataSourceSchema = z.object({
  endpoint: z.string().min(1, 'DataSource endpoint is required'),
  listEndpoint: z.string().optional(),
  getEndpoint: z.string().optional(),
  createEndpoint: z.string().optional(),
  updateEndpoint: z.string().optional(),
  deleteEndpoint: z.string().optional(),
  idField: z.string().optional(),
  softDelete: z.boolean().optional(),
  softDeleteField: z.string().optional(),
});

const EntityPermissionsSchema = z.object({
  canView: z.union([z.boolean(), z.string()]).optional(),
  canCreate: z.union([z.boolean(), z.string()]).optional(),
  canEdit: z.union([z.boolean(), z.string()]).optional(),
  canDelete: z.union([z.boolean(), z.string()]).optional(),
  canExport: z.union([z.boolean(), z.string()]).optional(),
  canImport: z.union([z.boolean(), z.string()]).optional(),
  custom: z.record(z.string(), z.union([z.boolean(), z.string()])).optional(),
});

// Browse schema is simpler - just validate key parts
const BrowseViewSchemaSchema = z.object({
  version: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  search: z.object({
    enabled: z.boolean().optional(),
    placeholder: z.string().optional(),
  }).passthrough().optional(),
  filter: z.object({
    enabled: z.boolean().optional(),
  }).passthrough().optional(),
  order: z.object({
    enabled: z.boolean().optional(),
  }).passthrough().optional(),
  display: z.object({
    enabled: z.boolean().optional(),
    defaultMode: z.enum(['cards', 'tiles', 'table', 'list', 'chart']).optional(),
  }).passthrough().optional(),
  pagination: z.object({
    enabled: z.boolean().optional(),
    pageSize: z.number().positive().optional(),
  }).passthrough().optional(),
}).passthrough();

const EntityViewsSchema = z.object({
  browse: BrowseViewSchemaSchema.optional(),
  edit: FormViewSchemaSchema.optional(),
  add: FormViewSchemaSchema.optional(),
  detail: FormViewSchemaSchema.optional(),
  clone: FormViewSchemaSchema.optional(),
  custom: z.record(z.string(), z.union([BrowseViewSchemaSchema, FormViewSchemaSchema])).optional(),
});

export const EntitySchemaValidator = z.object({
  dslVersion: z.string().default(CURRENT_DSL_VERSION),
  version: z.string().optional(),
  id: z.string().min(1, 'Entity id is required'),
  name: z.string().min(1, 'Entity name is required'),
  nameKey: z.string().optional(),
  namePlural: z.string().min(1, 'Entity plural name is required'),
  namePluralKey: z.string().optional(),
  description: z.string().optional(),
  descriptionKey: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  fields: z.array(EntityFieldDefinitionSchema).min(1, 'At least one field is required'),
  lookups: z.array(EntityLookupSchema).optional(),
  views: EntityViewsSchema,
  dataSource: EntityDataSourceSchema,
  permissions: EntityPermissionsSchema.optional(),
  baseRoute: z.string().optional(),
  browseRoute: z.string().optional(),
  addRoute: z.string().optional(),
  editRoute: z.string().optional(),
  detailRoute: z.string().optional(),
  enableSoftDelete: z.boolean().optional(),
  enableVersioning: z.boolean().optional(),
  enableAudit: z.boolean().optional(),
  enableImportExport: z.boolean().optional(),
  enableSearch: z.boolean().optional(),
  enableMru: z.boolean().optional(),
  mruMaxItems: z.number().positive().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// ═══════════════════════════════════════════════════════════════════
// Validation Functions
// ═══════════════════════════════════════════════════════════════════

/**
 * Convert Zod errors to our error format
 */
function formatZodErrors(error: ZodError): SchemaValidationError[] {
  return error.issues.map((issue: ZodIssue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
    received: 'received' in issue ? (issue as any).received : undefined,
    expected: 'expected' in issue ? String((issue as any).expected) : undefined,
  }));
}

/**
 * Validate an EntitySchema
 */
export function validateEntitySchema(schema: unknown): SchemaValidationResult<z.infer<typeof EntitySchemaValidator>> {
  const result = EntitySchemaValidator.safeParse(schema);
  
  if (result.success) {
    // Additional semantic validations
    const warnings: string[] = [];
    const data = result.data;
    
    // Check for lookupRef references
    const lookupIds = new Set(data.lookups?.map(l => l.id) || []);
    for (const field of data.fields) {
      if (field.lookupRef && !lookupIds.has(field.lookupRef)) {
        warnings.push(`Field '${field.field}' references lookup '${field.lookupRef}' which is not defined`);
      }
    }
    
    // Check for primary field
    const hasPrimary = data.fields.some(f => f.isPrimary);
    if (!hasPrimary) {
      warnings.push('No field is marked as isPrimary. Consider marking a display field (like title or name).');
    }
    
    // Check for identifier field
    const hasIdentifier = data.fields.some(f => f.isIdentifier);
    if (!hasIdentifier) {
      warnings.push('No field is marked as isIdentifier. Consider marking the id field.');
    }
    
    return {
      success: true,
      data: result.data,
      errors: [],
      warnings,
    };
  }
  
  return {
    success: false,
    errors: formatZodErrors(result.error),
    warnings: [],
  };
}

/**
 * Validate a FormViewSchema
 */
export function validateFormViewSchema(schema: unknown): SchemaValidationResult<z.infer<typeof FormViewSchemaSchema>> {
  const result = FormViewSchemaSchema.safeParse(schema);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: [],
      warnings: [],
    };
  }
  
  return {
    success: false,
    errors: formatZodErrors(result.error),
    warnings: [],
  };
}

/**
 * Validate an OptionsSource
 */
export function validateOptionsSource(source: unknown): SchemaValidationResult<z.infer<typeof OptionsSourceSchema>> {
  const result = OptionsSourceSchema.safeParse(source);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: [],
      warnings: [],
    };
  }
  
  return {
    success: false,
    errors: formatZodErrors(result.error),
    warnings: [],
  };
}

// ═══════════════════════════════════════════════════════════════════
// Error Formatting
// ═══════════════════════════════════════════════════════════════════

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: SchemaValidationError[]): string {
  return errors.map(e => `  • ${e.path}: ${e.message}`).join('\n');
}

/**
 * Format validation result as a single message
 */
export function formatValidationResult(result: SchemaValidationResult<unknown>): string {
  if (result.success) {
    if (result.warnings.length > 0) {
      return `Schema valid with warnings:\n${result.warnings.map(w => `  ⚠ ${w}`).join('\n')}`;
    }
    return 'Schema valid';
  }
  
  return `Schema validation failed:\n${formatValidationErrors(result.errors)}`;
}
