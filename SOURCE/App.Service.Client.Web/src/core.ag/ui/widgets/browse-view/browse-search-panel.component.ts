/**
 * Browse Search Panel Component
 * 
 * Search input for BrowseView.
 * Prominent, always visible at top.
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
      <div class="input-group">
        <span class="input-group-text bg-transparent border-end-0">
          <i class="bx bx-search text-muted"></i>
        </span>
        <input 
          type="text" 
          class="form-control border-start-0 ps-0"
          [placeholder]="placeholder"
          [ngModel]="query"
          (ngModelChange)="onQueryChange($event)"
          (keyup.enter)="onSearch()">
        @if (query) {
          <button 
            type="button" 
            class="btn btn-link text-muted px-2"
            (click)="onClear()"
            title="Clear search">
            <i class="bx bx-x"></i>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .browse-search-panel {
      margin-bottom: 1rem;
    }
    
    .input-group {
      background: var(--vz-input-bg);
      border-radius: 0.375rem;
      
      .input-group-text {
        border-color: var(--vz-input-border-color);
      }
      
      .form-control {
        border-color: var(--vz-input-border-color);
        
        &:focus {
          box-shadow: none;
          border-color: var(--vz-primary);
          
          & ~ .input-group-text {
            border-color: var(--vz-primary);
          }
        }
      }
    }
  `]
})
export class BrowseSearchPanelComponent {
  @Input() query = '';
  @Input() placeholder = 'Search...';
  
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
