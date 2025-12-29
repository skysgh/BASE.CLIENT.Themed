import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { UniversalSearchService } from '../../services/universal-search.service';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
import { SummaryItemVTO } from '../../../../core/models/SummaryItem.vto.model';
import { SearchResultItem } from '../../models/search.model';

/**
 * Search Hub Component
 * 
 * The "Browse" part of BREAD - Universal Search across all entities.
 * Uses CARDS not tables - SummaryItemVTO based.
 * 
 * Architecture:
 * - Search results displayed as cards (SummaryItem)
 * - Filter/Sort panel ABOVE cards (not column headers)
 * - Mobile-friendly - cards stack vertically
 */
@Component({
  selector: 'app-search-hub',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SearchHubComponent implements OnInit {
  /** Search term bound to input */
  searchTerm: string = '';
  
  /** Selected entity type filter */
  selectedType: string = '';
  
  /** Sort field */
  sortField: string = 'modifiedAt';
  
  /** Sort direction */
  sortDirection: 'asc' | 'desc' = 'desc';
  
  /** Show filter panel */
  showFilters: boolean = false;

  constructor(
    public searchService: UniversalSearchService,
    private route: ActivatedRoute,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  ngOnInit(): void {
    // Check for query params
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchTerm = params['q'];
        this.onSearch();
      }
      if (params['type']) {
        this.selectedType = params['type'];
        this.searchService.filterByType(params['type']);
      }
    });
  }

  /**
   * Execute search
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.searchService.clearSearch();
      return;
    }
    
    this.searchService.search({
      term: this.searchTerm,
      entityType: this.selectedType || undefined,
      sortBy: this.sortField,
      sortDirection: this.sortDirection,
      page: 1,
      pageSize: 20,
    });
  }

  /**
   * Filter by entity type
   */
  onTypeChange(): void {
    this.searchService.filterByType(this.selectedType || undefined);
  }

  /**
   * Clear search
   */
  onClear(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.searchService.clearSearch();
  }

  /**
   * Execute recent search
   */
  onRecentSearch(term: string, entityType?: string): void {
    this.searchTerm = term;
    this.selectedType = entityType || '';
    this.onSearch();
  }

  /**
   * Navigate to entity
   */
  onResultClick(route: string): void {
    // Navigation handled by routerLink in template
    this.logger.debug(`Navigating to: ${route}`);
  }

  /**
   * Handle operation click from summary item
   */
  onOperationClick(event: { summaryItem: SummaryItemVTO | undefined, action: string }): void {
    this.logger.debug(`Operation clicked: ${event.action} on ${event.summaryItem?.id}`);
    // Handle operations like 'edit', 'view', 'delete'
  }

  /**
   * Go to page
   */
  onPageChange(page: number): void {
    this.searchService.goToPage(page);
  }

  /**
   * Toggle filter panel
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  /**
   * Set sort
   */
  onSortChange(field: string): void {
    if (this.sortField === field) {
      // Toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.onSearch();
  }

  /**
   * Convert SearchResultItem to SummaryItemVTO
   */
  toSummaryItem(item: SearchResultItem): SummaryItemVTO {
    const summary = new SummaryItemVTO();
    summary.id = item.id;
    summary.title = item.title;
    summary.description = item.description || '';
    summary.subtitle = item.subtitle;
    summary.type = item.entityType;
    summary.typeId = item.entityType;
    summary.typeImage = item.icon ? '' : '';
    summary.icon = item.icon;
    summary.status = item.status;
    summary.tags = item.tags;
    summary.route = item.route;
    summary.values = item.metadata?.map(m => ({ title: m.label, value: m.value }));
    summary.operations = [
      { title: 'View', action: 'view' },
      { title: 'Edit', action: 'edit' }
    ];
    return summary;
  }

  /**
   * Get page numbers for pagination
   */
  getPageNumbers(): number[] {
    const results = this.searchService.results();
    const pages: number[] = [];
    const maxVisible = 5;
    
    let start = Math.max(1, results.page - Math.floor(maxVisible / 2));
    let end = Math.min(results.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
