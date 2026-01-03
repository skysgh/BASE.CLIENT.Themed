/**
 * Example Spike Entity Schema
 * 
 * Demonstrates the full EntitySchema structure for the "Spike" aggregate.
 * This can be:
 * - Defined in code (as below)
 * - Loaded from /api/schema/entities/spike
 * - Stored in a JSON file
 * 
 * Key features demonstrated:
 * - Master field definitions with lookups DSL
 * - Browse view with filters and sorts
 * - Edit form with tabs and groups
 * - Detail and Add views derived from Edit
 * - MRU tracking enabled
 */

import { EntitySchema, EntityFieldDefinition } from '../entity-schema.model';
import { FormAction } from '../form-view-schema.model';

// ═══════════════════════════════════════════════════════════════════
// Field Definitions
// ═══════════════════════════════════════════════════════════════════

const SPIKE_FIELDS: EntityFieldDefinition[] = [
  // ─────────────────────────────────────────────────────────────────
  // Identity
  // ─────────────────────────────────────────────────────────────────
  {
    field: 'id',
    type: 'text',
    label: 'ID',
    isIdentifier: true,
    systemManaged: true,
    hidden: true,
  },
  
  // ─────────────────────────────────────────────────────────────────
  // Core Fields
  // ─────────────────────────────────────────────────────────────────
  {
    field: 'title',
    type: 'text',
    label: 'Title',
    isPrimary: true,
    browsable: true,
    sortable: true,
    filterable: true,
    searchable: true,
    searchWeight: 10,
    required: true,
    maxLength: 200,
    placeholder: 'Enter a descriptive title for this spike',
    helpText: 'A clear, concise title that describes the investigation',
    layout: { colSpan: 12 },
  },
  {
    field: 'description',
    type: 'textarea',
    label: 'Description',
    browsable: false,
    searchable: true,
    searchWeight: 5,
    rows: 4,
    placeholder: 'Describe the technical investigation...',
    helpText: 'What are we trying to learn or prove?',
    layout: { colSpan: 12 },
  },
  
  // ─────────────────────────────────────────────────────────────────
  // Classification
  // ─────────────────────────────────────────────────────────────────
  {
    field: 'status',
    type: 'select',
    label: 'Status',
    browsable: true,
    sortable: true,
    filterable: true,
    summary: true,
    required: true,
    defaultValue: 'draft',
    // Static options (no API needed)
    options: [
      { value: 'draft', label: 'Draft', icon: 'ri-draft-line' },
      { value: 'in_progress', label: 'In Progress', icon: 'ri-loader-line' },
      { value: 'completed', label: 'Completed', icon: 'ri-check-line' },
      { value: 'cancelled', label: 'Cancelled', icon: 'ri-close-line' },
    ],
    layout: { colSpan: 4 },
  },
  {
    field: 'priority',
    type: 'select',
    label: 'Priority',
    browsable: true,
    sortable: true,
    filterable: true,
    summary: true,
    defaultValue: 'medium',
    options: [
      { value: 'low', label: 'Low', icon: 'ri-arrow-down-line' },
      { value: 'medium', label: 'Medium', icon: 'ri-subtract-line' },
      { value: 'high', label: 'High', icon: 'ri-arrow-up-line' },
      { value: 'critical', label: 'Critical', icon: 'ri-fire-line' },
    ],
    layout: { colSpan: 4 },
  },
  {
    field: 'categoryId',
    type: 'select',
    label: 'Category',
    browsable: true,
    sortable: true,
    filterable: true,
    // Dynamic options from API using DSL
    optionsSource: {
      api: {
        endpoint: '/api/categories',
        valueField: 'id',
        labelField: 'name',
        iconField: 'icon',
        filter: "type == 'spike'",
        sort: 'order:asc,name:asc',
        cacheKey: 'spike-categories',
        cacheTtl: 600, // 10 minutes
      },
      includeEmpty: true,
      emptyLabel: 'Select category...',
    },
    layout: { colSpan: 4 },
  },
  
  // ─────────────────────────────────────────────────────────────────
  // Relationships
  // ─────────────────────────────────────────────────────────────────
  {
    field: 'assigneeId',
    type: 'select',
    label: 'Assignee',
    browsable: true,
    sortable: true,
    filterable: true,
    summary: true,
    // Reference to named lookup (defined in lookups array)
    lookupRef: 'users',
    layout: { colSpan: 6 },
  },
  {
    field: 'projectId',
    type: 'select',
    label: 'Project',
    browsable: true,
    sortable: true,
    filterable: true,
    // Dynamic options with dependency
    optionsSource: {
      api: {
        endpoint: '/api/projects',
        valueField: 'id',
        labelField: 'name',
        filter: "status == 'active'",
        cacheKey: 'active-projects',
        cacheTtl: 300,
      },
      includeEmpty: true,
      emptyLabel: 'No project',
    },
    layout: { colSpan: 6 },
  },
  {
    field: 'tags',
    type: 'multiselect',
    label: 'Tags',
    browsable: true,
    filterable: true,
    optionsSource: {
      api: {
        endpoint: '/api/tags',
        valueField: 'id',
        labelField: 'name',
        filter: "entity == 'spike'",
        cacheKey: 'spike-tags',
      },
    },
    layout: { colSpan: 12 },
  },
  
  // ─────────────────────────────────────────────────────────────────
  // Dates
  // ─────────────────────────────────────────────────────────────────
  {
    field: 'dueDate',
    type: 'date',
    label: 'Due Date',
    browsable: true,
    sortable: true,
    filterable: true,
    summary: true,
    layout: { colSpan: 6 },
    group: 'dates',
  },
  {
    field: 'estimatedHours',
    type: 'number',
    label: 'Estimated Hours',
    min: 0,
    max: 1000,
    step: 0.5,
    layout: { colSpan: 6 },
    group: 'dates',
  },
  
  // ─────────────────────────────────────────────────────────────────
  // Outcome
  // ─────────────────────────────────────────────────────────────────
  {
    field: 'findings',
    type: 'richtext',
    label: 'Findings',
    helpText: 'Document what was learned during the investigation',
    layout: { colSpan: 12 },
    tab: 'outcome',
  },
  {
    field: 'recommendation',
    type: 'select',
    label: 'Recommendation',
    options: [
      { value: 'proceed', label: 'Proceed with implementation' },
      { value: 'defer', label: 'Defer for future consideration' },
      { value: 'abandon', label: 'Abandon - not viable' },
      { value: 'more_research', label: 'Need more research' },
    ],
    layout: { colSpan: 6 },
    tab: 'outcome',
  },
  {
    field: 'actualHours',
    type: 'number',
    label: 'Actual Hours',
    min: 0,
    max: 1000,
    step: 0.5,
    layout: { colSpan: 6 },
    tab: 'outcome',
  },
  
  // ─────────────────────────────────────────────────────────────────
  // Audit Fields
  // ─────────────────────────────────────────────────────────────────
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
    label: 'Last Modified',
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
  },
];

// ═══════════════════════════════════════════════════════════════════
// Complete Entity Schema
// ═══════════════════════════════════════════════════════════════════

export const SPIKE_ENTITY_SCHEMA: EntitySchema = {
  dslVersion: '1.0.0',
  version: '1.0',
  id: 'spike',
  name: 'Spike',
  namePlural: 'Spikes',
  description: 'Technical investigation or proof-of-concept work',
  icon: 'ri-lightbulb-flash-line',
  color: '#6366f1', // Indigo
  
  // ─────────────────────────────────────────────────────────────────
  // Master Fields
  // ─────────────────────────────────────────────────────────────────
  fields: SPIKE_FIELDS,
  
  // ─────────────────────────────────────────────────────────────────
  // Named Lookups (reusable across fields)
  // ─────────────────────────────────────────────────────────────────
  lookups: [
    {
      id: 'users',
      name: 'Users',
      source: {
        api: {
          endpoint: '/api/users',
          valueField: 'id',
          labelField: 'displayName',
          iconField: 'avatarUrl',
          filter: "isActive == true",
          sort: 'displayName:asc',
          cacheKey: 'active-users',
          cacheTtl: 600,
          cacheScope: 'global',
        },
        includeEmpty: true,
        emptyLabel: 'Unassigned',
      },
      preload: true,
      cache: {
        enabled: true,
        ttlSeconds: 600,
        scope: 'global',
      },
    },
  ],
  
  // ─────────────────────────────────────────────────────────────────
  // Views
  // ─────────────────────────────────────────────────────────────────
  views: {
    // Browse view configuration
    browse: {
      version: '1.0',
      id: 'spike-browse',
      name: 'Spikes',
      title: 'Spikes',
      search: {
        enabled: true,
        placeholder: 'Search spikes by title or description...',
        searchFields: ['title', 'description'],
        minLength: 2,
        debounceMs: 300,
      },
      filter: {
        enabled: true,
        expanded: false,
        fields: SPIKE_FIELDS.filter(f => f.filterable) as any,
      },
      order: {
        enabled: true,
        expanded: false,
        fields: SPIKE_FIELDS.filter(f => f.sortable) as any,
        defaultSort: { id: 'default', field: 'updatedAt', direction: 'desc' },
      },
      display: {
        enabled: true,
        availableModes: ['tiles', 'table', 'cards', 'list'],
        defaultMode: 'tiles',
        // Using 'as any' for example flexibility
        columns: [
          { field: 'title', label: 'Title', sortable: true },
          { field: 'status', label: 'Status', sortable: true },
          { field: 'priority', label: 'Priority', sortable: true },
          { field: 'assigneeId', label: 'Assignee', sortable: true },
          { field: 'dueDate', label: 'Due Date', sortable: true },
          { field: 'updatedAt', label: 'Modified', sortable: true },
        ] as any,
      },
      pagination: {
        enabled: true,
        pageSize: 20,
        pageSizeOptions: [10, 20, 50, 100],
      },
      actions: {
        enabled: true,
        multiSelect: true,
        showSelectAll: true,
        actions: [
          {
            id: 'delete',
            label: 'Delete',
            icon: 'ri-delete-bin-line',
            variant: 'danger',
            minSelection: 1,
            confirmationMessage: 'Delete selected spikes?',
          },
          {
            id: 'export',
            label: 'Export',
            icon: 'ri-download-line',
            variant: 'secondary',
          },
        ],
      },
      emptyState: {
        message: 'No spikes found',
        icon: 'ri-lightbulb-line',
        showAddButton: true,
        addButtonLabel: 'Create Spike',
        addButtonRoute: '/spikes/add',
      },
    },
    
    // Edit view configuration
    edit: {
      version: '1.0',
      id: 'spike-edit',
      name: 'Edit Spike',
      titleTemplate: 'Edit: {{title}}',
      icon: 'ri-pencil-line',
      fields: SPIKE_FIELDS.filter(f => !f.systemManaged),
      tabs: [
        { id: 'general', label: 'General', icon: 'ri-information-line', fields: ['title', 'description', 'status', 'priority', 'categoryId', 'assigneeId', 'projectId', 'tags'] },
        { id: 'dates', label: 'Schedule', icon: 'ri-calendar-line', groups: ['dates'] },
        { id: 'outcome', label: 'Outcome', icon: 'ri-flag-line' },
        { id: 'audit', label: 'History', icon: 'ri-history-line' },
      ],
      groups: [
        { id: 'dates', label: 'Timeline', collapsible: true },
      ],
      layout: {
        columns: 12,
        spacing: 'normal',
        showRequiredIndicator: true,
      },
      showBottomActions: true,
      stickyActions: true,
      warnOnUnsavedChanges: true,
      validateOnBlur: true,
    },
    
    // Add and Detail are derived from Edit automatically
    // Override specific properties if needed:
    // add: { ... },
    // detail: { ... },
  },
  
  // ─────────────────────────────────────────────────────────────────
  // Data Source
  // ─────────────────────────────────────────────────────────────────
  dataSource: {
    endpoint: '/api/spikes',
    idField: 'id',
    softDelete: true,
    softDeleteField: 'isDeleted',
  },
  
  // ─────────────────────────────────────────────────────────────────
  // Permissions
  // ─────────────────────────────────────────────────────────────────
  permissions: {
    canView: true, // Everyone can view
    canCreate: 'spike.create',
    canEdit: 'spike.edit',
    canDelete: 'spike.delete',
    canExport: 'spike.export',
  },
  
  // ─────────────────────────────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────────────────────────────
  baseRoute: '/spikes',
  browseRoute: '/spikes',
  addRoute: '/spikes/add',
  editRoute: '/spikes/:id/edit',
  detailRoute: '/spikes/:id',
  
  // ─────────────────────────────────────────────────────────────────
  // Features
  // ─────────────────────────────────────────────────────────────────
  enableSoftDelete: true,
  enableVersioning: true,
  enableAudit: true,
  enableSearch: true,
  enableMru: true,
  mruMaxItems: 10,
};

// ═══════════════════════════════════════════════════════════════════
// Export as JSON (for API/file storage)
// ═══════════════════════════════════════════════════════════════════

/**
 * Get the schema as a JSON string
 * Useful for serving from API or storing in files
 */
export function getSpikeSchemaJson(): string {
  return JSON.stringify(SPIKE_ENTITY_SCHEMA, null, 2);
}
