/**
 * Browse Filter Panel Component
 * 
 * Filter controls with read/write toggle.
 * - Read mode: Compact italic text summary of active filters
 * - Write mode: Dynamic rows for adding/editing/removing filters
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterRowComponent } from './filter-row.component';
import {
  FilterCriteria,
  FieldDefinition,
  createFilterCriteria,
  formatFilterForDisplay,
} from '../../../../core/models/query/query-criteria.model';

@Component({
  selector: 'app-browse-filter-panel',
  standalone: true,
  imports: [CommonModule, FilterRowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="browse-filter-panel" [class.expanded]="expanded">
      <!-- Read Mode: Compact summary -->
      <div class="filter-read-mode d-flex align-items-center gap-2">
        <button 
          type="button" 
          class="btn btn-sm btn-link p-0 text-muted"
          (click)="toggleExpanded()"
          [title]="expanded ? 'Collapse filters' : 'Expand filters'">
          <i class="bx" [class.bx-filter]="!expanded" [class.bx-x]="expanded"></i>
        </button>
        
        <div class="filter-summary flex-grow-1" (click)="toggleExpanded()">
          @if (filters.length === 0) {
            <span class="filter-label">No filters applied</span>
          } @else {
            @for (filter of filters; track filter.id; let last = $last) {
              <span class="filter-item">
                {{ getFilterDisplay(filter) }}
              </span>
              @if (!last) {
                <span class="filter-separator">•</span>
              }
            }
          }
        </div>
      </div>
      
      <!-- Write Mode: Dynamic filter rows -->
      @if (expanded) {
        <div class="filter-write-mode mt-3 pt-3 border-top">
          <!-- Filter Rows -->
          @for (filter of filters; track filter.id) {
            <app-filter-row
              [criteria]="filter"
              [fields]="filterableFields"
              (criteriaChange)="onFilterChange($event)"
              (remove)="onRemoveFilter(filter)">
            </app-filter-row>
          }
          
          <!-- Add Button + Apply -->
          <div class="d-flex justify-content-between align-items-center mt-3">
            <button 
              type="button" 
              class="btn btn-sm btn-outline-primary"
              (click)="onAddFilter()">
              <i class="bx bx-plus me-1"></i>
              Add Filter
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
    .browse-filter-panel {
      background: var(--vz-light);
      border: 1px solid var(--vz-border-color);
      border-radius: 0.25rem;
      padding: 0.375rem 0.5rem;
    }
    
    .filter-summary {
      font-size: 0.8125rem;
      font-style: italic;
      color: var(--vz-secondary-color);
      cursor: pointer;
      
      &:hover {
        color: var(--vz-body-color);
      }
    }
    
    .filter-item {
      strong {
        font-weight: 600;
        font-style: normal;
      }
    }
    
    .filter-separator {
      margin: 0 0.5rem;
      opacity: 0.5;
    }
    
    .filter-label {
      opacity: 0.7;
    }
  `]
})
export class BrowseFilterPanelComponent {
  @Input() filters: FilterCriteria[] = [];
  @Input() fields: FieldDefinition[] = [];
  @Input() expanded = false;
  
  @Output() filtersChange = new EventEmitter<FilterCriteria[]>();
  @Output() expandedChange = new EventEmitter<boolean>();
  @Output() apply = new EventEmitter<void>();
  
  get filterableFields(): FieldDefinition[] {
    return this.fields.filter(f => f.filterable !== false);
  }
  
  getFilterDisplay(filter: FilterCriteria): string {
    const fieldDef = this.fields.find(f => f.field === filter.field);
    return formatFilterForDisplay(filter, fieldDef);
  }
  
  toggleExpanded(): void {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }
  
  onAddFilter(): void {
    const firstField = this.filterableFields[0];
    if (!firstField) return;
    
    const newFilter = createFilterCriteria(
      firstField.field,
      firstField.defaultOperator || 'eq',
      ''
    );
    
    const updated = [...this.filters, newFilter];
    this.filtersChange.emit(updated);
  }
  
  onFilterChange(updated: FilterCriteria): void {
    const filters = this.filters.map(f => 
      f.id === updated.id ? updated : f
    );
    this.filtersChange.emit(filters);
  }
  
  onRemoveFilter(filter: FilterCriteria): void {
    const updated = this.filters.filter(f => f.id !== filter.id);
    this.filtersChange.emit(updated);
  }
  
  onApply(): void {
    this.apply.emit();
    this.expanded = false;
    this.expandedChange.emit(false);
  }
}

// Re-export for backward compatibility
export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  icon?: string;
  removable?: boolean;
}
