/**
 * EntitySchemaBuilder
 * 
 * Fluent builder for creating EntitySchemas with reduced boilerplate.
 * Provides sensible defaults and shortcuts for common patterns.
 * 
 * USAGE:
 * ```typescript
 * const spikeSchema = new EntitySchemaBuilder('spike', 'Spike', 'Spikes')
 *   .withEndpoint('/api/spikes')
 *   .addTextField('title', 'Title', { required: true, isPrimary: true })
 *   .addSelectField('status', 'Status', [
 *     { value: 'draft', label: 'Draft' },
 *     { value: 'active', label: 'Active' }
 *   ])
 *   .addLookupField('assigneeId', 'Assignee', 'users')
 *   .withLookup('users', '/api/users')
 *   .build();
 * ```
 * 
 * SHORTHAND SYNTAX:
 * ```typescript
 * // Even simpler with shorthand
 * const schema = buildEntitySchema('spike', 'Spike', 'Spikes')
 *   .endpoint('/api/spikes')
 *   .text('title', 'Title', { required: true })
 *   .select('status', 'Status', ['draft', 'active', 'done'])
 *   .build();
 * ```
 */

import { 
  EntitySchema, 
  EntityFieldDefinition, 
  EntityDataSource, 
  EntityLookup,
  EntityPermissions,
  EntityViews 
} from './entity-schema.model';
import { FormFieldType, FormFieldSchema } from './form-field-schema.model';
import { OptionsSource, FieldOption } from './options-source.model';
import { BrowseViewSchema } from '../../../core.ag/ui/widgets/browse-view/browse-view-schema.model';
import { FormViewSchema, DEFAULT_EDIT_ACTIONS } from './form-view-schema.model';
import { CURRENT_DSL_VERSION } from './schema-version.model';
import { validateEntitySchema } from './schema-validators';

// ═══════════════════════════════════════════════════════════════════
// Field Builder
// ═══════════════════════════════════════════════════════════════════

/**
 * Options for field creation
 */
export interface FieldOptions extends Partial<EntityFieldDefinition> {
  // All EntityFieldDefinition properties are optional
}

/**
 * Shorthand for simple options (string[] becomes value/label pairs)
 */
export type SimpleOptions = string[] | FieldOption[];

/**
 * Convert simple options to FieldOption[]
 */
function normalizeOptions(options: SimpleOptions): FieldOption[] {
  if (options.length === 0) return [];
  
  if (typeof options[0] === 'string') {
    return (options as string[]).map(s => ({
      value: s,
      label: s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' '),
    }));
  }
  
  return options as FieldOption[];
}

// ═══════════════════════════════════════════════════════════════════
// Entity Schema Builder
// ═══════════════════════════════════════════════════════════════════

export class EntitySchemaBuilder {
  private schema: Partial<EntitySchema>;
  private _fields: EntityFieldDefinition[] = [];
  private _lookups: EntityLookup[] = [];
  private _browseConfig: Partial<BrowseViewSchema> = {};
  private _editConfig: Partial<FormViewSchema> = {};
  
  constructor(id: string, name: string, namePlural: string) {
    this.schema = {
      dslVersion: CURRENT_DSL_VERSION,
      id,
      name,
      namePlural,
      views: {},
      dataSource: { endpoint: `/api/${id}s` }, // Default endpoint
    };
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Entity Metadata
  // ─────────────────────────────────────────────────────────────────
  
  /** Set description */
  description(desc: string): this {
    this.schema.description = desc;
    return this;
  }
  
  /** Set icon */
  icon(icon: string): this {
    this.schema.icon = icon;
    return this;
  }
  
  /** Set color */
  color(color: string): this {
    this.schema.color = color;
    return this;
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Data Source
  // ─────────────────────────────────────────────────────────────────
  
  /** Set API endpoint */
  endpoint(endpoint: string): this {
    this.schema.dataSource = { ...this.schema.dataSource, endpoint } as EntityDataSource;
    return this;
  }
  
  /** Configure data source */
  dataSource(config: Partial<EntityDataSource>): this {
    this.schema.dataSource = { ...this.schema.dataSource, ...config } as EntityDataSource;
    return this;
  }
  
  /** Enable soft delete */
  softDelete(field: string = 'isDeleted'): this {
    this.schema.enableSoftDelete = true;
    this.schema.dataSource = { 
      ...this.schema.dataSource, 
      softDelete: true, 
      softDeleteField: field 
    } as EntityDataSource;
    return this;
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Routes
  // ─────────────────────────────────────────────────────────────────
  
  /** Set base route */
  baseRoute(route: string): this {
    this.schema.baseRoute = route;
    return this;
  }
  
  /** Set all routes at once */
  routes(config: { base?: string; browse?: string; add?: string; edit?: string; detail?: string }): this {
    if (config.base) this.schema.baseRoute = config.base;
    if (config.browse) this.schema.browseRoute = config.browse;
    if (config.add) this.schema.addRoute = config.add;
    if (config.edit) this.schema.editRoute = config.edit;
    if (config.detail) this.schema.detailRoute = config.detail;
    return this;
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Permissions
  // ─────────────────────────────────────────────────────────────────
  
  /** Set permissions */
  permissions(perms: EntityPermissions): this {
    this.schema.permissions = perms;
    return this;
  }
  
  /** Quick permissions with prefix */
  permissionsWithPrefix(prefix: string): this {
    this.schema.permissions = {
      canView: true,
      canCreate: `${prefix}.create`,
      canEdit: `${prefix}.edit`,
      canDelete: `${prefix}.delete`,
      canExport: `${prefix}.export`,
    };
    return this;
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Features
  // ─────────────────────────────────────────────────────────────────
  
  /** Enable features */
  features(config: {
    softDelete?: boolean;
    versioning?: boolean;
    audit?: boolean;
    importExport?: boolean;
    search?: boolean;
    mru?: boolean | number;
  }): this {
    if (config.softDelete) this.schema.enableSoftDelete = true;
    if (config.versioning) this.schema.enableVersioning = true;
    if (config.audit) this.schema.enableAudit = true;
    if (config.importExport) this.schema.enableImportExport = true;
    if (config.search) this.schema.enableSearch = true;
    if (config.mru) {
      this.schema.enableMru = true;
      if (typeof config.mru === 'number') {
        this.schema.mruMaxItems = config.mru;
      }
    }
    return this;
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Fields - Generic
  // ─────────────────────────────────────────────────────────────────
  
  /** Add a field with full control */
  field(field: string, type: FormFieldType, label: string, options?: FieldOptions): this {
    const fieldDef: EntityFieldDefinition = {
      field,
      type,
      label,
      browsable: true,
      ...options,
    };
    this._fields.push(fieldDef);
    return this;
  }
  
  /** Add system ID field */
  id(field: string = 'id'): this {
    this._fields.push({
      field,
      type: 'text',
      label: 'ID',
      isIdentifier: true,
      systemManaged: true,
      hidden: true,
    });
    return this;
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Fields - Text Types
  // ─────────────────────────────────────────────────────────────────
  
  /** Add text field */
  text(field: string, label: string, options?: FieldOptions): this {
    return this.field(field, 'text', label, { searchable: true, ...options });
  }
  
  /** Add textarea field */
  textarea(field: string, label: string, options?: FieldOptions): this {
    return this.field(field, 'textarea', label, { browsable: false, rows: 4, ...options });
  }
  
  /** Add rich text field */
  richtext(field: string, label: string, options?: FieldOptions): this {
    return this.field(field, 'richtext', label, { browsable: false, ...options });
  }
  
  /** Add email field */
  email(field: string, label: string = 'Email', options?: FieldOptions): this {
    return this.field(field, 'email', label, options);
  }
  
  /** Add URL field */
  url(field: string, label: string = 'URL', options?: FieldOptions): this {
    return this.field(field, 'url', label, options);
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Fields - Number Types
  // ─────────────────────────────────────────────────────────────────
  
  /** Add number field */
  number(field: string, label: string, options?: FieldOptions): this {
    return this.field(field, 'number', label, options);
  }
  
  /** Add currency field */
  currency(field: string, label: string, currencyCode: string = 'USD', options?: FieldOptions): this {
    return this.field(field, 'currency', label, { currency: currencyCode, ...options });
  }
  
  /** Add percentage field */
  percentage(field: string, label: string, options?: FieldOptions): this {
    return this.field(field, 'percentage', label, { min: 0, max: 100, ...options });
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Fields - Selection Types
  // ─────────────────────────────────────────────────────────────────
  
  /** Add select field with inline options */
  select(field: string, label: string, opts: SimpleOptions, options?: FieldOptions): this {
    return this.field(field, 'select', label, { 
      options: normalizeOptions(opts),
      filterable: true,
      ...options 
    });
  }
  
  /** Add multiselect field */
  multiselect(field: string, label: string, opts: SimpleOptions, options?: FieldOptions): this {
    return this.field(field, 'multiselect', label, { 
      options: normalizeOptions(opts),
      filterable: true,
      ...options 
    });
  }
  
  /** Add radio field */
  radio(field: string, label: string, opts: SimpleOptions, options?: FieldOptions): this {
    return this.field(field, 'radio', label, { options: normalizeOptions(opts), ...options });
  }
  
  /** Add checkbox field */
  checkbox(field: string, label: string, options?: FieldOptions): this {
    return this.field(field, 'checkbox', label, { filterable: true, ...options });
  }
  
  /** Add toggle field */
  toggle(field: string, label: string, options?: FieldOptions): this {
    return this.field(field, 'toggle', label, options);
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Fields - Date Types
  // ─────────────────────────────────────────────────────────────────
  
  /** Add date field */
  date(field: string, label: string, options?: FieldOptions): this {
    return this.field(field, 'date', label, { sortable: true, filterable: true, ...options });
  }
  
  /** Add datetime field */
  datetime(field: string, label: string, options?: FieldOptions): this {
    return this.field(field, 'datetime', label, { sortable: true, filterable: true, ...options });
  }
  
  /** Add time field */
  time(field: string, label: string, options?: FieldOptions): this {
    return this.field(field, 'time', label, options);
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Fields - Lookup (API-driven)
  // ─────────────────────────────────────────────────────────────────
  
  /** Add field with lookup reference */
  lookup(field: string, label: string, lookupId: string, options?: FieldOptions): this {
    return this.field(field, 'select', label, { 
      lookupRef: lookupId,
      filterable: true,
      sortable: true,
      ...options 
    });
  }
  
  /** Add field with API-driven options */
  apiSelect(field: string, label: string, endpoint: string, options?: FieldOptions & {
    valueField?: string;
    labelField?: string;
    cacheKey?: string;
  }): this {
    const { valueField = 'id', labelField = 'name', cacheKey, ...fieldOpts } = options || {};
    return this.field(field, 'select', label, { 
      optionsSource: {
        api: {
          endpoint,
          valueField,
          labelField,
          cacheKey: cacheKey || `${this.schema.id}-${field}`,
        },
        includeEmpty: true,
      },
      filterable: true,
      ...fieldOpts 
    });
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Fields - Audit Fields (common pattern)
  // ─────────────────────────────────────────────────────────────────
  
  /** Add standard audit fields */
  auditFields(): this {
    this._fields.push(
      {
        field: 'createdAt',
        type: 'datetime',
        label: 'Created',
        systemManaged: true,
        browsable: true,
        sortable: true,
        readonly: true,
        tab: 'audit',
      },
      {
        field: 'createdBy',
        type: 'text',
        label: 'Created By',
        systemManaged: true,
        readonly: true,
        tab: 'audit',
      },
      {
        field: 'updatedAt',
        type: 'datetime',
        label: 'Modified',
        systemManaged: true,
        browsable: true,
        sortable: true,
        readonly: true,
        tab: 'audit',
      },
      {
        field: 'updatedBy',
        type: 'text',
        label: 'Modified By',
        systemManaged: true,
        readonly: true,
        tab: 'audit',
      }
    );
    this.schema.enableAudit = true;
    return this;
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Lookups
  // ─────────────────────────────────────────────────────────────────
  
  /** Add a named lookup */
  withLookup(id: string, endpoint: string, options?: {
    name?: string;
    valueField?: string;
    labelField?: string;
    filter?: string;
    preload?: boolean;
    cacheTtl?: number;
  }): this {
    const { 
      name = id.charAt(0).toUpperCase() + id.slice(1),
      valueField = 'id',
      labelField = 'name',
      filter,
      preload = false,
      cacheTtl = 600,
    } = options || {};
    
    this._lookups.push({
      id,
      name,
      source: {
        api: {
          endpoint,
          valueField,
          labelField,
          filter,
          cacheKey: id,
          cacheTtl,
        },
        includeEmpty: true,
      },
      preload,
      cache: {
        enabled: true,
        ttlSeconds: cacheTtl,
        scope: 'global',
      },
    });
    return this;
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Views Configuration
  // ─────────────────────────────────────────────────────────────────
  
  /** Configure browse view */
  browse(config: Partial<BrowseViewSchema>): this {
    this._browseConfig = { ...this._browseConfig, ...config };
    return this;
  }
  
  /** Configure edit view */
  edit(config: Partial<FormViewSchema>): this {
    this._editConfig = { ...this._editConfig, ...config };
    return this;
  }
  
  /** Add tabs to edit view */
  tabs(tabConfigs: Array<{ id: string; label: string; icon?: string; fields?: string[] }>): this {
    this._editConfig.tabs = tabConfigs.map(t => ({
      id: t.id,
      label: t.label,
      icon: t.icon,
      fields: t.fields,
    }));
    return this;
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Build
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Build the EntitySchema
   * Throws if validation fails
   */
  build(): EntitySchema {
    // Finalize fields
    this.schema.fields = this._fields;
    
    // Finalize lookups
    if (this._lookups.length > 0) {
      this.schema.lookups = this._lookups;
    }
    
    // Build browse view
    const browseView: BrowseViewSchema = {
      version: CURRENT_DSL_VERSION,
      id: `${this.schema.id}-browse`,
      name: `${this.schema.namePlural}`,
      title: this.schema.namePlural,
      search: { enabled: true },
      filter: { 
        enabled: true, 
        fields: this._fields.filter(f => f.filterable) as any,
      },
      order: { 
        enabled: true,
        fields: this._fields.filter(f => f.sortable) as any,
      },
      display: {
        enabled: true,
        defaultMode: 'tiles',
      },
      pagination: {
        enabled: true,
        pageSize: 20,
      },
      emptyState: {
        message: `No ${this.schema.namePlural?.toLowerCase()} found`,
        icon: this.schema.icon || 'bx bx-folder-open',
      },
      ...this._browseConfig,
    };
    
    // Build edit view
    const editView: FormViewSchema = {
      version: CURRENT_DSL_VERSION,
      id: `${this.schema.id}-edit`,
      name: `Edit ${this.schema.name}`,
      title: `Edit ${this.schema.name}`,
      fields: this._fields.filter(f => !f.systemManaged),
      actions: DEFAULT_EDIT_ACTIONS,
      showBottomActions: true,
      warnOnUnsavedChanges: true,
      validateOnBlur: true,
      ...this._editConfig,
    };
    
    this.schema.views = {
      browse: browseView,
      edit: editView,
    };
    
    // Validate
    const result = validateEntitySchema(this.schema);
    if (!result.success) {
      const errorMsg = result.errors.map(e => `${e.path}: ${e.message}`).join('\n');
      throw new Error(`EntitySchema validation failed:\n${errorMsg}`);
    }
    
    // Log warnings
    if (result.warnings.length > 0) {
      console.warn(`EntitySchema warnings for '${this.schema.id}':\n`, result.warnings.join('\n'));
    }
    
    return result.data as EntitySchema;
  }
  
  /**
   * Build without validation (for debugging)
   */
  buildUnsafe(): EntitySchema {
    this.schema.fields = this._fields;
    if (this._lookups.length > 0) {
      this.schema.lookups = this._lookups;
    }
    
    this.schema.views = {
      browse: { ...this._browseConfig } as BrowseViewSchema,
      edit: { fields: this._fields.filter(f => !f.systemManaged), ...this._editConfig } as FormViewSchema,
    };
    
    return this.schema as EntitySchema;
  }
}

// ═══════════════════════════════════════════════════════════════════
// Factory Function
// ═══════════════════════════════════════════════════════════════════

/**
 * Create an EntitySchemaBuilder
 */
export function buildEntitySchema(id: string, name: string, namePlural: string): EntitySchemaBuilder {
  return new EntitySchemaBuilder(id, name, namePlural);
}

/**
 * Create an EntitySchemaBuilder with common defaults
 */
export function buildEntity(id: string, name: string, namePlural?: string): EntitySchemaBuilder {
  const plural = namePlural || `${name}s`;
  return new EntitySchemaBuilder(id, name, plural)
    .id()
    .baseRoute(`/${id}s`)
    .permissionsWithPrefix(id)
    .features({ search: true, mru: 10 });
}
