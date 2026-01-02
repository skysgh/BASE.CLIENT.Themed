/**
 * Filter Row Component
 * 
 * A single row in the filter panel: [Field ▼] [Operator ▼] [Value] [✕]
 * Dynamically shows operators and value input based on field type.
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  FilterCriteria,
  FieldDefinition,
  FilterOperator,
  OperatorInfo,
  getOperatorsForType,
} from '../../../../core/models/query/query-criteria.model';

@Component({
  selector: 'app-filter-row',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filter-row d-flex align-items-center gap-2">
      <!-- Field Selector -->
      <select 
        class="form-select form-select-sm field-select"
        [ngModel]="criteria.field"
        (ngModelChange)="onFieldChange($event)">
        @for (field of fields; track field.field) {
          <option [value]="field.field">{{ field.label }}</option>
        }
      </select>
      
      <!-- Operator Selector -->
      <select 
        class="form-select form-select-sm operator-select"
        [ngModel]="criteria.operator"
        (ngModelChange)="onOperatorChange($event)">
        @for (op of availableOperators; track op.id) {
          <option [value]="op.id">{{ op.label }}</option>
        }
      </select>
      
      <!-- Value Input (varies by field type) -->
      @switch (currentFieldType) {
        @case ('select') {
          <select 
            class="form-select form-select-sm value-input"
            [ngModel]="criteria.value"
            (ngModelChange)="onValueChange($event)">
            @for (opt of currentFieldOptions; track opt.value) {
              <option [value]="opt.value">{{ opt.label }}</option>
            }
          </select>
        }
        @case ('multiselect') {
          <select 
            class="form-select form-select-sm value-input"
            [ngModel]="criteria.value"
            (ngModelChange)="onValueChange($event)"
            multiple>
            @for (opt of currentFieldOptions; track opt.value) {
              <option [value]="opt.value">{{ opt.label }}</option>
            }
          </select>
        }
        @case ('number') {
          <input 
            type="number" 
            class="form-control form-control-sm value-input"
            [ngModel]="criteria.value"
            (ngModelChange)="onValueChange($event)"
            placeholder="Value">
          @if (showSecondValue) {
            <span class="text-muted">and</span>
            <input 
              type="number" 
              class="form-control form-control-sm value-input"
              [ngModel]="criteria.value2"
              (ngModelChange)="onValue2Change($event)"
              placeholder="Value">
          }
        }
        @case ('date') {
          <input 
            type="date" 
            class="form-control form-control-sm value-input"
            [ngModel]="criteria.value"
            (ngModelChange)="onValueChange($event)">
          @if (showSecondValue) {
            <span class="text-muted">and</span>
            <input 
              type="date" 
              class="form-control form-control-sm value-input"
              [ngModel]="criteria.value2"
              (ngModelChange)="onValue2Change($event)">
          }
        }
        @case ('datetime') {
          <input 
            type="datetime-local" 
            class="form-control form-control-sm value-input"
            [ngModel]="criteria.value"
            (ngModelChange)="onValueChange($event)">
          @if (showSecondValue) {
            <span class="text-muted">and</span>
            <input 
              type="datetime-local" 
              class="form-control form-control-sm value-input"
              [ngModel]="criteria.value2"
              (ngModelChange)="onValue2Change($event)">
          }
        }
        @case ('boolean') {
          <select 
            class="form-select form-select-sm value-input"
            [ngModel]="criteria.value"
            (ngModelChange)="onValueChange($event)">
            <option [value]="true">Yes</option>
            <option [value]="false">No</option>
          </select>
        }
        @default {
          <!-- Text -->
          <input 
            type="text" 
            class="form-control form-control-sm value-input"
            [ngModel]="criteria.value"
            (ngModelChange)="onValueChange($event)"
            placeholder="Value">
        }
      }
      
      <!-- Remove Button -->
      <button 
        type="button" 
        class="btn btn-sm btn-outline-danger"
        (click)="onRemove()"
        title="Remove filter">
        <i class="bx bx-x"></i>
      </button>
    </div>
  `,
  styles: [`
    .filter-row {
      margin-bottom: 0.5rem;
    }
    
    .field-select {
      min-width: 120px;
      max-width: 150px;
    }
    
    .operator-select {
      min-width: 100px;
      max-width: 130px;
    }
    
    .value-input {
      flex: 1;
      min-width: 100px;
    }
  `]
})
export class FilterRowComponent implements OnChanges {
  @Input() criteria!: FilterCriteria;
  @Input() fields: FieldDefinition[] = [];
  
  @Output() criteriaChange = new EventEmitter<FilterCriteria>();
  @Output() remove = new EventEmitter<void>();
  
  availableOperators: OperatorInfo[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['criteria'] || changes['fields']) {
      this.updateAvailableOperators();
    }
  }
  
  get currentField(): FieldDefinition | undefined {
    return this.fields.find(f => f.field === this.criteria.field);
  }
  
  get currentFieldType(): string {
    return this.currentField?.type || 'text';
  }
  
  get currentFieldOptions(): Array<{ value: string; label: string }> {
    return this.currentField?.options || [];
  }
  
  get showSecondValue(): boolean {
    const op = this.availableOperators.find(o => o.id === this.criteria.operator);
    return op?.requiresSecondValue || false;
  }
  
  private updateAvailableOperators(): void {
    const type = this.currentField?.type || 'text';
    this.availableOperators = getOperatorsForType(type);
    
    // If current operator not valid for new field, reset to first available
    if (!this.availableOperators.find(o => o.id === this.criteria.operator)) {
      this.criteria.operator = this.availableOperators[0]?.id || 'eq';
    }
  }
  
  onFieldChange(field: string): void {
    const updated: FilterCriteria = {
      ...this.criteria,
      field,
      value: '', // Reset value when field changes
      value2: undefined,
    };
    
    // Update operator based on new field type
    const newField = this.fields.find(f => f.field === field);
    const operators = getOperatorsForType(newField?.type || 'text');
    if (!operators.find(o => o.id === updated.operator)) {
      updated.operator = newField?.defaultOperator || operators[0]?.id || 'eq';
    }
    
    this.criteriaChange.emit(updated);
  }
  
  onOperatorChange(operator: FilterOperator): void {
    const updated: FilterCriteria = {
      ...this.criteria,
      operator,
    };
    
    // Clear value2 if not needed
    const op = this.availableOperators.find(o => o.id === operator);
    if (!op?.requiresSecondValue) {
      updated.value2 = undefined;
    }
    
    this.criteriaChange.emit(updated);
  }
  
  onValueChange(value: any): void {
    this.criteriaChange.emit({
      ...this.criteria,
      value,
    });
  }
  
  onValue2Change(value2: any): void {
    this.criteriaChange.emit({
      ...this.criteria,
      value2,
    });
  }
  
  onRemove(): void {
    this.remove.emit();
  }
}
