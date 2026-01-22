/**
 * Entity Definition Article Component
 * 
 * How to define entity schemas with fields, lookups, and data sources.
 * Uses standard PageHeader for consistent navigation.
 * 
 * Route: /dev/guides/schema-dsl/entity
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from '../../../../../../../sites/ui/widgets/page-header';

@Component({
  selector: 'app-entity-definition-article',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent],
  templateUrl: './component.html',
  styles: [`
    .article-container {
      padding: 1.5rem;
      max-width: 1000px;
    }
    
    pre {
      font-size: 12px;
      line-height: 1.4;
    }
    
    code {
      font-size: 0.85em;
    }
  `]
})
export class EntityDefinitionArticleComponent {
  // Code examples stored as component properties to avoid Angular template parsing issues

  readonly entitySchemaCode = `interface EntitySchema {
  // Identity
  dslVersion: string;        // Schema DSL version (e.g., "1.0.0")
  id: string;                // Unique entity ID (e.g., "spike")
  name: string;              // Singular name (e.g., "Spike")
  namePlural: string;        // Plural name (e.g., "Spikes")
  description?: string;      // Entity description
  icon?: string;             // Icon class (e.g., "ri-lightbulb-flash-line")
  color?: string;            // Theme color (e.g., "#6366f1")
  
  // Core Definitions
  fields: EntityFieldDefinition[];  // Master field definitions
  lookups?: EntityLookup[];         // Reusable lookup sources
  views: EntityViews;               // View configurations
  
  // Data & API
  dataSource: EntityDataSource;     // API endpoints
  permissions?: EntityPermissions;  // Access control
  
  // Navigation
  baseRoute?: string;        // Base URL path
  browseRoute?: string;      // Browse view route
  addRoute?: string;         // Add view route
  editRoute?: string;        // Edit view route
  detailRoute?: string;      // Detail view route
  
  // Features
  enableSoftDelete?: boolean;
  enableVersioning?: boolean;
  enableAudit?: boolean;
  enableSearch?: boolean;
  enableMru?: boolean;       // Most Recently Used tracking
  mruMaxItems?: number;
}`;

  readonly fieldDefinitionCode = `interface EntityFieldDefinition {
  // Identity
  field: string;             // Field name (e.g., "title")
  type: FieldType;           // Data type (see table above)
  label: string;             // Display label
  
  // Behavior Flags
  required?: boolean;        // Is this field required?
  readonly?: boolean;        // Is this field read-only?
  hidden?: boolean;          // Hide from all views?
  systemManaged?: boolean;   // Managed by system (createdAt, etc.)
  
  // View Hints
  browsable?: boolean;       // Show in browse/list view?
  sortable?: boolean;        // Can sort by this field?
  filterable?: boolean;      // Can filter by this field?
  searchable?: boolean;      // Include in text search?
  searchWeight?: number;     // Search relevance (higher = more relevant)
  summary?: boolean;         // Show in card summaries?
  isPrimary?: boolean;       // Primary display field (title/name)?
  isIdentifier?: boolean;    // Unique ID field?
  
  // Validation
  minLength?: number;
  maxLength?: number;
  min?: number;              // For numbers
  max?: number;              // For numbers
  pattern?: string;          // Regex pattern
  
  // UI Hints
  placeholder?: string;
  helpText?: string;
  defaultValue?: unknown;
  
  // Layout
  layout?: {
    colSpan?: number;        // Column span (1-12)
    rowSpan?: number;
  }
  tab?: string;              // Tab ID to place field in
  group?: string;            // Group ID to place field in
  
  // Options (for select/multiselect)
  options?: FieldOption[];   // Static options
  optionsSource?: OptionsSource;  // Dynamic options from API
  lookupRef?: string;        // Reference to named lookup
}`;

  readonly fieldExamplesCode = `const fields: EntityFieldDefinition[] = [
  // Simple text field
  {
    field: 'title',
    type: 'text',
    label: 'Title',
    isPrimary: true,
    required: true,
    maxLength: 200,
    placeholder: 'Enter a title',
    layout: { colSpan: 12 }
  },
  
  // Select with static options
  {
    field: 'status',
    type: 'select',
    label: 'Status',
    required: true,
    defaultValue: 'draft',
    options: [
      { value: 'draft', label: 'Draft', icon: 'ri-draft-line' },
      { value: 'active', label: 'Active', icon: 'ri-check-line' },
      { value: 'closed', label: 'Closed', icon: 'ri-close-line' }
    ],
    layout: { colSpan: 4 }
  },
  
  // Select with API-driven options
  {
    field: 'categoryId',
    type: 'select',
    label: 'Category',
    optionsSource: {
      api: {
        endpoint: '/api/categories',
        valueField: 'id',
        labelField: 'name',
        filter: "type == 'spike'",
        cacheKey: 'spike-categories'
      },
      includeEmpty: true,
      emptyLabel: 'Select...'
    },
    layout: { colSpan: 4 }
  },
  
  // Reference to named lookup
  {
    field: 'assigneeId',
    type: 'select',
    label: 'Assignee',
    lookupRef: 'users',  // References lookups[].id
    layout: { colSpan: 6 }
  }
];`;

  readonly lookupsCode = `const schema: EntitySchema = {
  // ...
  lookups: [
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
          cacheTtl: 600,        // 10 minutes
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
  ],
  // ...
}`;

  readonly dataSourceCode = `dataSource: {
  endpoint: '/api/spikes',     // Base API endpoint
  idField: 'id',               // Primary key field
  
  // Optional: Override specific endpoints
  listEndpoint: '/api/spikes', 
  getEndpoint: '/api/spikes/:id',
  createEndpoint: '/api/spikes',
  updateEndpoint: '/api/spikes/:id',
  deleteEndpoint: '/api/spikes/:id',
  
  // Soft delete
  softDelete: true,
  softDeleteField: 'isDeleted'
}`;

  readonly permissionsCode = `permissions: {
  canView: true,              // Everyone can browse/view
  canCreate: 'spike.create',  // Requires spike.create permission
  canEdit: 'spike.edit',
  canDelete: 'spike.delete',
  canExport: 'spike.export',
  canImport: false            // No one can import
}`;
}
