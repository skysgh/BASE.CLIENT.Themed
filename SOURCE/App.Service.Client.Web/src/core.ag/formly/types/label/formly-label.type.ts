import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';

/**
 * Formly Label Field Type
 * 
 * Renders a field as a read-only label, NOT an input.
 * Used for View mode to show data using Formly schema.
 * 
 * Benefits:
 * - Uses same form schema as Edit mode
 * - Proper semantic elements (not disabled inputs)
 * - Themed to match app styles
 * - Supports all field types (text, select, date, etc.)
 * 
 * Usage in Formly config:
 * ```typescript
 * { key: 'title', type: 'label', props: { label: 'Title' } }
 * ```
 */
@Component({
    selector: 'formly-field-label',
    imports: [CommonModule],
    template: `
    <div class="formly-label-field mb-3">
      <label class="form-label text-muted small text-uppercase">
        {{ props.label }}
      </label>
      <div class="field-value" [ngClass]="valueClass">
        <!-- Badge style for status/priority -->
        <ng-container *ngIf="isBadgeField">
          <span class="badge" [style.background-color]="badgeColor">
            {{ displayValue }}
          </span>
        </ng-container>
        
        <!-- Tags style for multiselect -->
        <ng-container *ngIf="isTagsField">
          <div class="d-flex flex-wrap gap-1">
            <span *ngFor="let tag of tags" class="badge bg-info-subtle text-info">
              {{ tag }}
            </span>
            <span *ngIf="tags.length === 0" class="text-muted">—</span>
          </div>
        </ng-container>
        
        <!-- Default text style -->
        <ng-container *ngIf="!isBadgeField && !isTagsField">
          <span [innerHTML]="displayValue"></span>
        </ng-container>
      </div>
    </div>
  `,
    styles: [`
    .formly-label-field {
      .form-label {
        font-weight: 500;
        font-size: 0.75rem;
        letter-spacing: 0.3px;
        margin-bottom: 0.25rem;
      }
      
      .field-value {
        font-size: 0.9375rem;
        color: var(--vz-body-color);
        min-height: 1.5rem;
        
        &.text-monospace {
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
        }
      }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormlyLabelFieldComponent extends FieldType<FieldTypeConfig> {
  
  /**
   * Get display value based on field type
   */
  get displayValue(): string {
    const value = this.formControl.value;
    
    if (value === undefined || value === null || value === '') {
      return '—';
    }

    // Handle select - show label
    if (this.props['options'] && !Array.isArray(value)) {
      const options = this.props['options'] as any[];
      const option = options.find(o => o.value == value);
      return option?.label || String(value);
    }

    // Handle date
    if (this.props['type'] === 'date' || this.props['type'] === 'datetime-local') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
    }

    // Handle boolean
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return String(value);
  }

  /**
   * Get tags for multiselect
   */
  get tags(): string[] {
    const value = this.formControl.value;
    if (!Array.isArray(value)) return [];
    
    const options = this.props['options'] as any[];
    if (!options) return value.map(String);
    
    return value.map(v => {
      const option = options.find(o => o.value == v);
      return option?.label || String(v);
    });
  }

  /**
   * Check if field should show as badge
   */
  get isBadgeField(): boolean {
    return this.props['displayAs'] === 'badge' || 
           (this.key?.toString().includes('status') || 
            this.key?.toString().includes('priority'));
  }

  /**
   * Check if field is tags/multiselect
   */
  get isTagsField(): boolean {
    return this.props['multiple'] === true || 
           this.props['displayAs'] === 'tags' ||
           Array.isArray(this.formControl.value);
  }

  /**
   * Get badge color based on field value
   */
  get badgeColor(): string {
    const value = this.formControl.value;
    
    if (this.key?.toString().includes('status')) {
      switch (String(value)) {
        case '1': return '#6c757d'; // Draft
        case '2': return '#007bff'; // Submitted
        case '3': return '#28a745'; // Approved
        case '4': return '#dc3545'; // Rejected
        case '5': return '#343a40'; // Archived
        default: return '#6c757d';
      }
    }
    
    if (this.key?.toString().includes('priority')) {
      switch (Number(value)) {
        case 1: return '#6c757d';
        case 2: return '#17a2b8';
        case 3: return '#007bff';
        case 4: return '#ffc107';
        case 5: return '#dc3545';
        default: return '#6c757d';
      }
    }
    
    return this.props['badgeColor'] || '#007bff';
  }

  /**
   * Get CSS class for value
   */
  get valueClass(): string {
    if (this.props['type'] === 'number') {
      return 'text-monospace';
    }
    return '';
  }
}
