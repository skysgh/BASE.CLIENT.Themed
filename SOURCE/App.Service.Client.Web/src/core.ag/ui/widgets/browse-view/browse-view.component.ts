/**
 * BrowseView Component
 * 
 * Universal component for browsing/searching collections.
 * Uses dynamic filter/sort criteria system with multi-select support.
 * 
 * SCHEMA-BASED CONFIGURATION:
 * The component can be configured via schema for server-driven UI:
 * ```html
 * <!-- From object -->
 * <app-browse-view [schema]="mySchema" [cards]="data"></app-browse-view>
 * 
 * <!-- From JSON string -->
 * <app-browse-view [serialisedSchema]="jsonFromServer" [cards]="data"></app-browse-view>
 * ```
 * 
 * Structure:
 * ┌────────────────────────────────────────────────────────────┐
 * │ Search Panel                                        │
 * ├────────────────────────────────────────────────────────────┤
 * │ Filter Panel (read/write toggle)                   │
 * ├────────────────────────────────────────────────────────────┤
 * │ Order Panel (read/write toggle)                    │
 * ├────────────────────────────────────────────────────────────┤
 * │ Display: List              [Cards][Tiles][Table][📊]│
 * ├────────────────────────────────────────────────────────────┤
 * │ Results: 5 items (2 selected)                      │
 * │ (cards/tiles/table/list/chart)                     │
 * └────────────────────────────────────────────────────────────┘
 */
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectionStrategy,
  signal,
  computed,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { IUniversalCardData, ICardAction } from '../../../../core/models/presentation/universal-card.model';
import { IColumnDefinition } from '../../../../core/models/presentation/presentation-profile.model';
import { 
  FilterCriteria, 
  SortCriteria, 
  FieldDefinition,
} from '../../../../core/models/query/query-criteria.model';
import {
  SelectionState,
  SelectionEvent,
  createSelectionState,
  handleSelection,
} from '../../../../core/models/query/selection.model';
import { ChartDefinition, ChartType } from '../../../../core/models/query/chart-definition.model';
import { BatchAction, BatchActionEvent } from '../../../../core/models/query/batch-action.model';

// Schema imports
import { 
  BrowseViewSchema,
  parseBrowseViewSchema,
  mergeBrowseViewSchema,
  ViewMode,
} from './browse-view-schema.model';

import { BrowseSearchPanelComponent } from './browse-search-panel.component';
import { BrowseFilterPanelComponent } from './browse-filter-panel.component';
import { BrowseOrderPanelComponent } from './browse-order-panel.component';
import { BrowseDisplayPanelComponent } from './browse-display-panel.component';
import { BrowseActionsBarComponent } from './browse-actions-bar.component';
import { BrowsePaginationComponent } from './browse-pagination.component';
import { ViewPanelComponent } from './view-panel.component';
import { CardsRendererComponent } from './renderers/cards-renderer.component';
import { TilesRendererComponent } from './renderers/tiles-renderer.component';
import { TableRendererComponent } from './renderers/table-renderer.component';
import { ListRendererComponent } from './renderers/list-renderer.component';
import { ChartRendererComponent } from './renderers/chart-renderer.component';

// Responsive editor for flyout mode
import { ResponsiveEditorHostComponent, ResponsiveEditorContentDirective } from '../responsive-editor';
import { BrowseViewOptionsPanelComponent } from './browse-options-panel.component';

import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
import { SavedView } from '../../../../core/models/view/saved-view.model';
import { SavedViewService } from '../../../../core/services/saved-view.service';

// Re-export for consumers
export { ViewMode } from './browse-view-schema.model';
export { BrowseViewSchema } from './browse-view-schema.model';
export { SavedView } from '../../../../core/models/view/saved-view.model';

/** Sort change event (legacy compatibility) */
export interface SortChangeEvent {
  column: string;
  direction: 'asc' | 'desc';
}

/** Card click event with modifiers */
export interface CardClickEvent {
  card: IUniversalCardData;
  ctrlKey: boolean;
  shiftKey: boolean;
  isLongPress?: boolean;
}

@Component({
  selector: 'app-browse-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbDropdownModule,
    BrowseSearchPanelComponent,
    BrowseFilterPanelComponent,
    BrowseOrderPanelComponent,
    BrowseDisplayPanelComponent,
    BrowseActionsBarComponent,
    BrowsePaginationComponent,
    ViewPanelComponent,
    CardsRendererComponent,
    TilesRendererComponent,
    TableRendererComponent,
    ListRendererComponent,
    ChartRendererComponent,
    ResponsiveEditorHostComponent,
    ResponsiveEditorContentDirective,
    BrowseViewOptionsPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="browse-view">
    <!-- Row 1: Search + Configure (flyout mode puts configure here) -->
    <div class="browse-toolbar d-flex align-items-center gap-2 mb-2">
      <!-- View Selector Button (icon + current view name) - only when entityType set -->
      @if (entityType && controlsLayout === 'panels') {
        <button 
          type="button"
          class="btn btn-light d-flex align-items-center gap-2"
          [class.active]="viewPanelMode !== 'collapsed'"
          (click)="toggleViewPanel()">
          <i class="bx bx-layer text-primary"></i>
          <span class="fst-italic text-muted">{{ currentViewName }}</span>
        </button>
      }
        
      <!-- Search -->
      @if (showSearch) {
        <div class="flex-grow-1">
          <app-browse-search-panel
            [query]="searchQuery"
            [placeholder]="searchPlaceholder"
            [entityIcon]="searchEntityIcon"
            [hint]="searchHint"
            (queryChange)="onSearchChange($event)"
            (search)="onSearchSubmit($event)"
            (clear)="onSearchClear()">
          </app-browse-search-panel>
        </div>
      }
        
      <!-- Configure View button (flyout mode only - on same line as search) -->
        @if (controlsLayout === 'flyout' && viewPanelMode === 'collapsed') {
          <button 
            type="button" 
            class="btn btn-soft-secondary btn-sm d-flex align-items-center gap-2 flex-shrink-0"
            (click)="openOptions()">
            <i class="bx bx-slider-alt"></i>
            <span class="d-none d-sm-inline">Configure</span>
            @if (filters.length > 0 || sorts.length > 0) {
              <span class="badge bg-primary">{{ filters.length + sorts.length }}</span>
            }
          </button>
        }
      </div>
      
    <!-- Row 2: View Panel (full width, shows list OR editor) -->
    @if (viewPanelMode !== 'collapsed') {
      <div class="view-panel-area mb-2">
        <app-view-panel
          [entityType]="entityType!"
          [currentParams]="currentParams"
          [filters]="filters"
          [sorts]="sorts"
          [viewMode]="viewMode"
          [fields]="fields"
          [chartDefinitions]="chartDefinitions"
          [mode]="viewPanelMode"
            (modeChange)="viewPanelMode = $event"
            (viewSelect)="onSavedViewSelect($event)"
            (filtersChange)="onFiltersChange($event); onApply()"
            (sortsChange)="onSortsChange($event); onApply()"
            (viewModeChange)="onViewModeChange($event)"
            (apply)="onApply()"
            (close)="viewPanelMode = 'collapsed'">
          </app-view-panel>
        </div>
      }
      
      <!-- Row 3+: Filter/Order/Display Panels (only when view panel collapsed) -->
      @if (viewPanelMode === 'collapsed') {
        <!-- Panels mode: Show inline panels -->
        @if (controlsLayout === 'panels') {
          <div class="browse-panels mb-2">
            @if (showFilterPanel) {
              <app-browse-filter-panel
                [filters]="filters"
                [fields]="fields"
                [expanded]="filtersExpanded"
                (filtersChange)="onFiltersChange($event)"
                (expandedChange)="filtersExpanded = $event"
                (apply)="onApply()">
              </app-browse-filter-panel>
            }
            
            @if (showOrderPanel) {
              <app-browse-order-panel
                [sorts]="sorts"
                [fields]="fields"
                [expanded]="orderExpanded"
                (sortsChange)="onSortsChange($event)"
                (expandedChange)="orderExpanded = $event"
                (apply)="onApply()">
              </app-browse-order-panel>
            }
            
            @if (showDisplayPanel) {
              <app-browse-display-panel
                [viewMode]="viewMode"
                [chartDefinitions]="chartDefinitions"
                [selectedChartId]="selectedChartId"
                (viewModeChange)="onViewModeChange($event)"
                (chartDefinitionChange)="onChartDefinitionChange($event)">
              </app-browse-display-panel>
            }
          </div>
        }
        
        <!-- Flyout mode: Show active criteria summary (optional) -->
        @if (controlsLayout === 'flyout' && (filters.length > 0 || sorts.length > 0)) {
          <div class="active-criteria-summary text-muted small mb-2">
            @if (filters.length > 0) {
              <span class="me-3">
                <i class="bx bx-filter-alt"></i> {{ filters.length }} filter{{ filters.length > 1 ? 's' : '' }} applied
              </span>
            }
            @if (sorts.length > 0) {
              <span>
                <i class="bx bx-sort-alt-2"></i> Sorted by {{ sorts[0].field }}
                        </span>
                      }
                    </div>
                  }
                }
      
                <!-- Results Count -->
                @if (!loading && cards.length > 0) {
                  <div class="results-count text-muted small mb-1">
                    {{ totalCount }} items
                  </div>
                }
      
                <!-- Results Area -->
                <div class="browse-results">
                  @if (loading) {
                    <div class="text-center py-5">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  }

                  @if (!loading && cards.length === 0) {
          <div class="text-center py-5">
            <i [class]="emptyIcon + ' display-1 text-muted'"></i>
            <h5 class="mt-3 text-muted">{{ emptyMessage }}</h5>
            <ng-content select="[emptyActions]"></ng-content>
          </div>
        }

        @if (!loading && cards.length > 0) {
          @switch (viewMode) {
            @case ('cards') {
              <app-cards-renderer
                [cards]="cards"
                [selectedIds]="selectedIds()"
                (cardClick)="handleCardClick($event)"
                (cardAction)="onCardAction($event)">
              </app-cards-renderer>
            }
            @case ('tiles') {
              <app-tiles-renderer
                [cards]="cards"
                [selectedIds]="selectedIds()"
                (cardClick)="handleCardClick($event)"
                (cardAction)="onCardAction($event)">
              </app-tiles-renderer>
            }
            @case ('table') {
              <app-table-renderer
                [cards]="cards"
                [columns]="columns"
                [selectedIds]="selectedIds()"
                [sortColumn]="sorts.length > 0 ? sorts[0].field : ''"
                [sortDirection]="sorts.length > 0 ? sorts[0].direction : 'asc'"
                (sortChange)="onTableSortChange($event)"
                (cardClick)="handleCardClick($event)"
                (cardAction)="onCardAction($event)">
              </app-table-renderer>
            }
            @case ('list') {
              <app-list-renderer
                [cards]="cards"
                [selectedIds]="selectedIds()"
                (cardClick)="handleCardClick($event)">
              </app-list-renderer>
            }
            @case ('chart') {
              @if (selectedChart) {
                <app-chart-renderer
                  [cards]="cards"
                  [chartDefinition]="selectedChart">
                </app-chart-renderer>
              }
            }
          }
        }

        @if (!loading && totalPages > 1) {
          <app-browse-pagination
            [page]="page"
            [pageSize]="pageSize"
            [totalCount]="totalCount"
            [totalPages]="totalPages"
            (pageChange)="onPageChange($event)">
          </app-browse-pagination>
        }
              </div>
            </div>
    
            <!-- Options Flyout (for flyout mode) -->
            <app-responsive-editor-host
              [title]="'Configure View'"
              [isOpen]="isOptionsOpen"
              [config]="flyoutConfig"
              (closed)="closeOptions()"
              (saved)="applyOptions()">
      
              <ng-template responsiveEditorContent>
                <app-browse-options-panel
                  [fields]="fields"
                  [filters]="filters"
                  [sorts]="sorts"
                  [viewMode]="viewMode"
                  [chartDefinitions]="chartDefinitions"
                  [selectedChartId]="selectedChartId"
                  [showApplyButton]="true"
                  (filtersChange)="onFiltersChange($event)"
                  (sortsChange)="onSortsChange($event)"
                  (viewModeChange)="onViewModeChange($event)"
                  (chartDefinitionChange)="onChartDefinitionChange($event)"
                  (apply)="applyOptions()"
                  (reset)="resetOptions()">
                </app-browse-options-panel>
              </ng-template>
            </app-responsive-editor-host>
          `,
          styles: [`
            .current-view-label {
              font-size: 0.8125rem;
              color: var(--vz-secondary-color);
              white-space: nowrap;
            }
    
            .view-panel-area {
              // Full width panel area
            }
    
            .browse-panels {
              display: flex;
              flex-direction: column;
              gap: 0.25rem;
            }
    
            .browse-flyout-bar {
              background: var(--vz-light);
              border: 1px solid var(--vz-border-color);
              border-radius: 0.25rem;
              padding: 0.5rem 0.75rem;
            }
    
            .results-count {
              font-size: 0.8125rem;
            }
          `]
        })
export class BrowseViewComponent implements OnChanges {
  private diagnostics = inject(SystemDiagnosticsTraceService);
  private savedViewService = inject(SavedViewService);
  
  // ═══════════════════════════════════════════════════════════════════
  // View Mode Options (for template)
  // ═══════════════════════════════════════════════════════════════════
  
  viewModeOptions = [
    { id: 'cards' as ViewMode, icon: 'bx bx-grid-alt', label: 'Cards' },
    { id: 'tiles' as ViewMode, icon: 'bx bx-menu', label: 'Tiles' },
    { id: 'table' as ViewMode, icon: 'bx bx-table', label: 'Table' },
    { id: 'list' as ViewMode, icon: 'bx bx-list-ul', label: 'List' },
  ];
  
  /** 
   * Configuration for the flyout panel
   * Always uses panel mode (never route mode) since we handle mobile inline
   */
  flyoutConfig = {
    panelWidth: '360px',
    panelPosition: 'end' as const,
    showBackdrop: true,
    closeOnBackdrop: true,
    routeModeBreakpoint: undefined,  // Never use route mode - always panel
  };

  // ═══════════════════════════════════════════════════════════════════
  // Lifecycle
  // ═══════════════════════════════════════════════════════════════════
  
  ngOnChanges(changes: SimpleChanges): void {
    // When schema changes, apply it
    if (changes['schema'] && this.schema) {
      this.applySchema(this.schema);
    }
    
    // When serialisedSchema changes, parse and apply it
    if (changes['serialisedSchema'] && this.serialisedSchema) {
      const parsed = parseBrowseViewSchema(this.serialisedSchema);
      if (parsed) {
        this._schema = parsed;
        this.applySchema(parsed);
      } else {
        this.diagnostics.warn('BrowseView: Failed to parse serialisedSchema');
      }
    }
    
    // When cards change (new data loaded), clear selection
    if (changes['cards'] && !changes['cards'].firstChange) {
      this.clearSelection();
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Inputs - Schema (NEW)
  // ═══════════════════════════════════════════════════════════════════
  
  /** 
   * Schema object for declarative configuration
   * When set, this hydrates all other inputs from the schema
   */
  @Input() 
  set schema(value: BrowseViewSchema | undefined) {
    if (value) {
      this._schema = mergeBrowseViewSchema(value);
    }
  }
  get schema(): BrowseViewSchema | undefined {
    return this._schema;
  }
  private _schema?: BrowseViewSchema;
  
  /**
   * JSON string to parse into schema
   * Convenience input for server-driven UI
   */
  @Input() serialisedSchema?: string;
  
  /**
   * Apply schema to component inputs
   */
  private applySchema(schema: BrowseViewSchema): void {
    this.diagnostics.debug(`BrowseView: Applying schema ${schema.id || schema.name || 'unnamed'}`);
    
    // Search
    if (schema.search) {
      this.showSearch = schema.search.enabled ?? true;
      this.searchPlaceholder = schema.search.placeholder ?? 'Search...';
      this.searchQuery = schema.search.query ?? '';
      // TODO: Apply minLength, debounceMs, searchFields when search panel supports them
    }
    
    // Filter
    if (schema.filter) {
      this.showFilterPanel = schema.filter.enabled ?? true;
      this.filtersExpanded = schema.filter.expanded ?? false;
      if (schema.filter.fields) {
        this.fields = schema.filter.fields;
      }
      if (schema.filter.activeFilters) {
        this.filters = schema.filter.activeFilters;
      }
      // Apply default filter if no active filters and default is specified
      if (this.filters.length === 0 && schema.filter.defaultFilter) {
        this.filters = [schema.filter.defaultFilter];
      }
      // TODO: Apply maxFilters when filter panel supports it
    }
    
    // Order
    if (schema.order) {
      this.showOrderPanel = schema.order.enabled ?? true;
      this.orderExpanded = schema.order.expanded ?? false;
      if (schema.order.activeSorts) {
        this.sorts = schema.order.activeSorts;
      }
      // Apply default sort if no active sorts and default is specified
      if (this.sorts.length === 0 && schema.order.defaultSort) {
        this.sorts = [schema.order.defaultSort];
      }
      // Merge order fields with filter fields if not already present
      if (schema.order.fields) {
        const existingFields = new Set(this.fields.map(f => f.field));
        for (const field of schema.order.fields) {
          if (!existingFields.has(field.field)) {
            this.fields.push(field);
          }
        }
      }
      // TODO: Apply maxSorts when order panel supports it
    }
    
    // Display
    if (schema.display) {
      this.showDisplayPanel = schema.display.enabled ?? true;
      if (schema.display.defaultMode) {
        this.viewMode = schema.display.defaultMode;
      }
      if (schema.display.columns) {
        this.columns = schema.display.columns;
      }
      if (schema.display.charts) {
        this.chartDefinitions = schema.display.charts;
      }
      if (schema.display.defaultChartId) {
        this.selectedChartId = schema.display.defaultChartId;
      }
      // Store available modes for display panel to use
      if (schema.display.availableModes) {
        this._availableModes = schema.display.availableModes;
      }
      // TODO: Apply cardsPerRow, showCardImages, showCardBadges when renderers support them
    }
    
    // Pagination
    if (schema.pagination) {
      if (schema.pagination.pageSize) {
        this.pageSize = schema.pagination.pageSize;
      }
      if (schema.pagination.page) {
        this.page = schema.pagination.page;
      }
      // Store page size options for pagination component to use
      if (schema.pagination.pageSizeOptions) {
        this._pageSizeOptions = schema.pagination.pageSizeOptions;
      }
    }
    
    // Actions
    if (schema.actions) {
      this.showActionsBar = schema.actions.enabled ?? true;
      if (schema.actions.actions) {
        this.batchActions = schema.actions.actions;
      }
      // Store selection options
      this._multiSelect = schema.actions.multiSelect ?? true;
      this._showSelectAll = schema.actions.showSelectAll ?? false;
    }
    
    // Empty state
    if (schema.emptyState) {
      this.emptyMessage = schema.emptyState.message ?? 'No items found';
      this.emptyIcon = schema.emptyState.icon ?? 'bx bx-folder-open';
      // Store add button config
      this._showAddButton = schema.emptyState.showAddButton ?? false;
      this._addButtonLabel = schema.emptyState.addButtonLabel;
      this._addButtonRoute = schema.emptyState.addButtonRoute;
    }
    
    // Emit schema applied event
    this.schemaApplied.emit(schema);
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Schema-derived State (not @Input, derived from schema)
  // ═══════════════════════════════════════════════════════════════════
  
  /** Available view modes (from schema.display.availableModes) */
  _availableModes: ViewMode[] = ['cards', 'tiles', 'table', 'list', 'chart'];
  
  /** Available page size options (from schema.pagination.pageSizeOptions) */
  _pageSizeOptions: number[] = [10, 20, 50, 100];
  
  /** Allow multi-select (from schema.actions.multiSelect) */
  _multiSelect = true;
  
  /** Show select all option (from schema.actions.showSelectAll) */
  _showSelectAll = false;
  
  /** Show add button in empty state (from schema.emptyState.showAddButton) */
  _showAddButton = false;
  
  /** Add button label (from schema.emptyState.addButtonLabel) */
  _addButtonLabel?: string;
  
  /** Add button route (from schema.emptyState.addButtonRoute) */
  _addButtonRoute?: string;

  /**
   * Get current state as schema (for saving views)
   */
  getCurrentStateAsSchema(): BrowseViewSchema {
    return {
      version: '1.0',
      search: {
        enabled: this.showSearch,
        placeholder: this.searchPlaceholder,
        query: this.searchQuery,
      },
      filter: {
        enabled: this.showFilterPanel,
        expanded: this.filtersExpanded,
        fields: this.fields.filter(f => f.filterable !== false),
        activeFilters: this.filters,
      },
      order: {
        enabled: this.showOrderPanel,
        expanded: this.orderExpanded,
        fields: this.fields.filter(f => f.sortable),
        activeSorts: this.sorts,
      },
      display: {
        enabled: this.showDisplayPanel,
        availableModes: this._availableModes,
        defaultMode: this.viewMode,
        columns: this.columns,
        charts: this.chartDefinitions,
        defaultChartId: this.selectedChartId,
      },
      pagination: {
        enabled: true,
        pageSize: this.pageSize,
        pageSizeOptions: this._pageSizeOptions,
        page: this.page,
      },
      actions: {
        enabled: this.showActionsBar,
        actions: this.batchActions,
        multiSelect: this._multiSelect,
        showSelectAll: this._showSelectAll,
      },
      emptyState: {
        message: this.emptyMessage,
        icon: this.emptyIcon,
        showAddButton: this._showAddButton,
        addButtonLabel: this._addButtonLabel,
        addButtonRoute: this._addButtonRoute,
      },
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Inputs - Data
  // ═══════════════════════════════════════════════════════════════════
  
  /** Data to display */
  @Input() cards: IUniversalCardData[] = [];
  
  /** Column definitions for table view */
  @Input() columns: IColumnDefinition[] = [];
  
  /** Field definitions for filter/sort */
  @Input() fields: FieldDefinition[] = [];
  
  /** Loading state */
  @Input() loading = false;
  
  /** Empty state message */
  @Input() emptyMessage = 'No items found';
  
  /** Empty state icon */
  @Input() emptyIcon = 'bx bx-folder-open';
  
  // ═══════════════════════════════════════════════════════════════════
  // Inputs - Search
  // ═══════════════════════════════════════════════════════════════════
  
  /** Show search panel */
  @Input() showSearch = true;
  
  /** Search placeholder */
  @Input() searchPlaceholder = 'Search...';
  
  /** Current search query */
  @Input() searchQuery = '';
  
  /** Entity icon for search (e.g., 'bx-bulb' for Spikes) */
  @Input() searchEntityIcon?: string;
  
  /** Search hint text */
  @Input() searchHint?: string;
  
  // ═══════════════════════════════════════════════════════════════════
  // Inputs - Saved Views
  // ═══════════════════════════════════════════════════════════════════
  
  /** Entity type for saved views (e.g., 'spike') */
  @Input() entityType?: string;
  
  /** Current URL params for saved view comparison */
  @Input() currentParams: Record<string, string> = {};
  
  // ═══════════════════════════════════════════════════════════════════
  // Inputs - Panels
  // ═══════════════════════════════════════════════════════════════════
  
  /** Show filter panel */
  @Input() showFilterPanel = true;
  
  /** Filter criteria */
  @Input() filters: FilterCriteria[] = [];
  
  /** Show order panel */
  @Input() showOrderPanel = true;
  
  /** Sort criteria */
  @Input() sorts: SortCriteria[] = [];
  
  /** Show display panel */
  @Input() showDisplayPanel = true;
  
  /** 
   * Controls layout mode
   * - 'panels': Traditional inline collapsible panels
   * - 'flyout': Compact search bar + flyout for options
   */
  @Input() controlsLayout: 'panels' | 'flyout' = 'panels';
  
  /** Current view mode */
  @Input() viewMode: ViewMode = 'tiles';
  
  /** Chart type (deprecated - use selectedChart) */
  @Input() chartType: ChartType = 'bar';
  
  /** Available chart definitions */
  @Input() chartDefinitions: ChartDefinition[] = [];
  
  /** Currently selected chart definition */
  @Input() selectedChartId: string = '';
  
  // ═══════════════════════════════════════════════════════════════════
  // Inputs - Actions Bar
  // ═══════════════════════════════════════════════════════════════════
  
  /** Show actions bar */
  @Input() showActionsBar = true;
  
  /** Batch actions available */
  @Input() batchActions: BatchAction[] = [];
  
  // ═══════════════════════════════════════════════════════════════════
  // Inputs - Pagination
  // ═══════════════════════════════════════════════════════════════════
  
  /** Current page (1-based) */
  @Input() page = 1;
  
  /** Items per page */
  @Input() pageSize = 10;
  
  /** Total item count */
  @Input() totalCount = 0;
  
  // ═══════════════════════════════════════════════════════════════════
  // Selection State
  // ═══════════════════════════════════════════════════════════════════
  
  private selectionState = signal<SelectionState>(createSelectionState());
  
  selectedIds = computed(() => this.selectionState().selectedIds);
  selectedCount = computed(() => this.selectionState().selectedIds.size);
  
  // ═══════════════════════════════════════════════════════════════════
  // Local State
  // ═══════════════════════════════════════════════════════════════════
  
  /** Filters panel expanded */
  filtersExpanded = false;
  
  /** Order panel expanded */
  orderExpanded = false;
  
  /** Whether customization panels are shown */
  isCustomizing = false;
  
  /** Name for saving the current view */
  saveViewName = '';
  
  /** View panel mode: collapsed, list, or edit */
  viewPanelMode: 'collapsed' | 'list' | 'edit' = 'collapsed';
  
  /** Dirty state for current view */
  isDirty = false;
  
  /** Flyout panel open state */
  isOptionsOpen = false;
  
  /** Current view name for display */
  get currentViewName(): string {
    if (!this.entityType) return 'All Items';
    const match = this.savedViewService.findMatchingView(this.entityType, this.currentParams);
    return match?.title || (this.isDirty ? 'Custom' : 'All Items');
  }
  
  toggleViewPanel(): void {
    if (this.viewPanelMode === 'collapsed') {
      this.viewPanelMode = 'list';
    } else {
      this.viewPanelMode = 'collapsed';
    }
  }
  
  /** Open the options flyout */
  openOptions(): void {
    this.isOptionsOpen = true;
  }
  
  /** Close the options flyout */
  closeOptions(): void {
    this.isOptionsOpen = false;
  }
  
  /** Apply options from flyout and close */
  applyOptions(): void {
    this.onApply();
    this.closeOptions();
  }
  
  /** Reset options to defaults */
  resetOptions(): void {
    this.filters = [];
    this.sorts = [];
    this.filtersChange.emit([]);
    this.sortsChange.emit([]);
    this.onApply();
  }

  // ═══════════════════════════════════════════════════════════════════
  // Outputs
  // ═══════════════════════════════════════════════════════════════════
  
  /** Schema was applied */
  @Output() schemaApplied = new EventEmitter<BrowseViewSchema>();
  
  /** Search query changed */
  @Output() searchChange = new EventEmitter<string>();
  
  /** Search submitted (Enter pressed) */
  @Output() searchSubmit = new EventEmitter<string>();
  
  /** Search cleared */
  @Output() searchClear = new EventEmitter<void>();
  
  /** Filters changed */
  @Output() filtersChange = new EventEmitter<FilterCriteria[]>();
  
  /** Sorts changed */
  @Output() sortsChange = new EventEmitter<SortCriteria[]>();
  
  /** Apply (filters or sorts) */
  @Output() apply = new EventEmitter<void>();
  
  /** View mode changed */
  @Output() viewModeChange = new EventEmitter<ViewMode>();
  
  /** Chart type changed */
  @Output() chartTypeChange = new EventEmitter<ChartType>();
  
  /** Chart definition selected */
  @Output() chartDefinitionChange = new EventEmitter<ChartDefinition>();
  
  /** Page changed */
  @Output() pageChange = new EventEmitter<number>();
  
  /** Card clicked */
  @Output() cardClick = new EventEmitter<IUniversalCardData>();
  
  /** Card action clicked */
  @Output() cardAction = new EventEmitter<{ card: IUniversalCardData; action: ICardAction }>();
  
  /** Selection changed */
  @Output() selectionChange = new EventEmitter<Set<string>>();
  
  /** Batch action clicked */
  @Output() batchAction = new EventEmitter<BatchActionEvent>();
  
  /** Saved view selected */
  @Output() savedViewSelect = new EventEmitter<SavedView>();
  
  /** View saved by user */
  @Output() viewSaved = new EventEmitter<{ title: string; params: Record<string, string> }>();
  
  // ═══════════════════════════════════════════════════════════════════
  // Computed
  // ═══════════════════════════════════════════════════════════════════
  
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
  
  get selectedChart(): ChartDefinition | undefined {
    return this.chartDefinitions.find(c => c.id === this.selectedChartId);
  }
  
  getEndItem(): number {
    const end = this.page * this.pageSize;
    return end > this.totalCount ? this.totalCount : end;
  }
  
  getPaginationInfo(): string {
    if (this.totalPages <= 1) return '';
    return `${(this.page - 1) * this.pageSize + 1}-${this.getEndItem()} shown`;
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Selection Handlers
  // ═══════════════════════════════════════════════════════════════════
  
  handleCardClick(event: CardClickEvent): void {
    const allIds = this.cards.map(c => c.id);
    const selectionEvent: SelectionEvent = {
      id: event.card.id,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      isLongPress: event.isLongPress,
    };
    
    const result = handleSelection(this.selectionState(), selectionEvent, allIds);
    
    this.selectionState.update(state => ({
      ...state,
      selectedIds: result.selectedIds,
      lastClickedId: result.lastClickedId,
    }));
    
    this.selectionChange.emit(result.selectedIds);
    
    if (result.shouldNavigate) {
      this.cardClick.emit(event.card);
    }
  }
  
  clearSelection(): void {
    this.selectionState.set(createSelectionState());
    this.selectionChange.emit(new Set());
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Event Handlers
  // ═══════════════════════════════════════════════════════════════════
  
  onSearchChange(query: string): void {
    this.searchChange.emit(query);
  }
  
  onSearchSubmit(query: string): void {
    this.searchSubmit.emit(query);
  }
  
  onSearchClear(): void {
    this.searchClear.emit();
  }
  
  onFiltersChange(filters: FilterCriteria[]): void {
    this.filters = filters;  // Update local state
    this.filtersChange.emit(filters);
  }
  
  onSortsChange(sorts: SortCriteria[]): void {
    this.sorts = sorts;  // Update local state
    this.sortsChange.emit(sorts);
  }
  
  onApply(): void {
    this.clearSelection();
    this.apply.emit();
  }
  
  onTableSortChange(event: SortChangeEvent): void {
    const newSort: SortCriteria = {
      id: 'sort-0',
      field: event.column,
      direction: event.direction,
    };
    this.sortsChange.emit([newSort]);
    this.apply.emit();
  }
  
  onViewModeChange(mode: ViewMode): void {
    this.viewMode = mode;  // Update local state
    this.viewModeChange.emit(mode);
  }
  
  onChartTypeChange(type: ChartType): void {
    this.chartTypeChange.emit(type);
  }
  
  onChartDefinitionChange(definition: ChartDefinition): void {
    this.selectedChartId = definition.id;  // Update local state
    this.viewMode = 'chart';
    this.chartDefinitionChange.emit(definition);
  }
  
  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
  
  onCardAction(event: { card: IUniversalCardData; action: ICardAction }): void {
    this.cardAction.emit(event);
  }
  
  onBatchAction(event: BatchActionEvent): void {
    const filledEvent: BatchActionEvent = {
      ...event,
      selectedIds: Array.from(this.selectedIds()),
    };
    this.batchAction.emit(filledEvent);
  }
  
  getViewIcon(view: SavedView): string {
    if (view.isMru) return 'bx bx-time-five';
    if (view.isDefault) return 'bx bx-list-ul';
    return view.icon || 'bx bx-filter-alt';
  }
  
  selectChart(chart: ChartDefinition): void {
    this.selectedChartId = chart.id;
    this.viewMode = 'chart';
    this.viewModeChange.emit('chart');
    this.chartDefinitionChange.emit(chart);
  }
  
  onSavedViewSelect(view: SavedView): void {
    this.isCustomizing = false;
    this.saveViewName = '';
    this.savedViewSelect.emit(view);
  }
  
  onViewSaved(event: { title: string; params: Record<string, string> }): void {
    this.viewSaved.emit(event);
  }
  
  onCustomizingChange(isCustomizing: boolean): void {
    this.isCustomizing = isCustomizing;
    if (!isCustomizing) {
      this.saveViewName = '';
    }
  }
  
  onApplyAndClose(): void {
    this.onApply();
    this.isCustomizing = false;
    this.saveViewName = '';
  }
  
  onSaveView(): void {
    if (this.saveViewName.trim()) {
      this.viewSaved.emit({
        title: this.saveViewName.trim(),
        params: { ...this.currentParams },
      });
      this.saveViewName = '';
      this.isCustomizing = false;
    }
  }
}
