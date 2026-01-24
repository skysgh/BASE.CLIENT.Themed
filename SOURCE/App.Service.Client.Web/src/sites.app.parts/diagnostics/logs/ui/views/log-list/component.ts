/**
 * Log List Component (Browse)
 * 
 * Lists all log entries with filtering and search.
 * D-BREAST: Browse (read-only)
 * 
 * Route: /system/diagnostics/logs
 */
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LogService } from '../../../services/log.service';
import { LogLevel, LOG_LEVELS } from '../../../models/log-entry.dto';
import { PageHeaderComponent } from '../../../../../../sites/ui/widgets/page-header';

@Component({
  selector: 'app-log-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PageHeaderComponent],
  template: `
    <div class="container-fluid" style="max-width: 1400px; padding: 1.5rem;">
      <!-- Standard Page Header -->
      <app-page-header 
        title="Log Viewer"
        icon="bx-list-ul"
        iconBackground="bg-primary-subtle"
        iconClass="text-primary"
        [showBack]="true"
        [showBreadcrumb]="true">
        <ng-container subtitle>{{ logService.filteredLogs().length }} entries</ng-container>
        <ng-container actions>
          <button class="btn btn-soft-primary btn-sm" (click)="refresh()">
            <i class="bx bx-refresh me-1"></i>
            Refresh
          </button>
        </ng-container>
      </app-page-header>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <!-- Search -->
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text"><i class="bx bx-search"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search logs..."
                  [(ngModel)]="searchTerm"
                  (ngModelChange)="applyFilter()">
              </div>
            </div>
            
            <!-- Level Filter -->
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="levelFilter" (ngModelChange)="applyFilter()">
                <option value="all">All Levels</option>
                @for (level of levels; track level) {
                  <option [value]="level">{{ getLevelMeta(level).label }}</option>
                }
              </select>
            </div>
            
            <!-- Source Filter -->
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="sourceFilter" (ngModelChange)="applyFilter()">
                <option value="">All Sources</option>
                @for (source of logService.getUniqueSources(); track source) {
                  <option [value]="source">{{ source }}</option>
                }
              </select>
            </div>
            
            <!-- Clear -->
            <div class="col-md-2">
              <button class="btn btn-outline-secondary w-100" (click)="clearFilters()">
                <i class="bx bx-filter-alt me-1"></i> Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Log List -->
      @if (logService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="text-muted mt-2">Loading logs...</p>
        </div>
      } @else if (logService.filteredLogs().length === 0) {
        <div class="card">
          <div class="card-body text-center py-5">
            <i class="bx bx-search-alt fs-48 text-muted"></i>
            <h5 class="mt-3">No logs found</h5>
            <p class="text-muted">
              @if (hasActiveFilter()) {
                No logs match your current filter.
              } @else {
                No log entries available.
              }
            </p>
          </div>
        </div>
      } @else {
        <div class="card">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th style="width: 160px;">Timestamp</th>
                  <th style="width: 80px;">Level</th>
                  <th style="width: 150px;">Source</th>
                  <th>Message</th>
                  <th style="width: 80px;"></th>
                </tr>
              </thead>
              <tbody>
                @for (log of displayedLogs(); track log.id) {
                  <tr [class.table-danger]="log.level === 'error' || log.level === 'fatal'" [class.table-warning]="log.level === 'warn'">
                    <td class="text-muted small">
                      {{ log.timestampDisplay }}
                      <br>
                      <span class="text-muted">{{ log.relativeTime }}</span>
                    </td>
                    <td>
                      <span class="badge bg-{{ log.levelColor }}-subtle text-{{ log.levelColor }}">
                        <i [class]="log.levelIcon + ' me-1'"></i>
                        {{ log.levelLabel }}
                      </span>
                    </td>
                    <td>
                      <code class="small">{{ log.source }}</code>
                    </td>
                    <td>
                      <span class="d-inline-block text-truncate" style="max-width: 400px;">
                        {{ log.message }}
                      </span>
                      @if (log.hasDetails) {
                        <span class="badge bg-secondary ms-1">+data</span>
                      }
                      @if (log.hasStackTrace) {
                        <span class="badge bg-danger ms-1">stack</span>
                      }
                    </td>
                    <td class="text-end">
                      <a [routerLink]="[log.id]" class="btn btn-sm btn-soft-primary">
                        <i class="bx bx-show"></i>
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="card-footer d-flex justify-content-between align-items-center">
              <span class="text-muted">
                Showing {{ (currentPage() - 1) * pageSize + 1 }} - {{ Math.min(currentPage() * pageSize, logService.filteredLogs().length) }} 
                of {{ logService.filteredLogs().length }}
              </span>
              <nav>
                <ul class="pagination mb-0">
                  <li class="page-item" [class.disabled]="currentPage() === 1">
                    <button class="page-link" (click)="goToPage(currentPage() - 1)">Previous</button>
                  </li>
                  @for (page of visiblePages(); track page) {
                    <li class="page-item" [class.active]="page === currentPage()">
                      <button class="page-link" (click)="goToPage(page)">{{ page }}</button>
                    </li>
                  }
                  <li class="page-item" [class.disabled]="currentPage() === totalPages()">
                    <button class="page-link" (click)="goToPage(currentPage() + 1)">Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class LogListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  logService = inject(LogService);
  
  Math = Math;
  
  levels: LogLevel[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
  
  searchTerm = '';
  levelFilter: LogLevel | 'all' = 'all';
  sourceFilter = '';
  
  pageSize = 25;
  currentPage = signal(1);
  
  totalPages = computed(() => 
    Math.ceil(this.logService.filteredLogs().length / this.pageSize)
  );
  
  displayedLogs = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.logService.filteredLogs().slice(start, start + this.pageSize);
  });
  
  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  });
  
  ngOnInit(): void {
    // Check for query params
    this.route.queryParams.subscribe(params => {
      if (params['level']) {
        this.levelFilter = params['level'] as LogLevel;
        this.applyFilter();
      }
    });
  }
  
  getLevelMeta(level: LogLevel) {
    return LOG_LEVELS[level];
  }
  
  applyFilter(): void {
    this.logService.setFilter({
      level: this.levelFilter,
      source: this.sourceFilter,
      search: this.searchTerm
    });
    this.currentPage.set(1);
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.levelFilter = 'all';
    this.sourceFilter = '';
    this.logService.clearFilter();
    this.currentPage.set(1);
  }
  
  hasActiveFilter(): boolean {
    return !!this.searchTerm || this.levelFilter !== 'all' || !!this.sourceFilter;
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
  
  refresh(): void {
    this.logService.refresh();
  }
}
