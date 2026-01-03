/**
 * EntitySchema Model
 * 
 * Master schema for an entity/aggregate type.
 * Wraps all view schemas (Browse, Edit, Add, Detail) with:
 * - Shared field definitions
 * - Lookup/options configuration (DSL)
 * - Data source configuration
 * - Permissions
 * 
 * This is the "Aggregate + Views Schema" concept.
 * 
 * USAGE:
 * ```typescript
 * const spikeSchema: EntitySchema = {
 *   id: 'spike',
 *   name: 'Spike',
 *   namePlural: 'Spikes',
 *   fields: [...],  // Master field definitions
 *   views: {
 *     browse: {...},  // BrowseViewSchema
 *     edit: {...},    // FormViewSchema
 *     // detail and add derived from edit if not specified
 *   }
 * };
 * ```
 */

import { OptionsSource } from './options-source.model';
import { FormFieldSchema } from './form-field-schema.model';
import { FormViewSchema, getSchemaForMode, FormViewMode } from './form-view-schema.model';
import { BrowseViewSchema } from '../../../core.ag/ui/widgets/browse-view/browse-view-schema.model';

// ═══════════════════════════════════════════════════════════════════
// Master Field Definition
// ═══════════════════════════════════════════════════════════════════

/**
 * Master field definition at entity level
 * These are shared across all views
 */
export interface EntityFieldDefinition extends FormFieldSchema {
  /** Whether field appears in browse view */
  browsable?: boolean;
  
  /** Whether field is sortable in browse */
  sortable?: boolean;
  
  /** Whether field is filterable in browse */
  filterable?: boolean;
  
  /** Whether field appears in cards/tiles summary */
  summary?: boolean;
  
  /** Whether field is the primary display field (e.g., title) */
  isPrimary?: boolean;
  
  /** Whether field is the unique identifier */
  isIdentifier?: boolean;
  
  /** Whether field is system-managed (not user-editable) */
  systemManaged?: boolean;
  
  /** Field appears in search results */
  searchable?: boolean;
  
  /** Weight for search relevance (higher = more relevant) */
  searchWeight?: number;
}

// ═══════════════════════════════════════════════════════════════════
// Data Source Configuration
// ═══════════════════════════════════════════════════════════════════

/**
 * Configuration for entity data source
 */
export interface EntityDataSource {
  /** Base API endpoint for this entity */
  endpoint: string;
  
  /** Endpoint for list/browse (default: endpoint) */
  listEndpoint?: string;
  
  /** Endpoint for single item (default: endpoint/:id) */
  getEndpoint?: string;
  
  /** Endpoint for create (default: POST endpoint) */
  createEndpoint?: string;
  
  /** Endpoint for update (default: PUT endpoint/:id) */
  updateEndpoint?: string;
  
  /** Endpoint for delete (default: DELETE endpoint/:id) */
  deleteEndpoint?: string;
  
  /** ID field name (default: 'id') */
  idField?: string;
  
  /** Whether entity is soft-deleted */
  softDelete?: boolean;
  
  /** Soft delete field name (default: 'isDeleted') */
  softDeleteField?: string;
}

// ═══════════════════════════════════════════════════════════════════
// Lookup Definitions
// ═══════════════════════════════════════════════════════════════════

/**
 * Named lookup that can be referenced by fields
 */
export interface EntityLookup {
  /** Lookup ID (referenced by fields) */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Options source configuration */
  source: OptionsSource;
  
  /** Whether to preload on schema load */
  preload?: boolean;
  
  /** Cache configuration */
  cache?: {
    enabled: boolean;
    ttlSeconds?: number;
    scope?: 'global' | 'entity' | 'user';
  };
}

// ═══════════════════════════════════════════════════════════════════
// Permissions
// ═══════════════════════════════════════════════════════════════════

/**
 * Permission configuration for entity operations
 */
export interface EntityPermissions {
  /** Can view/browse entities */
  canView?: boolean | string;  // boolean or permission name
  
  /** Can create new entities */
  canCreate?: boolean | string;
  
  /** Can edit existing entities */
  canEdit?: boolean | string;
  
  /** Can delete entities */
  canDelete?: boolean | string;
  
  /** Can export data */
  canExport?: boolean | string;
  
  /** Can import data */
  canImport?: boolean | string;
  
  /** Additional custom permissions */
  custom?: Record<string, boolean | string>;
}

// ═══════════════════════════════════════════════════════════════════
// Views Container
// ═══════════════════════════════════════════════════════════════════

/**
 * Container for all entity views
 */
export interface EntityViews {
  /** Browse/list view schema */
  browse?: BrowseViewSchema;
  
  /** Edit view schema (also used as base for add/detail) */
  edit?: FormViewSchema;
  
  /** Add view schema (derived from edit if not specified) */
  add?: FormViewSchema;
  
  /** Detail/view schema (derived from edit if not specified) */
  detail?: FormViewSchema;
  
  /** Clone view schema (derived from edit if not specified) */
  clone?: FormViewSchema;
  
  /** Additional custom views */
  custom?: Record<string, BrowseViewSchema | FormViewSchema>;
}

// ═══════════════════════════════════════════════════════════════════
// Entity Schema
// ═══════════════════════════════════════════════════════════════════

/**
 * Complete entity/aggregate schema
 */
export interface EntitySchema {
  // ─────────────────────────────────────────────────────────────────
  // Identity
  // ─────────────────────────────────────────────────────────────────
  
  /** Schema version */
  version?: string;
  
  /** Entity type ID (e.g., 'spike', 'user', 'project') */
  id: string;
  
  /** Singular display name */
  name: string;
  
  /** i18n key for name */
  nameKey?: string;
  
  /** Plural display name */
  namePlural: string;
  
  /** i18n key for plural name */
  namePluralKey?: string;
  
  /** Description */
  description?: string;
  
  /** i18n key for description */
  descriptionKey?: string;
  
  /** Icon class */
  icon?: string;
  
  /** Color/theme for this entity */
  color?: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Fields (Master Definitions)
  // ─────────────────────────────────────────────────────────────────
  
  /** 
   * Master field definitions
   * These are the source of truth, shared across all views
   */
  fields: EntityFieldDefinition[];
  
  // ─────────────────────────────────────────────────────────────────
  // Lookups (Shared Options Sources)
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Named lookups that can be referenced by field optionsSource
   * Example: { "categories": { source: { api: {...} } } }
   * Then in field: optionsSource: { lookupRef: "categories" }
   */
  lookups?: EntityLookup[];
  
  // ─────────────────────────────────────────────────────────────────
  // Views
  // ─────────────────────────────────────────────────────────────────
  
  /** View schemas */
  views: EntityViews;
  
  // ─────────────────────────────────────────────────────────────────
  // Data Source
  // ─────────────────────────────────────────────────────────────────
  
  /** Data source configuration */
  dataSource: EntityDataSource;
  
  // ─────────────────────────────────────────────────────────────────
  // Permissions
  // ─────────────────────────────────────────────────────────────────
  
  /** Permission configuration */
  permissions?: EntityPermissions;
  
  // ─────────────────────────────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────────────────────────────
  
  /** Base route for this entity (e.g., '/spikes') */
  baseRoute?: string;
  
  /** Route for browse view (default: baseRoute) */
  browseRoute?: string;
  
  /** Route for add view (default: baseRoute/add) */
  addRoute?: string;
  
  /** Route for edit view (default: baseRoute/:id/edit) */
  editRoute?: string;
  
  /** Route for detail view (default: baseRoute/:id) */
  detailRoute?: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Features
  // ─────────────────────────────────────────────────────────────────
  
  /** Enable soft delete */
  enableSoftDelete?: boolean;
  
  /** Enable versioning/history */
  enableVersioning?: boolean;
  
  /** Enable audit logging */
  enableAudit?: boolean;
  
  /** Enable import/export */
  enableImportExport?: boolean;
  
  /** Enable search */
  enableSearch?: boolean;
  
  /** Enable MRU (Most Recently Used) tracking */
  enableMru?: boolean;
  
  /** Max MRU items to track */
  mruMaxItems?: number;
  
  // ─────────────────────────────────────────────────────────────────
  // Metadata
  // ─────────────────────────────────────────────────────────────────
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════

/**
 * Get the browse view schema, deriving from fields if not specified
 */
export function getBrowseViewSchema(entity: EntitySchema): BrowseViewSchema {
  if (entity.views.browse) {
    return entity.views.browse;
  }
  
  // Derive from entity fields
  const filterFields = entity.fields
    .filter(f => f.filterable !== false && !f.systemManaged)
    .map(f => ({
      field: f.field,
      label: f.label,
      type: mapFieldTypeToQueryType(f.type),
      options: f.options,
      sortable: f.sortable,
      filterable: f.filterable,
    }));
  
  return {
    version: '1.0',
    id: `${entity.id}-browse`,
    name: `${entity.namePlural} Browse`,
    title: entity.namePlural,
    filter: {
      enabled: true,
      fields: filterFields as any,
    },
    order: {
      enabled: true,
      fields: filterFields.filter(f => f.sortable) as any,
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
      message: `No ${entity.namePlural.toLowerCase()} found`,
      icon: entity.icon || 'bx bx-folder-open',
    },
  };
}

/**
 * Get the edit form schema
 */
export function getEditViewSchema(entity: EntitySchema): FormViewSchema {
  if (entity.views.edit) {
    return entity.views.edit;
  }
  
  // Derive from entity fields
  return {
    version: '1.0',
    id: `${entity.id}-edit`,
    name: `Edit ${entity.name}`,
    title: `Edit ${entity.name}`,
    fields: entity.fields.filter(f => !f.systemManaged),
    showBottomActions: true,
    warnOnUnsavedChanges: true,
  };
}

/**
 * Get the add form schema
 */
export function getAddViewSchema(entity: EntitySchema): FormViewSchema {
  if (entity.views.add) {
    return entity.views.add;
  }
  
  // Derive from edit
  const editSchema = getEditViewSchema(entity);
  return getSchemaForMode(editSchema, 'add');
}

/**
 * Get the detail view schema
 */
export function getDetailViewSchema(entity: EntitySchema): FormViewSchema {
  if (entity.views.detail) {
    return entity.views.detail;
  }
  
  // Derive from edit
  const editSchema = getEditViewSchema(entity);
  return getSchemaForMode(editSchema, 'detail');
}

/**
 * Get a view schema by mode
 */
export function getViewSchemaByMode(
  entity: EntitySchema,
  mode: FormViewMode
): FormViewSchema {
  switch (mode) {
    case 'add':
      return getAddViewSchema(entity);
    case 'detail':
      return getDetailViewSchema(entity);
    case 'clone':
      return getSchemaForMode(getEditViewSchema(entity), 'clone');
    case 'edit':
    default:
      return getEditViewSchema(entity);
  }
}

/**
 * Get a lookup by ID
 */
export function getLookup(entity: EntitySchema, lookupId: string): EntityLookup | undefined {
  return entity.lookups?.find(l => l.id === lookupId);
}

/**
 * Get primary field (main display field like title/name)
 */
export function getPrimaryField(entity: EntitySchema): EntityFieldDefinition | undefined {
  return entity.fields.find(f => f.isPrimary) || 
         entity.fields.find(f => f.field === 'title') ||
         entity.fields.find(f => f.field === 'name');
}

/**
 * Get identifier field
 */
export function getIdentifierField(entity: EntitySchema): EntityFieldDefinition | undefined {
  return entity.fields.find(f => f.isIdentifier) ||
         entity.fields.find(f => f.field === 'id');
}

/**
 * Map FormFieldType to FieldType for queries
 */
function mapFieldTypeToQueryType(
  type: string
): 'text' | 'number' | 'date' | 'datetime' | 'select' | 'multiselect' | 'boolean' {
  const map: Record<string, any> = {
    text: 'text',
    textarea: 'text',
    richtext: 'text',
    email: 'text',
    url: 'text',
    phone: 'text',
    password: 'text',
    number: 'number',
    currency: 'number',
    percentage: 'number',
    date: 'date',
    datetime: 'datetime',
    time: 'datetime',
    daterange: 'date',
    select: 'select',
    multiselect: 'multiselect',
    radio: 'select',
    checkbox: 'boolean',
    toggle: 'boolean',
  };
  return map[type] || 'text';
}

// ═══════════════════════════════════════════════════════════════════
// Parsing & Serialization
// ═══════════════════════════════════════════════════════════════════

/**
 * Parse JSON string to EntitySchema
 */
export function parseEntitySchema(json: string): EntitySchema | null {
  try {
    return JSON.parse(json) as EntitySchema;
  } catch (error) {
    console.error('Failed to parse EntitySchema:', error);
    return null;
  }
}

/**
 * Serialize EntitySchema to JSON
 */
export function serializeEntitySchema(schema: EntitySchema): string {
  return JSON.stringify(schema, null, 2);
}

/**
 * Validate EntitySchema (basic validation)
 */
export function validateEntitySchema(schema: EntitySchema): string[] {
  const errors: string[] = [];
  
  if (!schema.id) errors.push('Entity id is required');
  if (!schema.name) errors.push('Entity name is required');
  if (!schema.namePlural) errors.push('Entity namePlural is required');
  if (!schema.fields || schema.fields.length === 0) {
    errors.push('Entity must have at least one field');
  }
  if (!schema.dataSource?.endpoint) {
    errors.push('Entity dataSource.endpoint is required');
  }
  
  return errors;
}
