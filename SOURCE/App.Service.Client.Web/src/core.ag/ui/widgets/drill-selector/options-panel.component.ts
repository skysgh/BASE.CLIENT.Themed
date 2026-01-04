/**
 * Options Panel Component
 * 
 * The expandable options list for the Drill-Down Selector.
 * Displays reference items as selectable cards with search and pagination.
 * 
 * FEATURES:
 * - Search/filter across item titles and subtitles
 * - Pagination for large lists
 * - Single or multi-select with checkboxes
 * - Disabled items shown but struck-through
 * - Keyboard navigation support
 * 
 * ARCHITECTURE:
 * ┌───────────────────────────────────────────────────────────────────┐
 * │ OPTIONS PANEL                                                     │
 * │ ┌───────────────────────────────────────────────────────────────┐ │
 * │ │ 🔍 Search...                                         [Clear] │ │
 * │ └───────────────────────────────────────────────────────────────┘ │
 * │ ┌───────────────────────────────────────────────────────────────┐ │
 * │ │ OPTIONS LIST                                                  │ │
 * │ │ ┌───────────────────────────────────────────────────────────┐ │ │
 * │ │ │ [☑] 🎯 Option 1                               (selected) │ │ │
 * │ │ ├───────────────────────────────────────────────────────────┤ │ │
 * │ │ │ [☐] 📦 Option 2                                          │ │ │
 * │ │ ├───────────────────────────────────────────────────────────┤ │ │
 * │ │ │ [☐] ⛔ Option 3 (disabled)              Reason: Embargoed │ │ │
 * │ │ └───────────────────────────────────────────────────────────┘ │ │
 * │ │ ◄ 1 2 3 ►                                                    │ │
 * │ └───────────────────────────────────────────────────────────────┘ │
 * │ [Cancel]                                              [Apply (3)] │
 * └───────────────────────────────────────────────────────────────────┘
 */
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  signal, 
  computed,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IReferenceItem } from '../../models/presentation/reference-item.model';

@Component({
  selector: 'app-options-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="options-panel">
      <!-- Search Box -->
      @if (searchable) {
        <div class="panel-search">
          <div class="search-box">
            <i class="bx bx-search search-icon"></i>
            <input 
              type="text"
              class="form-control form-control-sm"
              [placeholder]="searchPlaceholder"
              [ngModel]="searchQuery()"
              (ngModelChange)="onSearchChange($event)">
            @if (searchQuery()) {
              <button 
                type="button" 
                class="btn btn-link btn-sm search-clear"
                (click)="clearSearch()">
                <i class="bx bx-x"></i>
              </button>
            }
          </div>
        </div>
      }
      
      <!-- Options List -->
      <div class="panel-options">
        @if (paginatedItems().length === 0) {
          <div class="no-results text-center py-4">
            <i class="bx bx-search-alt display-6 text-muted"></i>
            <p class="text-muted mt-2 mb-0">No matching options</p>
          </div>
        }
        
        @for (item of paginatedItems(); track item.value) {
          <div 
            class="option-item"
            [class.selected]="isSelected(item)"
            [class.disabled]="!item.enabled"
            [title]="!item.enabled ? item.disabledReason || 'Unavailable' : ''"
            (click)="onItemClick(item)">
            
            <!-- Selection Indicator -->
            <div class="option-checkbox">
              @if (multi) {
                <input 
                  type="checkbox" 
                  class="form-check-input"
                  [checked]="isSelected(item)"
                  [disabled]="!item.enabled"
                  (click)="$event.stopPropagation()">
              } @else {
                <div 
                  class="radio-indicator"
                  [class.checked]="isSelected(item)">
                </div>
              }
            </div>
            
            <!-- Item Content -->
            <div class="option-content">
              <div class="option-header">
                @if (item.card.icon) {
                  <i [class]="item.card.icon + ' option-icon me-2'"></i>
                }
                <span class="option-title">{{item.card.title}}</span>
                @if (item.card.status) {
                  <span 
                    class="badge ms-2" 
                    [class]="'bg-' + item.card.status.variant + '-subtle text-' + item.card.status.variant">
                    {{item.card.status.label}}
                  </span>
                }
              </div>
              @if (item.card.subtitle || item.card.description) {
                <div class="option-subtitle text-muted small">
                  {{item.card.subtitle || item.card.description}}
                </div>
              }
              @if (!item.enabled && item.disabledReason) {
                <div class="option-disabled-reason small text-danger">
                  <i class="bx bx-info-circle me-1"></i>
                  {{item.disabledReason}}
                </div>
              }
            </div>
          </div>
        }
      </div>
      
      <!-- Pagination -->
      @if (totalPages() > 1) {
        <div class="panel-pagination">
          <div class="pagination-info small text-muted">
            {{((currentPage() - 1) * pageSize) + 1}} - {{getEndItem()}} of {{filteredItems().length}}
          </div>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" [class.disabled]="currentPage() === 1">
                <a class="page-link" (click)="goToPage(currentPage() - 1)">
                  <i class="bx bx-chevron-left"></i>
                </a>
              </li>
              @for (p of getPageNumbers(); track p) {
                <li class="page-item" [class.active]="currentPage() === p">
                  <a class="page-link" (click)="goToPage(p)">{{p}}</a>
                </li>
              }
              <li class="page-item" [class.disabled]="currentPage() === totalPages()">
                <a class="page-link" (click)="goToPage(currentPage() + 1)">
                  <i class="bx bx-chevron-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      }
      
      <!-- Footer Actions -->
      <div class="panel-footer">
        <button type="button" class="btn btn-sm btn-light" (click)="onCancel()">
          Cancel
        </button>
        @if (multi) {
          <button type="button" class="btn btn-sm btn-primary" (click)="onApplyClick()">
            Apply
            @if (pendingSelection().length > 0) {
              <span class="badge bg-white text-primary ms-1">{{pendingSelection().length}}</span>
            }
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .options-panel {
      display: flex;
      flex-direction: column;
      max-height: 100%;
    }
    
    .panel-search {
      padding: 0.75rem;
      border-bottom: 1px solid var(--vz-border-color, #e9ebec);
      
      .search-box {
        position: relative;
        
        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--vz-secondary-color, #878a99);
        }
        
        input {
          padding-left: 2rem;
          padding-right: 2rem;
        }
        
        .search-clear {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          color: var(--vz-secondary-color, #878a99);
        }
      }
    }
    
    .panel-options {
      flex: 1;
      overflow-y: auto;
      max-height: 250px;
    }
    
    .option-item {
      display: flex;
      align-items: flex-start;
      padding: 0.75rem;
      border-bottom: 1px solid var(--vz-border-color, #e9ebec);
      cursor: pointer;
      transition: background-color 0.15s ease-in-out;
      
      &:hover:not(.disabled) {
        background: var(--vz-tertiary-bg, #f3f6f9);
      }
      
      &.selected {
        background: var(--vz-primary-bg-subtle, #d3d8eb);
      }
      
      &.disabled {
        cursor: not-allowed;
        opacity: 0.6;
        
        .option-title {
          text-decoration: line-through;
        }
      }
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    .option-checkbox {
      flex-shrink: 0;
      margin-right: 0.75rem;
      padding-top: 0.125rem;
      
      .form-check-input {
        margin: 0;
        cursor: pointer;
        
        &:disabled {
          cursor: not-allowed;
        }
      }
      
      .radio-indicator {
        width: 16px;
        height: 16px;
        border: 2px solid var(--vz-border-color, #ced4da);
        border-radius: 50%;
        transition: all 0.15s ease-in-out;
        
        &.checked {
          border-color: var(--vz-primary, #405189);
          background: var(--vz-primary, #405189);
          box-shadow: inset 0 0 0 3px var(--vz-card-bg, #fff);
        }
      }
    }
    
    .option-content {
      flex: 1;
      min-width: 0;
    }
    
    .option-header {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      
      .option-icon {
        color: var(--vz-primary, #405189);
      }
      
      .option-title {
        font-weight: 500;
      }
    }
    
    .option-subtitle {
      margin-top: 0.25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .option-disabled-reason {
      margin-top: 0.25rem;
    }
    
    .no-results {
      padding: 2rem;
    }
    
    .panel-pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      border-top: 1px solid var(--vz-border-color, #e9ebec);
      
      .page-link {
        cursor: pointer;
      }
    }
    
    .panel-footer {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      border-top: 1px solid var(--vz-border-color, #e9ebec);
      background: var(--vz-tertiary-bg, #f3f6f9);
    }
  `]
})
export class OptionsPanelComponent<T = unknown> {
  // ─────────────────────────────────────────────────────────────────────────
  // INPUTS
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * All available items
   */
  @Input() items: IReferenceItem<T>[] = [];
  
  /**
   * Currently selected values
   */
  @Input() set selectedValues(values: T[]) {
    this.pendingSelection.set([...values]);
  }
  
  /**
   * Allow multiple selection
   */
  @Input() multi: boolean = false;
  
  /**
   * Show search box
   */
  @Input() searchable: boolean = true;
  
  /**
   * Items per page
   */
  @Input() pageSize: number = 10;
  
  /**
   * Search placeholder text
   */
  @Input() searchPlaceholder: string = 'Search...';
  
  // ─────────────────────────────────────────────────────────────────────────
  // OUTPUTS
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Emitted when selection changes
   */
  @Output() selectionChange = new EventEmitter<T[]>();
  
  /**
   * Emitted when close/cancel clicked
   */
  @Output() close = new EventEmitter<void>();
  
  /**
   * Emitted when apply clicked (multi mode)
   */
  @Output() apply = new EventEmitter<void>();
  
  // ─────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Current search query */
  searchQuery = signal('');
  
  /** Current page (1-based) */
  currentPage = signal(1);
  
  /** Pending selection (working copy) */
  pendingSelection = signal<T[]>([]);
  
  /** Filtered items based on search */
  filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    
    if (!query) {
      return this.items;
    }
    
    return this.items.filter(item => {
      const title = item.card.title?.toLowerCase() || '';
      const subtitle = item.card.subtitle?.toLowerCase() || '';
      const description = item.card.description?.toLowerCase() || '';
      
      return title.includes(query) || 
             subtitle.includes(query) || 
             description.includes(query);
    });
  });
  
  /** Total pages */
  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredItems().length / this.pageSize));
  });
  
  /** Items for current page */
  paginatedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredItems().slice(start, end);
  });
  
  // ─────────────────────────────────────────────────────────────────────────
  // METHODS
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Check if item is selected
   */
  isSelected(item: IReferenceItem<T>): boolean {
    return this.pendingSelection().includes(item.value);
  }
  
  /**
   * Handle search input
   */
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Reset to first page
  }
  
  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
  }
  
  /**
   * Handle item click
   */
  onItemClick(item: IReferenceItem<T>): void {
    if (!item.enabled) return;
    
    const current = this.pendingSelection();
    const isCurrentlySelected = current.includes(item.value);
    
    if (this.multi) {
      // Toggle selection
      if (isCurrentlySelected) {
        this.pendingSelection.set(current.filter(v => v !== item.value));
      } else {
        this.pendingSelection.set([...current, item.value]);
      }
    } else {
      // Single select - replace
      this.pendingSelection.set([item.value]);
      // Emit immediately for single select
      this.selectionChange.emit([item.value]);
    }
  }
  
  /**
   * Go to specific page
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }
  
  /**
   * Get page numbers for pagination display
   */
  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    
    // Show max 5 pages centered around current
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  
  /**
   * Get end item index for pagination info
   */
  getEndItem(): number {
    const end = this.currentPage() * this.pageSize;
    return Math.min(end, this.filteredItems().length);
  }
  
  /**
   * Handle cancel click
   */
  onCancel(): void {
    this.close.emit();
  }
  
  /**
   * Handle apply click (multi mode)
   */
  onApplyClick(): void {
    this.selectionChange.emit(this.pendingSelection());
    this.apply.emit();
  }
}
