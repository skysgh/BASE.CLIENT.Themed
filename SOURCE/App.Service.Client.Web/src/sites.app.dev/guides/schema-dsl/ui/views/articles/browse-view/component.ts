/**
 * Browse View Article Component
 * 
 * Configuring browse/list views with filters, sorting, and display modes.
 * Uses standard PageHeader for consistent navigation.
 * 
 * Route: /dev/guides/schema-dsl/browse
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from '../../../../../../../sites/ui/widgets/page-header';

@Component({
  selector: 'app-browse-view-article',
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
  `]
})
export class BrowseViewArticleComponent {
  // Code examples stored as component properties to avoid Angular template parsing issues
  
  readonly schemaCode = `interface BrowseViewSchema {
  version?: string;          // Schema version
  id?: string;               // Unique view ID
  name?: string;             // View name (for saved views)
  
  // Header
  title?: string;            // View title
  titleKey?: string;         // i18n key for title
  
  // Panels
  search?: BrowseSearchSchema;
  filter?: BrowseFilterSchema;
  order?: BrowseOrderSchema;
  display?: BrowseDisplaySchema;
  pagination?: BrowsePaginationSchema;
  actions?: BrowseActionsSchema;
  
  // Empty State
  emptyState?: BrowseEmptyStateSchema;
}`;

  readonly searchCode = `search: {
  enabled: true,
  placeholder: 'Search spikes by title or description...',
  placeholderKey: 'SPIKE.SEARCH_PLACEHOLDER',  // i18n
  query: '',                    // Current search query
  minLength: 2,                 // Min chars before search
  debounceMs: 300,              // Debounce delay
  searchFields: ['title', 'description']  // Fields to search
}`;

  readonly filterCode = `filter: {
  enabled: true,
  expanded: false,              // Start collapsed
  fields: [
    {
      field: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
      ]
    },
    {
      field: 'priority',
      label: 'Priority',
      type: 'select',
      options: [...]
    },
    {
      field: 'dueDate',
      label: 'Due Date',
      type: 'date'
    },
    {
      field: 'assigneeId',
      label: 'Assignee',
      type: 'select',
      optionsSource: {
        api: { endpoint: '/api/users', valueField: 'id', labelField: 'name' }
      }
    }
  ],
  activeFilters: [],           // Currently applied filters
  maxFilters: 5,               // Max number of active filters
  defaultFilter: {             // Applied on load
    field: 'status',
    operator: 'ne',
    value: 'deleted'
  }
}`;

  readonly orderCode = `order: {
  enabled: true,
  expanded: false,
  fields: [
    { field: 'title', label: 'Title', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
    { field: 'priority', label: 'Priority', sortable: true },
    { field: 'dueDate', label: 'Due Date', sortable: true },
    { field: 'updatedAt', label: 'Modified', sortable: true }
  ],
  activeSorts: [],
  maxSorts: 3,                 // Multi-column sorting
  defaultSort: {
    id: 'default',
    field: 'updatedAt',
    direction: 'desc'
  }
}`;

  readonly displayCode = `display: {
  enabled: true,
  availableModes: ['tiles', 'table', 'cards', 'list', 'chart'],
  defaultMode: 'tiles',
  
  // Table-specific
  columns: [
    { field: 'title', label: 'Title', sortable: true, width: '30%' },
    { field: 'status', label: 'Status', sortable: true, width: '100px' },
    { field: 'priority', label: 'Priority', sortable: true },
    { field: 'assigneeId', label: 'Assignee', sortable: true },
    { field: 'dueDate', label: 'Due Date', sortable: true },
    { field: 'updatedAt', label: 'Modified', sortable: true }
  ],
  
  // Cards-specific
  cardsPerRow: 4,
  showCardImages: true,
  showCardBadges: true,
  
  // Chart-specific
  charts: [
    {
      id: 'by-status',
      type: 'pie',
      title: 'By Status',
      groupByField: 'status'
    },
    {
      id: 'by-priority',
      type: 'bar',
      title: 'By Priority',
      groupByField: 'priority'
    }
  ],
  defaultChartId: 'by-status'
}`;

  readonly paginationCode = `pagination: {
  enabled: true,
  pageSize: 20,                  // Items per page
  pageSizeOptions: [10, 20, 50, 100],
  page: 1                        // Current page (1-based)
}`;

  readonly actionsCode = `actions: {
  enabled: true,
  multiSelect: true,
  showSelectAll: true,
  showSelectionCount: true,
  actions: [
    {
      id: 'delete',
      label: 'Delete',
      icon: 'ri-delete-bin-line',
      variant: 'danger',
      minSelection: 1,
      confirmationMessage: 'Delete selected items?'
    },
    {
      id: 'export',
      label: 'Export',
      icon: 'ri-download-line',
      variant: 'secondary',
      minSelection: 0           // Works with 0 or more selected
    },
    {
      id: 'assign',
      label: 'Assign To...',
      icon: 'ri-user-add-line',
      variant: 'primary',
      minSelection: 1
    }
  ]
}`;

  readonly emptyStateCode = `emptyState: {
  message: 'No spikes found',
  messageKey: 'SPIKE.EMPTY_MESSAGE',
  icon: 'ri-lightbulb-line',
  showAddButton: true,
  addButtonLabel: 'Create Spike',
  addButtonRoute: '/spikes/add'
}`;
}
