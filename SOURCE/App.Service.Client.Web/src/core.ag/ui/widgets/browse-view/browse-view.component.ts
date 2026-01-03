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
import { CardsRendererComponent } from './renderers/cards-renderer.component';
import { TilesRendererComponent } from './renderers/tiles-renderer.component';
import { TableRendererComponent } from './renderers/table-renderer.component';
import { ListRendererComponent } from './renderers/list-renderer.component';
import { ChartRendererComponent } from './renderers/chart-renderer.component';

import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

// Re-export for consumers
export { ViewMode } from './browse-view-schema.model';
export { BrowseViewSchema } from './browse-view-schema.model';

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
    BrowseSearchPanelComponent,
    BrowseFilterPanelComponent,
    BrowseOrderPanelComponent,
    BrowseDisplayPanelComponent,
    BrowseActionsBarComponent,
    BrowsePaginationComponent,
    CardsRendererComponent,
    TilesRendererComponent,
    TableRendererComponent,
    ListRendererComponent,
    ChartRendererComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="browse-view">
      <!-- Search Panel -->
      @if (showSearch) {
        <app-browse-search-panel
          [query]="searchQuery"
          [placeholder]="searchPlaceholder"
          [entityIcon]="searchEntityIcon"
          [hint]="searchHint"
          (queryChange)="onSearchChange($event)"
          (search)="onSearchSubmit($event)"
          (clear)="onSearchClear()">
        </app-browse-search-panel>
      }
      
      <!-- Filter Panel -->
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
      
      <!-- Order Panel -->
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
      
      <!-- Display Panel -->
      @if (showDisplayPanel) {
        <app-browse-display-panel
          [viewMode]="viewMode"
          [chartDefinitions]="chartDefinitions"
          [selectedChartId]="selectedChartId"
          (viewModeChange)="onViewModeChange($event)"
          (chartDefinitionChange)="onChartDefinitionChange($event)">
        </app-browse-display-panel>
      }
      
      <!-- Results Area -->
      <div class="browse-results">
        <!-- Actions Bar -->
        @if (showActionsBar) {
          <app-browse-actions-bar
            [totalCount]="totalCount"
            [selectedCount]="selectedCount()"
            [paginationInfo]="getPaginationInfo()"
            [actions]="batchActions"
            (actionClick)="onBatchAction($event)"
            (clearSelection)="clearSelection()">
          </app-browse-actions-bar>
        }

        <!-- Loading State -->
        @if (loading) {
          <div class="browse-view-loading text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        }

        <!-- Empty State -->
        @if (!loading && cards.length === 0) {
          <div class="browse-view-empty text-center py-5">
            <i [class]="emptyIcon + ' display-1 text-muted'"></i>
            <h5 class="mt-3 text-muted">{{ emptyMessage }}</h5>
            <ng-content select="[emptyActions]"></ng-content>
          </div>
        }

        <!-- Content -->
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
              } @else {
                <div class="chart-placeholder text-center py-5">
                  <i class="bx bx-bar-chart-alt-2 display-1 text-muted"></i>
                  <h5 class="mt-3 text-muted">Select a chart type</h5>
                  <p class="text-muted small">Choose from the chart dropdown above</p>
                </div>
              }
            }
          }
        }

        <!-- Bottom Pagination -->
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
  `,
  styles: [`
    .browse-view {
      // Container styles handled by parent
    }
    
    .browse-results {
      // Results area
    }
    
    .results-header {
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--vz-border-color);
    }
    
    .browse-view-empty {
      opacity: 0.7;
    }
    
    .chart-placeholder {
      opacity: 0.7;
    }
  `]
})
export class BrowseViewComponent implements OnChanges {
  private diagnostics = inject(SystemDiagnosticsTraceService);

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
    this.filtersChange.emit(filters);
  }
  
  onSortsChange(sorts: SortCriteria[]): void {
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
    this.viewModeChange.emit(mode);
  }
  
  onChartTypeChange(type: ChartType): void {
    this.chartTypeChange.emit(type);
  }
  
  onChartDefinitionChange(definition: ChartDefinition): void {
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
}
