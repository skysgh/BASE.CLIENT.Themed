/**
 * Schema Models Barrel Export
 * 
 * Central export for all schema-related models and services.
 */

// ─────────────────────────────────────────────────────────────────
// Versioning
// ─────────────────────────────────────────────────────────────────

export {
  CURRENT_DSL_VERSION,
  MIN_SUPPORTED_VERSION,
  VersionedSchema,
  SemanticVersion,
  VersionCheckResult,
  parseVersion,
  compareVersions,
  checkVersion,
  ensureVersion,
  versioned,
  SchemaParser,
  ParseResult,
  ParseError,
  SchemaParserRegistry,
} from './schema-version.model';

// ─────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────

export {
  SchemaValidationError,
  SchemaValidationResult,
  EntitySchemaValidator,
  validateEntitySchema as validateEntitySchemaZod,
  validateFormViewSchema,
  validateOptionsSource,
  formatValidationErrors,
  formatValidationResult,
} from './schema-validators';

// ─────────────────────────────────────────────────────────────────
// View State (separate from Schema)
// ─────────────────────────────────────────────────────────────────

export {
  ViewStateScope,
  ViewStateType,
  BrowseViewState,
  FormViewState,
  ViewState,
  QuickViewState,
  ViewStateReconcileResult,
  reconcileViewState,
  createViewState,
  createBrowseViewState,
  createQuickState,
  getSavedViewsKey,
  getQuickStateKey,
  getDefaultViewKey,
} from './view-state.model';

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
// Builder
// ─────────────────────────────────────────────────────────────────

export {
  EntitySchemaBuilder,
  FieldOptions,
  SimpleOptions,
  buildEntitySchema,
  buildEntity,
} from './entity-schema-builder';

// ─────────────────────────────────────────────────────────────────
// Examples (for reference/testing)
// ─────────────────────────────────────────────────────────────────

export {
  SPIKE_ENTITY_SCHEMA,
  getSpikeSchemaJson,
} from './examples/spike-entity-schema.example';

export {
  SUBSPIKE_ENTITY_SCHEMA,
  getSubSpikeSchemaJson,
} from './examples/subspike-entity-schema.example';
