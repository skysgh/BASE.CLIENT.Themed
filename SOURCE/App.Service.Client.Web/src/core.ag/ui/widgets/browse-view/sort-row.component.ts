/**
 * Sort Row Component
 * 
 * A single row in the sort panel: [Field ▼] [Direction ▼] [✕]
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  SortCriteria,
  SortDirection,
  FieldDefinition,
} from '../../../../core/models/query/query-criteria.model';

@Component({
  selector: 'app-sort-row',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sort-row d-flex align-items-center gap-2">
      <!-- Field Selector -->
      <select 
        class="form-select form-select-sm field-select"
        [ngModel]="criteria.field"
        (ngModelChange)="onFieldChange($event)">
        @for (field of sortableFields; track field.field) {
          <option [value]="field.field">{{ field.label }}</option>
        }
      </select>
      
      <!-- Direction Selector -->
      <select 
        class="form-select form-select-sm direction-select"
        [ngModel]="criteria.direction"
        (ngModelChange)="onDirectionChange($event)">
        <option value="asc">{{ getAscLabel() }}</option>
        <option value="desc">{{ getDescLabel() }}</option>
      </select>
      
      <!-- Remove Button -->
      <button 
        type="button" 
        class="btn btn-sm btn-outline-danger"
        (click)="onRemove()"
        title="Remove sort">
        <i class="bx bx-x"></i>
      </button>
    </div>
  `,
  styles: [`
    .sort-row {
      margin-bottom: 0.5rem;
    }
    
    .field-select {
      min-width: 150px;
      flex: 1;
    }
    
    .direction-select {
      min-width: 120px;
    }
  `]
})
export class SortRowComponent {
  @Input() criteria!: SortCriteria;
  @Input() fields: FieldDefinition[] = [];
  
  @Output() criteriaChange = new EventEmitter<SortCriteria>();
  @Output() remove = new EventEmitter<void>();
  
  get sortableFields(): FieldDefinition[] {
    return this.fields.filter(f => f.sortable !== false);
  }
  
  get currentField(): FieldDefinition | undefined {
    return this.fields.find(f => f.field === this.criteria.field);
  }
  
  getAscLabel(): string {
    const type = this.currentField?.type;
    switch (type) {
      case 'number': return 'Low → High';
      case 'date':
      case 'datetime': return 'Oldest → Newest';
      default: return 'A → Z';
    }
  }
  
  getDescLabel(): string {
    const type = this.currentField?.type;
    switch (type) {
      case 'number': return 'High → Low';
      case 'date':
      case 'datetime': return 'Newest → Oldest';
      default: return 'Z → A';
    }
  }
  
  onFieldChange(field: string): void {
    this.criteriaChange.emit({
      ...this.criteria,
      field,
    });
  }
  
  onDirectionChange(direction: SortDirection): void {
    this.criteriaChange.emit({
      ...this.criteria,
      direction,
    });
  }
  
  onRemove(): void {
    this.remove.emit();
  }
}
