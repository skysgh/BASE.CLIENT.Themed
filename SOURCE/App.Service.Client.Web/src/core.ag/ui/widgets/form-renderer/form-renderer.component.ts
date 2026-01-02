import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormDefinition } from '../../../../../core/forms/form-definition.model';
import { toFormlyConfig, createFormlyModel, toViewModeConfig } from '../../../../../core/forms/formly-adapter';

/**
 * Form Renderer Component
 * 
 * WRAPPER around Formly that isolates the dependency.
 * 
 * WHY THIS EXISTS:
 * - 3rd party applet developers never need to know about @ngx-formly
 * - Swap form engines (Formly → JSON Forms) = change THIS file only
 * - Centralized form rendering logic
 * - Consistent styling and behavior
 * 
 * USAGE:
 * ```html
 * <app-form-renderer
 *   [formDefinition]="formDef"
 *   [model]="data"
 *   [mode]="'edit'"
 *   (formSubmit)="onSave($event)"
 *   (formCancel)="onCancel()">
 * </app-form-renderer>
 * ```
 * 
 * IMPORT:
 * ```typescript
 * import { FormRendererComponent } from '@core.ag/ui/widgets/form-renderer';
 * // NOT: import { FormlyModule } from '@ngx-formly/core';
 * ```
 */
@Component({
  selector: 'app-form-renderer',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormlyModule, 
    FormlyBootstrapModule
  ],
  templateUrl: './form-renderer.component.html',
  styleUrls: ['./form-renderer.component.scss']
})
export class FormRendererComponent implements OnInit, OnChanges {
  /**
   * Form definition (engine-agnostic schema)
   * Loaded from YAML/JSON or defined programmatically
   */
  @Input() formDefinition?: FormDefinition;
  
  /**
   * Data model to bind to form
   */
  @Input() model: any = {};
  
  /**
   * Form mode: 'view', 'edit', or 'add'
   * - view: Renders as labels (read-only)
   * - edit: Renders as inputs
   * - add: Renders as inputs with defaults
   */
  @Input() mode: 'view' | 'edit' | 'add' = 'edit';
  
  /**
   * Show form action buttons (Save/Cancel)
   */
  @Input() showActions: boolean = true;
  
  /**
   * Submit button text
   */
  @Input() submitLabel: string = 'Save';
  
  /**
   * Cancel button text
   */
  @Input() cancelLabel: string = 'Cancel';
  
  /**
   * Loading state
   */
  @Input() loading: boolean = false;
  
  /**
   * Disable form (read-only but styled as form)
   */
  @Input() disabled: boolean = false;
  
  /**
   * Form submitted (emits model data)
   */
  @Output() formSubmit = new EventEmitter<any>();
  
  /**
   * Form cancelled
   */
  @Output() formCancel = new EventEmitter<void>();
  
  /**
   * Form value changed
   */
  @Output() formChange = new EventEmitter<any>();
  
  /**
   * Form validity changed
   */
  @Output() validityChange = new EventEmitter<boolean>();

  // Internal Formly state (hidden from consumers)
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  internalModel: any = {};

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formDefinition'] || changes['mode']) {
      this.initializeForm();
    }
    if (changes['model']) {
      this.internalModel = { ...this.model };
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  private initializeForm(): void {
    if (!this.formDefinition) return;
    
    // Convert to Formly config
    const forceReadonly = this.mode === 'view';
    this.fields = toFormlyConfig(this.formDefinition, forceReadonly);
    
    // Initialize model with defaults if adding
    if (this.mode === 'add') {
      this.internalModel = {
        ...createFormlyModel(this.formDefinition),
        ...this.model
      };
    } else {
      this.internalModel = { ...this.model };
    }
    
    // Set up form change detection
    this.form.valueChanges.subscribe(() => {
      this.formChange.emit(this.internalModel);
      this.validityChange.emit(this.form.valid);
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.internalModel);
    }
  }

  /**
   * Handle cancel
   */
  onCancel(): void {
    this.formCancel.emit();
  }

  /**
   * Reset form to original model
   */
  reset(): void {
    this.internalModel = { ...this.model };
    this.form.reset();
  }

  /**
   * Check if form is valid
   */
  get isValid(): boolean {
    return this.form.valid;
  }

  /**
   * Check if form has changes
   */
  get isDirty(): boolean {
    return this.form.dirty;
  }

  /**
   * Get current form value
   */
  getValue(): any {
    return this.internalModel;
  }
}
