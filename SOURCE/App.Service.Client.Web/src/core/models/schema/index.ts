/**
 * Schema Models Barrel Export
 * 
 * Central export for all schema-related models and services.
 */

// ─────────────────────────────────────────────────────────────────
// Core Models
// ─────────────────────────────────────────────────────────────────

export {
  // Options DSL
  FieldOption,
  ApiOptionsSource,
  ResolverOptionsSource,
  OptionsSource,
  OptionsLoadContext,
  OptionsResolver,
  // Helpers
  hasOptionsSource,
  isStaticOptionsSource,
  isDynamicOptionsSource,
  getOptionsDependencies,
  createStaticOptionsSource,
  createApiOptionsSource,
} from './options-source.model';

export {
  // Form field types
  FormFieldType,
  ValidationRule,
  FieldCondition,
  FieldLayout,
  FormFieldSchema,
  FormFieldGroup,
  FormFieldTab,
  // Helpers
  isSelectionField,
  isTextInputField,
  isNumericField,
  isDateTimeField,
  isLayoutField,
  isDisplayField,
  toReadonlyField,
  createTextField,
  createSelectField,
} from './form-field-schema.model';

export {
  // Form view
  FormViewMode,
  FormActionType,
  FormAction,
  FormLayout,
  FormViewSchema,
  // Defaults
  DEFAULT_EDIT_ACTIONS,
  DEFAULT_ADD_ACTIONS,
  DEFAULT_DETAIL_ACTIONS,
  // Helpers
  deriveDetailFromEdit,
  deriveAddFromEdit,
  deriveCloneFromEdit,
  getSchemaForMode,
  mergeFormViewSchema,
  parseFormViewSchema,
  serializeFormViewSchema,
} from './form-view-schema.model';

export {
  // Entity schema
  EntityFieldDefinition,
  EntityDataSource,
  EntityLookup,
  EntityPermissions,
  EntityViews,
  EntitySchema,
  // Helpers
  getBrowseViewSchema,
  getEditViewSchema,
  getAddViewSchema,
  getDetailViewSchema,
  getViewSchemaByMode,
  getLookup,
  getPrimaryField,
  getIdentifierField,
  parseEntitySchema,
  serializeEntitySchema,
  validateEntitySchema,
} from './entity-schema.model';

// ─────────────────────────────────────────────────────────────────
// Examples (for reference/testing)
// ─────────────────────────────────────────────────────────────────

export {
  SPIKE_ENTITY_SCHEMA,
  getSpikeSchemaJson,
} from './examples/spike-entity-schema.example';
