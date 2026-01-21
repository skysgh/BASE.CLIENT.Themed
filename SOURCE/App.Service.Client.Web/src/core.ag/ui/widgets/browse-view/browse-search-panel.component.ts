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
templateUrl: './browse-search-panel.component.html',
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
