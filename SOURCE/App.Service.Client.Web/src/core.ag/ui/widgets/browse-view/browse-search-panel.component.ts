/**
 * Browse Search Panel Component
 * 
 * Search input for BrowseView.
 * Prominent, always visible at top.
 * 
 * Features:
 * - Search icon prefix
 * - Optional entity/context icon 
 * - Clear button when text present
 * - Enter key to search
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-browse-search-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="browse-search-panel">
      <div class="input-group search-input-group">
        <!-- Entity/Context Icon (optional) -->
        @if (entityIcon) {
          <span class="input-group-text entity-icon-wrapper bg-primary-subtle border-end-0">
            <i class="bx {{ entityIcon }} text-primary"></i>
          </span>
        }
        
        <!-- Search Icon -->
        <span class="input-group-text search-icon-wrapper bg-transparent" 
              [class.border-start-0]="entityIcon"
              [class.border-end-0]="true">
          <i class="bx bx-search text-muted"></i>
        </span>
        
        <!-- Search Input -->
        <input 
          type="text" 
          class="form-control border-start-0 ps-0"
          [placeholder]="placeholder"
          [ngModel]="query"
          (ngModelChange)="onQueryChange($event)"
          (keyup.enter)="onSearch()"
          [attr.aria-label]="ariaLabel || placeholder">
        
        <!-- Clear Button -->
        @if (query) {
          <button 
            type="button" 
            class="btn btn-link text-muted px-2 clear-btn"
            (click)="onClear()"
            title="Clear search"
            aria-label="Clear search">
            <i class="bx bx-x fs-18"></i>
          </button>
        }
        
        <!-- Search Button (optional) -->
        @if (showSearchButton) {
          <button 
            type="button" 
            class="btn btn-primary"
            (click)="onSearch()"
            [disabled]="!query"
            title="Search">
            <i class="bx bx-search-alt-2"></i>
            @if (searchButtonText) {
              <span class="ms-1">{{ searchButtonText }}</span>
            }
          </button>
        }
      </div>
      
      <!-- Search hint (optional) -->
      @if (hint) {
        <small class="text-muted d-block mt-1">{{ hint }}</small>
      }
    </div>
  `,
  styles: [`
    .browse-search-panel {
      margin-bottom: 1rem;
    }
    
    .search-input-group {
      background: var(--vz-input-bg);
      border-radius: 0.375rem;
      transition: box-shadow 0.15s ease-in-out;
      
      &:focus-within {
        box-shadow: 0 0 0 0.15rem rgba(var(--vz-primary-rgb), 0.1);
        
        .input-group-text {
          border-color: var(--vz-primary);
        }
        
        .form-control {
          border-color: var(--vz-primary);
        }
      }
      
      .input-group-text {
        border-color: var(--vz-input-border-color);
        transition: border-color 0.15s ease-in-out;
      }
      
      .entity-icon-wrapper {
        border-top-left-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;
        padding: 0.5rem 0.75rem;
        
        i {
          font-size: 1.1rem;
        }
      }
      
      .search-icon-wrapper {
        padding: 0.5rem 0.5rem 0.5rem 0.75rem;
        
        i {
          font-size: 1rem;
        }
      }
      
      .form-control {
        border-color: var(--vz-input-border-color);
        transition: border-color 0.15s ease-in-out;
        
        &:focus {
          box-shadow: none;
        }
        
        &::placeholder {
          color: var(--vz-secondary-color);
          opacity: 0.7;
        }
      }
      
      .clear-btn {
        border: 1px solid var(--vz-input-border-color);
        border-left: 0;
        background: transparent;
        
        &:hover {
          color: var(--vz-danger) !important;
        }
      }
    }
  `]
})
export class BrowseSearchPanelComponent {
  /** Current search query */
  @Input() query = '';
  
  /** Placeholder text */
  @Input() placeholder = 'Search...';
  
  /** Aria label for accessibility */
  @Input() ariaLabel?: string;
  
  /** Optional entity icon (e.g., 'bx-bulb' for Spikes) */
  @Input() entityIcon?: string;
  
  /** Optional hint text below search */
  @Input() hint?: string;
  
  /** Show explicit search button */
  @Input() showSearchButton = false;
  
  /** Search button text (if showSearchButton is true) */
  @Input() searchButtonText?: string;
  
  @Output() queryChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  
  onQueryChange(value: string): void {
    this.queryChange.emit(value);
  }
  
  onSearch(): void {
    this.search.emit(this.query);
  }
  
  onClear(): void {
    this.queryChange.emit('');
    this.clear.emit();
  }
}
