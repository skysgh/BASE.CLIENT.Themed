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
} from '../../../../core/models/query/query-criteria.model';

@Component({
selector: 'app-browse-order-panel',
standalone: true,
imports: [CommonModule, SortRowComponent],
changeDetection: ChangeDetectionStrategy.OnPush,
templateUrl: './browse-order-panel.component.html',
styles: [`
    .browse-order-panel {
      background: var(--vz-light);
      border: 1px solid var(--vz-border-color);
      border-radius: 0.25rem;
      padding: 0.375rem 0.5rem;
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
