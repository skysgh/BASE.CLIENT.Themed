/**
 * Spike Browse Component
 * 
 * Uses BrowseView component with dynamic FilterCriteria and SortCriteria.
 * All state is synced to URL for bookmarkability.
 * Supports saved views with MRU (Most Recently Used) auto-restore.
 * 
 * URL Pattern: /spike/spikes?q=search&filter=category:eq:technical&sort=title:asc&page=2&view=tiles
 */
import { Component, OnInit, OnDestroy, effect, inject, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Configuration
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../../configuration/implementations/app.lets.spikes.configuration';

// Services
import { SpikeService } from '../../../../../services/spike.service';
import { SpikeCardBroker } from '../../../../../brokers/spike-card.broker';
import { UniversalSearchService, SearchStateManager } from '../../../../../../../core/services/universal-search.service';
import { CardBrokerRegistry } from '../../../../../../../core/models/presentation/card-broker.model';
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { ViewPreferenceService } from '../../../../../../../core/views/view-preference.service';
import { SearchContextService, SearchContextConfig } from '../../../../../../../core/services/search-context.service';
import { SavedViewService } from '../../../../../../../core/services/saved-view.service';

// Models
import { SpikeViewModel } from '../../../../../models/view-models/spike.view-model';
import { IUniversalCardData, ICardAction } from '../../../../../../../core/models/presentation/universal-card.model';
import { ViewMode, SavedView } from '../../../../../../../core.ag/ui/widgets/browse-view/browse-view.component';
import { ChartDefinition } from '../../../../../../../core/models/query/chart-definition.model';
import {
  FilterCriteria,
  SortCriteria,
  FieldDefinition,
  serializeFilters,
  deserializeFilters,
  serializeSorts,
  deserializeSorts,
  createSortCriteria,
} from '../../../../../../../core/models/query/query-criteria.model';
import { extractUrlParams } from '../../../../../../../core/models/view/saved-view.model';
import { ViewModel } from './vm';

// Search context configuration for this browse view
const SPIKE_SEARCH_CONTEXT: SearchContextConfig = {
  entityType: 'spike',
  baseRoute: '/spike/spikes',
  placeholder: 'Search spikes...',
  icon: 'bx-bulb'
};

@Component({
    selector: 'app-base-apps-spike-spikes-browse',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseAppsSpikeSpikesBrowseComponent implements OnInit, OnDestroy {
  // Configuration
  public appsConfiguration = appsConfiguration;
  public appletConfiguration = appletsSpikesConfiguration;
  public viewModel: ViewModel = new ViewModel();

  // Injected services
  private searchService = inject(UniversalSearchService);
  private brokerRegistry = inject(CardBrokerRegistry);
  private spikeBroker = inject(SpikeCardBroker);
  private searchContext = inject(SearchContextService);
  private savedViewService = inject(SavedViewService);
  
  // Search state manager
  searchState!: SearchStateManager<SpikeViewModel>;
  
  // Cards signal (created after searchState)
  cards!: Signal<IUniversalCardData[]>;
  
  // UI state
  viewMode: ViewMode = 'cards';
  selectedChartId: string = '';
  
  // Current URL params for saved views
  currentUrlParams: Record<string, string> = {};
  
  // Chart definitions from broker
  get chartDefinitions(): ChartDefinition[] {
    return this.spikeBroker.getAvailableCharts();
  }

  // ─────────────────────────────────────────────────────────────
  // Field Definitions (for filter/sort panels)
  // ─────────────────────────────────────────────────────────────
  
  fieldDefinitions: FieldDefinition[] = [
    { 
      field: 'title', 
      label: 'Title', 
      type: 'text',
      filterable: true,
      sortable: true,
    },
    { 
      field: 'category', 
      label: 'Category', 
      type: 'select',
      filterable: true,
      sortable: true,
      options: [
        { value: 'technical', label: 'Technical' },
        { value: 'research', label: 'Research' },
        { value: 'prototype', label: 'Prototype' },
        { value: 'experiment', label: 'Experiment' },
      ],
    },
    { 
      field: 'status', 
      label: 'Status', 
      type: 'select',
      filterable: true,
      sortable: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'archived', label: 'Archived' },
      ],
    },
    { 
      field: 'priority', 
      label: 'Priority', 
      type: 'number',
      filterable: true,
      sortable: true,
    },
    { 
      field: 'createdAt', 
      label: 'Created Date', 
      type: 'date',
      filterable: true,
      sortable: true,
    },
    { 
      field: 'modifiedAt', 
      label: 'Modified Date', 
      type: 'date',
      filterable: true,
      sortable: true,
    },
  ];
  
  // ─────────────────────────────────────────────────────────────
  // URL-synced State
  // ─────────────────────────────────────────────────────────────
  
  filters = signal<FilterCriteria[]>([]);
  sorts = signal<SortCriteria[]>([createSortCriteria('title', 'asc')]);
  currentPage = signal<number>(1);
  
  // Local search query (synced from SearchContext)
  get searchQuery(): string {
    return this.searchContext.query();
  }
  
  private destroy$ = new Subject<void>();
  private isFirstLoad = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllerServices: DefaultComponentServices,
    public spikeService: SpikeService,
    private viewPrefService: ViewPreferenceService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info('Browse Component Constructor');
    
    // Register the broker if not already registered
    if (!this.brokerRegistry.hasBroker('spike')) {
      this.brokerRegistry.register(this.spikeBroker);
    }
    
    // Create search state
    this.searchState = this.searchService.createSearchState<SpikeViewModel>(
      'spike',
      ['title', 'description', 'displayLabel']
    );
    
    // Create cards signal from search state
    this.cards = this.searchState.getCards();
    
    // Get view preference
    const prefRenderer = this.viewPrefService.getPreferredRendererId('spike', 'browse');
    this.viewMode = this.mapRendererToViewMode(prefRenderer);
    
    // React to spike data changes
    effect(() => {
      const spikes = this.spikeService.spikes();
      this.searchState.setSourceData(spikes);
    });
    
    // React to SearchContext query changes
    effect(() => {
      const query = this.searchContext.query();
      this.searchState.setQuery(query);
    });
  }

  ngOnInit(): void {
    // Register search context for this browse view
    this.searchContext.registerContext(SPIKE_SEARCH_CONTEXT);
    this.searchContext.activateContext(SPIKE_SEARCH_CONTEXT);
    
    // Initialize saved views for spike entity
    this.savedViewService.initializeEntity('spike', 'All Spikes');
    
    // Subscribe to URL query params and sync state
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      // Store current URL params for saved view comparison
      this.currentUrlParams = extractUrlParams(params);
      
      // On first load, check if we should restore MRU view
      if (this.isFirstLoad) {
        this.isFirstLoad = false;
        
        if (this.savedViewService.shouldRestoreMru('spike', this.currentUrlParams)) {
          const mru = this.savedViewService.getMruView('spike');
          if (mru) {
            console.log('[Browse] Restoring MRU view:', mru.urlParams);
            this.savedViewService.applyView(mru, this.route);
            return; // Will re-enter with MRU params
          }
        }
      }
      
      // Sync filters from URL
      if (params['filter']) {
        const filters = deserializeFilters(params['filter']);
        this.filters.set(filters);
        this.searchState.applyFilterCriteria(filters);
      } else {
        this.filters.set([]);
        this.searchState.applyFilterCriteria([]);
      }
      
      // Sync sorts from URL
      if (params['sort']) {
        const sorts = deserializeSorts(params['sort']);
        this.sorts.set(sorts);
        this.searchState.applySortCriteria(sorts);
      } else {
        const defaultSort = [createSortCriteria('title', 'asc')];
        this.sorts.set(defaultSort);
        this.searchState.applySortCriteria(defaultSort);
      }
      
      // Sync page
      if (params['page']) {
        const page = parseInt(params['page'], 10);
        if (!isNaN(page) && page > 0) {
          this.currentPage.set(page);
          this.searchState.setPage(page);
        }
      }
      
      // Sync search query
      if (params['q']) {
        this.searchContext.setQuery(params['q']);
      }
      
      // Sync view mode
      if (params['view']) {
        const view = params['view'] as ViewMode;
        if (['cards', 'tiles', 'table', 'list', 'chart'].includes(view)) {
          this.viewMode = view;
        }
      }
      
      // Save as MRU (if we have any non-empty params)
      if (Object.keys(this.currentUrlParams).filter(k => this.currentUrlParams[k]).length > 0) {
        this.savedViewService.saveMruView('spike', this.currentUrlParams);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchContext.deactivateContext();
  }

  // ─────────────────────────────────────────────────────────────
  // Search
  // ─────────────────────────────────────────────────────────────

  onSearchChange(query: string): void {
    this.searchContext.setQuery(query);
    this.updateUrl({ q: query || null });
  }

  onSearchClear(): void {
    this.searchContext.clearQuery();
    this.updateUrl({ q: null });
  }

  // ─────────────────────────────────────────────────────────────
  // Filters
  // ─────────────────────────────────────────────────────────────

  onFiltersChange(filters: FilterCriteria[]): void {
    this.filters.set(filters);
    // Don't update URL until Apply is clicked
  }

  // ─────────────────────────────────────────────────────────────
  // Sorts
  // ─────────────────────────────────────────────────────────────

  onSortsChange(sorts: SortCriteria[]): void {
    this.sorts.set(sorts);
    // Don't update URL until Apply is clicked
  }

  // ─────────────────────────────────────────────────────────────
  // Apply (filters + sorts → API query)
  // ─────────────────────────────────────────────────────────────

  onApply(): void {
    const filterStr = serializeFilters(this.filters());
    const sortStr = serializeSorts(this.sorts());
    
    // Update URL
    this.updateUrl({
      filter: filterStr,
      sort: sortStr,
      page: null, // Reset to page 1 when criteria change
    });
    
    // Apply to search state (triggers re-filter/sort)
    this.searchState.applyFilterCriteria(this.filters());
    this.searchState.applySortCriteria(this.sorts());
    
    console.log('[Browse] Applied query:', {
      filters: this.filters(),
      sorts: this.sorts(),
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Pagination
  // ─────────────────────────────────────────────────────────────

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.searchState.setPage(page);
    this.updateUrl({ page: page > 1 ? page : null });
  }

  // ─────────────────────────────────────────────────────────────
  // View Mode
  // ─────────────────────────────────────────────────────────────

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    
    const rendererId = this.mapViewModeToRenderer(mode);
    this.viewPrefService.setPreference('spike', 'browse', rendererId);
    
    this.updateUrl({ view: mode });
  }
  
  onChartDefinitionChange(definition: ChartDefinition): void {
    this.selectedChartId = definition.id;
    this.viewMode = 'chart';
    this.updateUrl({ view: 'chart', chartId: definition.id });
  }

  private mapRendererToViewMode(rendererId: string): ViewMode {
    if (rendererId.includes('table')) return 'table';
    if (rendererId.includes('tiles')) return 'tiles';
    if (rendererId.includes('list')) return 'list';
    return 'cards';
  }

  private mapViewModeToRenderer(mode: ViewMode): string {
    switch (mode) {
      case 'table': return 'browse-table';
      case 'tiles': return 'browse-tiles';
      case 'list': return 'browse-list';
      default: return 'browse-cards';
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Card Actions
  // ─────────────────────────────────────────────────────────────

  onCardClick(card: IUniversalCardData): void {
    if (card.primaryAction?.routerLink) {
      this.router.navigate(card.primaryAction.routerLink);
    } else {
      this.router.navigate(['../', card.id], { relativeTo: this.route });
    }
  }

  onCardAction(event: { card: IUniversalCardData; action: ICardAction }): void {
    const { action } = event;
    
    if (action.routerLink) {
      this.router.navigate(action.routerLink);
    } else if (action.externalUrl) {
      window.open(action.externalUrl, '_blank');
    } else if (action.handler) {
      action.handler(event.card.payload);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Saved Views
  // ─────────────────────────────────────────────────────────────

  onSavedViewSelect(view: SavedView): void {
    console.log('[Browse] Saved view selected:', view.title);
    this.savedViewService.applyView(view, this.route);
  }

  // ─────────────────────────────────────────────────────────────
  // URL Helper
  // ─────────────────────────────────────────────────────────────

  private updateUrl(params: Record<string, any>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Computed Getters (for template)
  // ─────────────────────────────────────────────────────────────

  get totalCount() {
    return this.searchState.totalCount;
  }

  get page() {
    return this.searchState.page;
  }

  get pageSize() {
    return this.searchState.pageSize;
  }

  get loading() {
    return this.searchState.loading;
  }

  get columns() {
    return this.searchService.getColumns('spike');
  }
}
