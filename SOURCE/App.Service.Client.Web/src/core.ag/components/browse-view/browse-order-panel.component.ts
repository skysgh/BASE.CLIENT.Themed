/**
 * Browse Order Panel Component
 * 
 * Sort controls with read/write toggle.
 * - Read mode: Compact italic text summary of sort order
 * - Write mode: Dynamic rows for adding/editing/removing sorts
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SortRowComponent } from './sort-row.component';
import {
  SortCriteria,
  FieldDefinition,
  createSortCriteria,
  formatSortForDisplay,
} from '../../../core/models/query/query-criteria.model';

@Component({
  selector: 'app-browse-order-panel',
  standalone: true,
  imports: [CommonModule, SortRowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="browse-order-panel" [class.expanded]="expanded">
      <!-- Read Mode: Compact summary -->
      <div class="order-read-mode d-flex align-items-center gap-2">
        <button 
          type="button" 
          class="btn btn-sm btn-link p-0 text-muted"
          (click)="toggleExpanded()"
          [title]="expanded ? 'Collapse sort' : 'Expand sort'">
          <i class="bx" [class.bx-sort-alt-2]="!expanded" [class.bx-x]="expanded"></i>
        </button>
        
        <div class="order-summary flex-grow-1" (click)="toggleExpanded()">
          @if (sorts.length === 0) {
            <span class="order-label">Default order</span>
          } @else {
            @for (sort of sorts; track sort.id; let last = $last) {
              <span class="sort-item">
                {{ getSortDisplay(sort) }}
              </span>
              @if (!last) {
                <span class="sort-separator">, then</span>
              }
            }
          }
        </div>
      </div>
      
      <!-- Write Mode: Dynamic sort rows -->
      @if (expanded) {
        <div class="order-write-mode mt-3 pt-3 border-top">
          <!-- Sort Rows -->
          @for (sort of sorts; track sort.id; let i = $index) {
            <div class="d-flex align-items-center gap-2 mb-2">
              @if (i > 0) {
                <span class="text-muted small">then</span>
              }
              <app-sort-row
                [criteria]="sort"
                [fields]="sortableFields"
                (criteriaChange)="onSortChange($event)"
                (remove)="onRemoveSort(sort)"
                class="flex-grow-1">
              </app-sort-row>
            </div>
          }
          
          <!-- Add Button + Apply -->
          <div class="d-flex justify-content-between align-items-center mt-3">
            <button 
              type="button" 
              class="btn btn-sm btn-outline-primary"
              (click)="onAddSort()"
              [disabled]="sorts.length >= sortableFields.length">
              <i class="bx bx-plus me-1"></i>
              Add Sort
            </button>
            
            <button 
              type="button" 
              class="btn btn-sm btn-primary"
              (click)="onApply()">
              Apply
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .browse-order-panel {
      background: var(--vz-light);
      border: 1px solid var(--vz-border-color);
      border-radius: 0.375rem;
      padding: 0.5rem 0.75rem;
      margin-bottom: 0.75rem;
    }
    
    .order-summary {
      font-size: 0.8125rem;
      font-style: italic;
      color: var(--vz-secondary-color);
      cursor: pointer;
      
      &:hover {
        color: var(--vz-body-color);
      }
    }
    
    .sort-separator {
      margin: 0 0.25rem;
      opacity: 0.7;
    }
    
    .order-label {
      opacity: 0.7;
    }
  `]
})
export class BrowseOrderPanelComponent {
  @Input() sorts: SortCriteria[] = [];
  @Input() fields: FieldDefinition[] = [];
  @Input() expanded = false;
  
  @Output() sortsChange = new EventEmitter<SortCriteria[]>();
  @Output() expandedChange = new EventEmitter<boolean>();
  @Output() apply = new EventEmitter<void>();
  
  get sortableFields(): FieldDefinition[] {
    return this.fields.filter(f => f.sortable !== false);
  }
  
  getSortDisplay(sort: SortCriteria): string {
    const fieldDef = this.fields.find(f => f.field === sort.field);
    return formatSortForDisplay(sort, fieldDef);
  }
  
  toggleExpanded(): void {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }
  
  toggleFirstDirection(): void {
    if (this.sorts.length === 0) return;
    
    const first = this.sorts[0];
    const updated: SortCriteria = {
      ...first,
      direction: first.direction === 'asc' ? 'desc' : 'asc',
    };
    
    const sorts = [updated, ...this.sorts.slice(1)];
    this.sortsChange.emit(sorts);
    this.apply.emit();
  }
  
  onAddSort(): void {
    // Find first sortable field not already in sorts
    const usedFields = new Set(this.sorts.map(s => s.field));
    const availableField = this.sortableFields.find(f => !usedFields.has(f.field));
    
    if (!availableField) return;
    
    const newSort = createSortCriteria(availableField.field, 'asc');
    const updated = [...this.sorts, newSort];
    this.sortsChange.emit(updated);
  }
  
  onSortChange(updated: SortCriteria): void {
    const sorts = this.sorts.map(s => 
      s.id === updated.id ? updated : s
    );
    this.sortsChange.emit(sorts);
  }
  
  onRemoveSort(sort: SortCriteria): void {
    const updated = this.sorts.filter(s => s.id !== sort.id);
    this.sortsChange.emit(updated);
  }
  
  onApply(): void {
    this.apply.emit();
    this.expanded = false;
    this.expandedChange.emit(false);
  }
}

// Re-export for backward compatibility
export interface SortOption {
  field: string;
  label: string;
  icon?: string;
}
