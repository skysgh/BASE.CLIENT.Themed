import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDefinition, FormFieldDefinition, FormSection } from '../../../../../core/forms/form-definition.model';

/**
 * Read-Only Form Renderer
 * 
 * Renders form data in a read-only view using themed labels,
 * badges, and cards - NOT form inputs.
 */
@Component({
  selector: 'app-readonly-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './readonly-form.component.html',
  styleUrls: ['./readonly-form.component.scss']
})
export class ReadonlyFormComponent implements OnInit, OnChanges {
  /** Form definition */
  @Input() formDefinition?: FormDefinition;
  
  /** Data model to display */
  @Input() model: any = {};

  /** Sections to render */
  sections: FormSection[] = [];
  
  /** Fields grouped by section */
  fieldsBySection: Map<string, FormFieldDefinition[]> = new Map();
  
  /** Ungrouped fields (no section) */
  ungroupedFields: FormFieldDefinition[] = [];

  ngOnInit(): void {
    this.processDefinition();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formDefinition']) {
      this.processDefinition();
    }
  }

  private processDefinition(): void {
    if (!this.formDefinition) return;

    // Reset
    this.fieldsBySection.clear();
    this.ungroupedFields = [];

    const { fields, layout } = this.formDefinition;
    
    if (layout?.sections && layout.sections.length > 0) {
      this.sections = layout.sections;
      
      // Group fields by section
      for (const section of this.sections) {
        const sectionFields = fields.filter((f: FormFieldDefinition) => section.fieldKeys.includes(f.key));
        this.fieldsBySection.set(section.id, sectionFields);
      }
      
      // Find ungrouped fields
      const allSectionKeys = this.sections.flatMap(s => s.fieldKeys);
      this.ungroupedFields = fields.filter((f: FormFieldDefinition) => !allSectionKeys.includes(f.key) && f.type !== 'hidden');
    } else {
      // No sections - all fields are ungrouped
      this.ungroupedFields = fields.filter((f: FormFieldDefinition) => f.type !== 'hidden');
    }
  }

  /**
   * Get display value for a field
   */
  getDisplayValue(field: FormFieldDefinition): string {
    const rawValue = this.model[field.key];
    
    if (rawValue === undefined || rawValue === null || rawValue === '') {
      return '—';
    }

    // Handle select fields - show label not value
    if (field.options && (field.type === 'select' || field.type === 'radio')) {
      const option = field.options.find((o: any) => o.value == rawValue);
      return option?.label || String(rawValue);
    }

    // Handle multiselect - show comma-separated labels
    if (field.options && field.type === 'multiselect' && Array.isArray(rawValue)) {
      return rawValue
        .map((v: any) => field.options?.find((o: any) => o.value == v)?.label || v)
        .join(', ') || '—';
    }

    // Handle boolean
    if (field.type === 'checkbox' || field.type === 'toggle') {
      return rawValue ? 'Yes' : 'No';
    }

    // Handle date
    if (field.type === 'date' || field.type === 'datetime') {
      const date = new Date(rawValue);
      return isNaN(date.getTime()) ? String(rawValue) : date.toLocaleDateString();
    }

    return String(rawValue);
  }

  /**
   * Get CSS class for field value based on type
   */
  getValueClass(field: FormFieldDefinition): string {
    if (field.type === 'number') {
      return 'text-end';
    }
    return '';
  }

  /**
   * Check if field should show as badge
   */
  isBadgeField(field: FormFieldDefinition): boolean {
    return field.type === 'select' && 
           (field.key.includes('status') || field.key.includes('priority'));
  }

  /**
   * Get badge color based on field value
   */
  getBadgeClass(field: FormFieldDefinition): string {
    const value = this.model[field.key];
    
    if (field.key.includes('status')) {
      switch (String(value)) {
        case '1': return 'bg-secondary';
        case '2': return 'bg-primary';
        case '3': return 'bg-success';
        case '4': return 'bg-danger';
        case '5': return 'bg-dark';
        default: return 'bg-secondary';
      }
    }
    
    if (field.key.includes('priority')) {
      switch (Number(value)) {
        case 1: return 'bg-secondary';
        case 2: return 'bg-info';
        case 3: return 'bg-primary';
        case 4: return 'bg-warning';
        case 5: return 'bg-danger';
        default: return 'bg-secondary';
      }
    }
    
    return 'bg-primary';
  }

  /**
   * Check if field is a tags/classification field
   */
  isTagsField(field: FormFieldDefinition): boolean {
    return field.type === 'multiselect';
  }

  /**
   * Get tags for multiselect field
   */
  getTags(field: FormFieldDefinition): string[] {
    const rawValue = this.model[field.key];
    if (!Array.isArray(rawValue)) return [];
    
    return rawValue.map((v: any) => {
      const option = field.options?.find((o: any) => o.value == v);
      return option?.label || String(v);
    });
  }
}
