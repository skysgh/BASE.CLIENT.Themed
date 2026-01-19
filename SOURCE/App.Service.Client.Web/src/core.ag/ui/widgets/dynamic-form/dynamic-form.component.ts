/**
 * DynamicFormComponent
 * 
 * A schema-driven form component that consumes EntitySchema and renders
 * via the Form Engine abstraction layer (default: Formly).
 * 
 * USAGE:
 * ```html
 * <!-- Edit mode from EntitySchema -->
 * <app-dynamic-form
 *   [entitySchema]="spikeSchema"
 *   [mode]="'edit'"
 *   [data]="spikeRecord"
 *   (formSubmit)="onSave($event)"
 *   (formCancel)="onCancel()">
 * </app-dynamic-form>
 * 
 * <!-- Add mode (creates new record) -->
 * <app-dynamic-form
 *   [entitySchema]="spikeSchema"
 *   [mode]="'add'"
 *   (formSubmit)="onCreate($event)">
 * </app-dynamic-form>
 * 
 * <!-- Detail/view mode (read-only) -->
 * <app-dynamic-form
 *   [entitySchema]="spikeSchema"
 *   [mode]="'detail'"
 *   [data]="spikeRecord">
 * </app-dynamic-form>
 * ```
 * 
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                     EntitySchema                            │
 * │                   (Engine-Agnostic DSL)                     │
 * └───────────────────────────┬─────────────────────────────────┘
 *                             │
 *           FormEngineRegistry.generateFormlyConfig()
 *                             │
 *                             ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    <formly-form>                            │
 * │                   (Renders the form)                        │
 * └─────────────────────────────────────────────────────────────┘
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

// Schema imports
import { EntitySchema } from '../../../../core/models/schema/entity-schema.model';
import { FormViewSchema, FormViewMode } from '../../../../core/models/schema/form-view-schema.model';

// Form engine imports
import { FormEngineRegistry } from '../../../../core/services/form-engine-registry.service';
import { FormlyFormConfig, FormConversionResult } from '../../../../core/models/form-engine/form-schema-adapter';

// ═══════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════

export type DynamicFormMode = 'add' | 'edit' | 'detail' | 'clone';

export interface DynamicFormSubmitEvent<T = Record<string, unknown>> {
  mode: DynamicFormMode;
  data: T;
  originalData?: T;
  isValid: boolean;
}

/** Extended form config with metadata */
interface ExtendedFormConfig extends FormlyFormConfig {
  title?: string;
  description?: string;
}

// ═══════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
  ],
  template: `
    <div class="dynamic-form" [class.dynamic-form--readonly]="mode === 'detail'">
      <!-- Form Header -->
      @if (showHeaderInput && (title() || description())) {
        <div class="dynamic-form__header mb-3">
          @if (title()) {
            <h5 class="dynamic-form__title">{{ title() }}</h5>
          }
          @if (description()) {
            <p class="dynamic-form__description text-muted">{{ description() }}</p>
          }
        </div>
      }

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="dynamic-form__loading d-flex justify-content-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      }

      <!-- Error State -->
      @if (error()) {
        <div class="alert alert-danger" role="alert">
          <i class="ri-error-warning-line me-2"></i>
          {{ error() }}
        </div>
      }

      <!-- Form -->
      @if (!isLoading() && !error() && formlyFields().length > 0) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <formly-form
            [form]="form"
            [fields]="formlyFields()"
            [model]="formModel"
            [options]="formlyOptions">
          </formly-form>

          <!-- Form Actions -->
          @if (showActions && mode !== 'detail') {
            <div class="dynamic-form__actions mt-4 d-flex gap-2">
              @if (showSubmit) {
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="!form.valid || isSubmitting()">
                  @if (isSubmitting()) {
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  }
                  {{ submitLabel }}
                </button>
              }
              @if (showCancel) {
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  (click)="onCancel()"
                  [disabled]="isSubmitting()">
                  {{ cancelLabel }}
                </button>
              }
              @if (showReset) {
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  (click)="onReset()"
                  [disabled]="isSubmitting()">
                  Reset
                </button>
              }
            </div>
          }
        </form>
      }

      <!-- Empty State -->
      @if (!isLoading() && !error() && formlyFields().length === 0) {
        <div class="alert alert-info" role="alert">
          <i class="ri-information-line me-2"></i>
          No form fields defined for this entity.
        </div>
      }
    </div>
  `,
  styles: [`
    .dynamic-form {
      &--readonly {
        formly-field input,
        formly-field select,
        formly-field textarea {
          background-color: var(--bs-gray-100);
          pointer-events: none;
        }
      }

      &__header {
        border-bottom: 1px solid var(--bs-border-color);
        padding-bottom: 0.75rem;
      }

      &__title {
        margin-bottom: 0.25rem;
      }

      &__description {
        margin-bottom: 0;
        font-size: 0.875rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit, OnChanges {
  private formEngineRegistry = inject(FormEngineRegistry);

  // ─────────────────────────────────────────────────────────────────
  // Inputs
  // ─────────────────────────────────────────────────────────────────

  /** Entity schema defining the form structure */
  @Input() entitySchema?: EntitySchema;

  /** Pre-built form view schema (alternative to entitySchema) */
  @Input() formViewSchema?: FormViewSchema;

  /** Form mode: add, edit, detail, clone */
  @Input() mode: DynamicFormMode = 'edit';

  /** Initial data to populate the form */
  @Input() data?: Record<string, unknown>;

  /** Show form header (title/description) */
  @Input('showHeader') showHeaderInput = true;

  /** Show action buttons */
  @Input() showActions = true;

  /** Show submit button */
  @Input() showSubmit = true;

  /** Show cancel button */
  @Input() showCancel = true;

  /** Show reset button */
  @Input() showReset = false;

  /** Submit button label */
  @Input() submitLabel = 'Save';

  /** Cancel button label */
  @Input() cancelLabel = 'Cancel';

  /** Custom title (overrides schema title) */
  @Input() customTitle?: string;

  /** Custom description (overrides schema description) */
  @Input() customDescription?: string;

  /**
   * Preset field values that are locked (read-only).
   * Use when creating a child entity from parent context.
   * 
   * Example: { starSystemId: 'sol' } when adding planet from star system detail
   */
  @Input() lockedFields: Record<string, unknown> = {};

  // ─────────────────────────────────────────────────────────────────
  // Outputs
  // ─────────────────────────────────────────────────────────────────

  /** Emits when form is submitted */
  @Output() formSubmit = new EventEmitter<DynamicFormSubmitEvent>();

  /** Emits when cancel is clicked */
  @Output() formCancel = new EventEmitter<void>();

  /** Emits when form value changes */
  @Output() formChange = new EventEmitter<Record<string, unknown>>();

  /** Emits when form validity changes */
  @Output() formValidityChange = new EventEmitter<boolean>();

  // ─────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────

  /** Reactive form group */
  form = new FormGroup({});

  /** Form model (data) */
  formModel: Record<string, unknown> = {};

  /** Formly options */
  formlyOptions = {
    formState: {
      mode: 'edit' as DynamicFormMode,
    },
  };

  // Signals for reactive state
  private _formlyFields = signal<FormlyFieldConfig[]>([]);
  private _isLoading = signal(false);
  private _isSubmitting = signal(false);
  private _error = signal<string | null>(null);
  private _formTitle = signal<string>('');
  private _formDescription = signal<string>('');

  // Computed signals
  formlyFields = computed(() => this._formlyFields());
  isLoading = computed(() => this._isLoading());
  isSubmitting = computed(() => this._isSubmitting());
  error = computed(() => this._error());

  title = computed(() => this.customTitle || this._formTitle() || this.entitySchema?.name || '');
  description = computed(() => this.customDescription || this._formDescription() || this.entitySchema?.description || '');

  // ─────────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.buildForm();
    this.setupFormSubscriptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entitySchema'] || changes['formViewSchema'] || changes['mode']) {
      this.buildForm();
    }
    if (changes['data']) {
      this.updateFormModel();
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Form Building
  // ─────────────────────────────────────────────────────────────────

  private buildForm(): void {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      let fields: FormlyFieldConfig[] = [];

      if (this.formViewSchema) {
        const result = this.formEngineRegistry.toFormly(this.formViewSchema);
        if (result.warnings.length > 0) {
          console.warn('[DynamicFormComponent] Conversion warnings:', result.warnings);
        }
        fields = (result.fields || []) as FormlyFieldConfig[];
        this._formTitle.set(this.formViewSchema.title || '');
        this._formDescription.set(this.formViewSchema.description || '');
      } else if (this.entitySchema) {
        const result = this.formEngineRegistry.generateFormlyConfig(
          this.entitySchema,
          this.mode as 'add' | 'edit' | 'detail' | 'clone'
        );
        if (result.warnings.length > 0) {
          console.warn('[DynamicFormComponent] Conversion warnings:', result.warnings);
        }
        fields = (result.fields || []) as FormlyFieldConfig[];
        this._formTitle.set(this.entitySchema.name || '');
        this._formDescription.set(this.entitySchema.description || '');
      } else {
        throw new Error('Either entitySchema or formViewSchema must be provided');
      }

      // Apply locked fields (disable + preset)
      fields = this.applyLockedFields(fields);

      this._formlyFields.set(fields);
      this.formlyOptions.formState.mode = this.mode;
      this.updateFormModel();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to build form';
      this._error.set(message);
      console.error('[DynamicFormComponent] Build error:', err);
    } finally {
      this._isLoading.set(false);
    }
  }

  private updateFormModel(): void {
    if (this.mode === 'add') {
      this.formModel = { ...this.getDefaultValues(), ...this.lockedFields };
    } else if (this.data) {
      this.formModel = { ...this.data, ...this.lockedFields };
    } else {
      this.formModel = { ...this.lockedFields };
    }
  }

  private getDefaultValues(): Record<string, unknown> {
    const defaults: Record<string, unknown> = {};
    if (this.entitySchema?.fields) {
      for (const field of this.entitySchema.fields) {
        if ((field as any).defaultValue !== undefined) {
          defaults[field.field] = (field as any).defaultValue;
        }
      }
    }
    return defaults;
  }

  /**
   * Apply locked field configuration to Formly fields
   */
  private applyLockedFields(fields: FormlyFieldConfig[]): FormlyFieldConfig[] {
    if (!this.lockedFields || Object.keys(this.lockedFields).length === 0) {
      return fields;
    }

    const lockedKeys = Object.keys(this.lockedFields);
    
    const processField = (field: FormlyFieldConfig): FormlyFieldConfig => {
      // Check if this field should be locked
      if (field.key && lockedKeys.includes(String(field.key))) {
        return {
          ...field,
          props: {
            ...field.props,
            disabled: true,
            readonly: true,
            // Add visual indicator that field is locked
            addonLeft: {
              icon: 'ri-lock-line',
            },
          },
          expressions: {
            ...field.expressions,
            'props.disabled': 'true',
          },
        };
      }
      
      // Process nested fields (for field groups)
      if (field.fieldGroup) {
        return {
          ...field,
          fieldGroup: field.fieldGroup.map(f => processField(f)),
        };
      }
      
      return field;
    };

    return fields.map(f => processField(f));
  }

  private setupFormSubscriptions(): void {
    this.form.valueChanges.subscribe(value => {
      this.formChange.emit(value as Record<string, unknown>);
    });
    this.form.statusChanges.subscribe(() => {
      this.formValidityChange.emit(this.form.valid);
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (!this.form.valid) {
      this.markFormAsTouched();
      return;
    }
    this._isSubmitting.set(true);
    const event: DynamicFormSubmitEvent = {
      mode: this.mode,
      data: { ...this.formModel },
      originalData: this.data ? { ...this.data } : undefined,
      isValid: this.form.valid,
    };
    this.formSubmit.emit(event);
    setTimeout(() => this._isSubmitting.set(false), 5000);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  onReset(): void {
    this.form.reset();
    this.updateFormModel();
  }

  private markFormAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────

  /** Get current form value */
  getValue(): Record<string, unknown> {
    return { ...this.formModel };
  }

  /** Check if form is valid */
  isValid(): boolean {
    return this.form.valid;
  }

  /** Mark form as submitting (call from parent) */
  setSubmitting(submitting: boolean): void {
    this._isSubmitting.set(submitting);
  }

  /** Reset form to initial state */
  reset(): void {
    this.onReset();
  }
}
