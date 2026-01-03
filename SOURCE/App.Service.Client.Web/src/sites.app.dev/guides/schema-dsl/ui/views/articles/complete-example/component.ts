/**
 * Complete Example Article Component
 * 
 * Full walkthrough of the Spike entity schema demonstrating all features.
 * 
 * Route: /dev/guides/schema-dsl/example
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-complete-example-article',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './component.html',
  styles: [`
    .article-container {
      padding: 1.5rem;
      max-width: 900px;
    }
    
    pre {
      font-size: 12px;
      line-height: 1.4;
    }
  `]
})
export class CompleteExampleArticleComponent {
  // Code examples stored as component properties to avoid Angular template parsing issues

  readonly identityCode = `export const SPIKE_ENTITY_SCHEMA: EntitySchema = {
  dslVersion: '1.0.0',
  version: '1.0',
  id: 'spike',                  // Unique identifier
  name: 'Spike',                // Singular display name
  namePlural: 'Spikes',         // Plural display name
  description: 'Technical investigation or proof-of-concept work',
  icon: 'ri-lightbulb-flash-line',
  color: '#6366f1',             // Indigo
  
  // ... more configuration
}`;

  readonly idFieldCode = `{
  field: 'id',
  type: 'text',
  label: 'ID',
  isIdentifier: true,       // This is the unique ID field
  systemManaged: true,      // System generates this
  hidden: true,             // Don't show in forms
}`;

  readonly titleFieldCode = `{
  field: 'title',
  type: 'text',
  label: 'Title',
  isPrimary: true,          // Main display field (used in cards)
  browsable: true,          // Show in browse list
  sortable: true,           // Can sort by this
  filterable: true,         // Can filter by this
  searchable: true,         // Include in search
  searchWeight: 10,         // High relevance in search
  required: true,
  maxLength: 200,
  placeholder: 'Enter a descriptive title for this spike',
  helpText: 'A clear, concise title that describes the investigation',
  layout: { colSpan: 12 }  // Full width
}`;

  readonly statusFieldCode = `{
  field: 'status',
  type: 'select',
  label: 'Status',
  browsable: true,
  sortable: true,
  filterable: true,
  summary: true,            // Show as badge on cards
  required: true,
  defaultValue: 'draft',
  options: [
    { value: 'draft', label: 'Draft', icon: 'ri-draft-line' },
    { value: 'in_progress', label: 'In Progress', icon: 'ri-loader-line' },
    { value: 'completed', label: 'Completed', icon: 'ri-check-line' },
    { value: 'cancelled', label: 'Cancelled', icon: 'ri-close-line' }
  ],
  layout: { colSpan: 4 }
}`;

  readonly categoryFieldCode = `{
  field: 'categoryId',
  type: 'select',
  label: 'Category',
  browsable: true,
  sortable: true,
  filterable: true,
  optionsSource: {
    api: {
      endpoint: '/api/categories',
      valueField: 'id',
      labelField: 'name',
      iconField: 'icon',
      filter: "type == 'spike'",
      sort: 'order:asc,name:asc',
      cacheKey: 'spike-categories',
      cacheTtl: 600            // 10 minutes
    },
    includeEmpty: true,
    emptyLabel: 'Select category...'
  },
  layout: { colSpan: 4 }
}`;

  readonly assigneeFieldCode = `{
  field: 'assigneeId',
  type: 'select',
  label: 'Assignee',
  browsable: true,
  sortable: true,
  filterable: true,
  summary: true,
  lookupRef: 'users',       // References named lookup below
  layout: { colSpan: 6 }
}`;

  readonly tabGroupFieldsCode = `// These fields go in the "dates" group
{
  field: 'dueDate',
  type: 'date',
  label: 'Due Date',
  browsable: true,
  sortable: true,
  layout: { colSpan: 6 },
  group: 'dates'            // Placed in "dates" group
},
{
  field: 'estimatedHours',
  type: 'number',
  label: 'Estimated Hours',
  min: 0,
  max: 1000,
  step: 0.5,
  layout: { colSpan: 6 },
  group: 'dates'
},

// These fields go in the "outcome" tab
{
  field: 'findings',
  type: 'richtext',
  label: 'Findings',
  helpText: 'Document what was learned during the investigation',
  layout: { colSpan: 12 },
  tab: 'outcome'            // Placed in "outcome" tab
}`;

  readonly lookupsCode = `lookups: [
  {
    id: 'users',              // Referenced by field.lookupRef
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
        cacheScope: 'global'
      },
      includeEmpty: true,
      emptyLabel: 'Unassigned'
    },
    preload: true,            // Load on schema init
    cache: {
      enabled: true,
      ttlSeconds: 600,
      scope: 'global'
    }
  }
]`;

  readonly browseViewCode = `views: {
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
      debounceMs: 300
    },
    
    filter: {
      enabled: true,
      expanded: false,
      fields: SPIKE_FIELDS.filter(f => f.filterable)
    },
    
    order: {
      enabled: true,
      fields: SPIKE_FIELDS.filter(f => f.sortable),
      defaultSort: { id: 'default', field: 'updatedAt', direction: 'desc' }
    },
    
    display: {
      enabled: true,
      availableModes: ['tiles', 'table', 'cards', 'list'],
      defaultMode: 'tiles',
      columns: [
        { field: 'title', label: 'Title', sortable: true },
        { field: 'status', label: 'Status', sortable: true },
        { field: 'priority', label: 'Priority', sortable: true },
        { field: 'assigneeId', label: 'Assignee', sortable: true },
        { field: 'dueDate', label: 'Due Date', sortable: true },
        { field: 'updatedAt', label: 'Modified', sortable: true }
      ]
    },
    
    pagination: {
      enabled: true,
      pageSize: 20,
      pageSizeOptions: [10, 20, 50, 100]
    },
    
    actions: {
      enabled: true,
      multiSelect: true,
      actions: [
        {
          id: 'delete',
          label: 'Delete',
          icon: 'ri-delete-bin-line',
          variant: 'danger',
          minSelection: 1,
          confirmationMessage: 'Delete selected spikes?'
        }
      ]
    },
    
    emptyState: {
      message: 'No spikes found',
      icon: 'ri-lightbulb-line',
      showAddButton: true,
      addButtonLabel: 'Create Spike',
      addButtonRoute: '/spikes/add'
    }
  },`;

  readonly editViewCode = `  edit: {
    version: '1.0',
    id: 'spike-edit',
    name: 'Edit Spike',
    titleTemplate: 'Edit: {{title}}',
    icon: 'ri-pencil-line',
    
    fields: SPIKE_FIELDS.filter(f => !f.systemManaged),
    
    tabs: [
      {
        id: 'general',
        label: 'General',
        icon: 'ri-information-line',
        fields: ['title', 'description', 'status', 'priority', 
                 'categoryId', 'assigneeId', 'projectId', 'tags']
      },
      {
        id: 'dates',
        label: 'Schedule',
        icon: 'ri-calendar-line',
        groups: ['dates']
      },
      {
        id: 'outcome',
        label: 'Outcome',
        icon: 'ri-flag-line'
      },
      {
        id: 'audit',
        label: 'History',
        icon: 'ri-history-line'
      }
    ],
    
    groups: [
      { id: 'dates', label: 'Timeline', collapsible: true }
    ],
    
    layout: {
      columns: 12,
      spacing: 'normal',
      showRequiredIndicator: true
    },
    
    showBottomActions: true,
    stickyActions: true,
    warnOnUnsavedChanges: true,
    validateOnBlur: true
  }
  
  // Add and Detail are derived from Edit automatically
}`;

  readonly dataSourceCode = `dataSource: {
  endpoint: '/api/spikes',
  idField: 'id',
  softDelete: true,
  softDeleteField: 'isDeleted'
},

permissions: {
  canView: true,              // Everyone can view
  canCreate: 'spike.create',  // Requires permission
  canEdit: 'spike.edit',
  canDelete: 'spike.delete',
  canExport: 'spike.export'
},

// Navigation routes
baseRoute: '/spikes',
browseRoute: '/spikes',
addRoute: '/spikes/add',
editRoute: '/spikes/:id/edit',
detailRoute: '/spikes/:id',

// Features
enableSoftDelete: true,
enableVersioning: true,
enableAudit: true,
enableSearch: true,
enableMru: true,
mruMaxItems: 10`;

  readonly usageComponentCode = `import { SPIKE_ENTITY_SCHEMA } from './spike-entity-schema.example';
import { getBrowseViewSchema, getEditViewSchema } from '../entity-schema.model';

@Component({...})
export class SpikeListComponent {
  schema = SPIKE_ENTITY_SCHEMA;
  browseSchema = getBrowseViewSchema(this.schema);
  
  // Use in template:
  // <app-browse-view [schema]="browseSchema"></app-browse-view>
}`;

  readonly usageApiCode = `// Fetch schema from server
this.http.get<EntitySchema>('/api/schema/entities/spike')
  .subscribe(schema => {
    this.schema = schema;
    this.browseSchema = getBrowseViewSchema(schema);
  });`;

  readonly usageJsonCode = `import { getSpikeSchemaJson } from './spike-entity-schema.example';

// Get as JSON string for API/file storage
const jsonSchema = getSpikeSchemaJson();
console.log(jsonSchema);`;
}
