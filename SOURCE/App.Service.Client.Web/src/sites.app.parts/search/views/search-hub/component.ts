import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Core
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
import { CardBrokerRegistry } from '../../../../core/models/presentation/card-broker.model';

// BrowseView
import { BrowseViewComponent, ViewMode } from '../../../../core.ag/components/browse-view';
import { IUniversalCardData, ICardAction } from '../../../../core/models/presentation/universal-card.model';
import {
  FilterCriteria,
  SortCriteria,
  FieldDefinition,
  serializeFilters,
  deserializeFilters,
  serializeSorts,
  deserializeSorts,
  createSortCriteria,
} from '../../../../core/models/query/query-criteria.model';

/**
 * Search Hub Component
 * 
 * Global search across all entity types using BrowseView.
 * 
 * URL: /apps/search?q=term&filter=type:in:spike|people&sort=title:asc&view=tiles
 */
@Component({
    selector: 'app-search-hub',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, BrowseViewComponent],
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class SearchHubComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private logger = inject(SystemDiagnosticsTraceService);
  private brokerRegistry = inject(CardBrokerRegistry);
  
  // Signals
  cards = signal<IUniversalCardData[]>([]);
  loading = signal<boolean>(false);
  
  // URL-synced state
  searchQuery = '';
  filters = signal<FilterCriteria[]>([]);
  sorts = signal<SortCriteria[]>([createSortCriteria('relevance', 'desc')]);
  viewMode: ViewMode = 'tiles';
  page = signal<number>(1);
  pageSize = signal<number>(20);
  totalCount = signal<number>(0);
  
  // Field definitions for search
  fieldDefinitions: FieldDefinition[] = [
    { 
      field: 'entityType', 
      label: 'Type', 
      type: 'multiselect',
      filterable: true,
      sortable: false,
      options: [
        { value: 'spike', label: 'Spikes' },
        { value: 'support', label: 'Support Items' },
        { value: 'faq', label: 'FAQ' },
        { value: 'help', label: 'Help Articles' },
      ],
    },
    { 
      field: 'relevance', 
      label: 'Relevance', 
      type: 'number',
      filterable: false,
      sortable: true,
    },
    { 
      field: 'title', 
      label: 'Title', 
      type: 'text',
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
  
  private destroy$ = new Subject<void>();
  
  constructor() {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      // Sync search query
      if (params['q']) {
        this.searchQuery = params['q'];
        this.executeSearch();
      }
      
      // Sync filters
      if (params['filter']) {
        this.filters.set(deserializeFilters(params['filter']));
      }
      
      // Sync sorts
      if (params['sort']) {
        this.sorts.set(deserializeSorts(params['sort']));
      }
      
      // Sync view mode
      if (params['view']) {
        this.viewMode = params['view'] as ViewMode;
      }
      
      // Sync page
      if (params['page']) {
        this.page.set(parseInt(params['page'], 10));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─────────────────────────────────────────────────────────────
  // Search
  // ─────────────────────────────────────────────────────────────

  onSearchChange(query: string): void {
    this.searchQuery = query;
  }

  onSearchClear(): void {
    this.searchQuery = '';
    this.updateUrl({ q: null });
    this.cards.set([]);
    this.totalCount.set(0);
  }

  private executeSearch(): void {
    if (!this.searchQuery.trim()) {
      this.cards.set([]);
      this.totalCount.set(0);
      return;
    }
    
    this.loading.set(true);
    
    // Simulate search - in production this would call an API
    setTimeout(() => {
      this.loading.set(false);
    }, 300);
  }

  // ─────────────────────────────────────────────────────────────
  // Filters & Sorts
  // ─────────────────────────────────────────────────────────────

  onFiltersChange(filters: FilterCriteria[]): void {
    this.filters.set(filters);
  }

  onSortsChange(sorts: SortCriteria[]): void {
    this.sorts.set(sorts);
  }

  onApply(): void {
    const filterStr = serializeFilters(this.filters());
    const sortStr = serializeSorts(this.sorts());
    
    this.updateUrl({
      q: this.searchQuery || null,
      filter: filterStr,
      sort: sortStr,
      page: null,
    });
    
    this.executeSearch();
  }

  // ─────────────────────────────────────────────────────────────
  // View Mode
  // ─────────────────────────────────────────────────────────────

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    this.updateUrl({ view: mode });
  }

  // ─────────────────────────────────────────────────────────────
  // Pagination
  // ─────────────────────────────────────────────────────────────

  onPageChange(page: number): void {
    this.page.set(page);
    this.updateUrl({ page: page > 1 ? page : null });
    this.executeSearch();
  }

  // ─────────────────────────────────────────────────────────────
  // Card Actions
  // ─────────────────────────────────────────────────────────────

  onCardClick(card: IUniversalCardData): void {
    if (card.primaryAction?.routerLink) {
      this.router.navigate(card.primaryAction.routerLink);
    }
  }

  onCardAction(event: { card: IUniversalCardData; action: ICardAction }): void {
    const { action } = event;
    if (action.routerLink) {
      this.router.navigate(action.routerLink);
    }
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
}
