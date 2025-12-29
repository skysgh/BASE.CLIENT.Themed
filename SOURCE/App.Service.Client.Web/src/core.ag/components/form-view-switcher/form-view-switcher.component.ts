import { Component, Input, Output, EventEmitter, TemplateRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormDefinition } from '../../../core/forms/form-definition.model';
import { toFormlyConfig, createFormlyModel } from '../../../core/forms/formly-adapter';
import { ViewPreferenceService } from '../../../core/views/view-preference.service';
import { ViewAction, EditRendererType, ReadRendererType } from '../../../core/views/view-renderer.model';

/**
 * Form View Switcher Component
 * 
 * Allows switching between Formly-generated forms and custom templates.
 * Supports both Read (labels) and Edit (inputs) modes.
 * 
 * Usage:
 * ```html
 * <app-form-view-switcher
 *   [entityType]="'spike'"
 *   [action]="'edit'"
 *   [formDefinition]="formDef"
 *   [model]="data"
 *   [customTemplate]="customFormTemplate"
 *   (save)="onSave($event)">
 * </app-form-view-switcher>
 * 
 * <ng-template #customFormTemplate let-model="model">
 *   <!-- Custom hand-crafted form -->
 * </ng-template>
 * ```
 */
@Component({
  selector: 'app-form-view-switcher',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormlyBootstrapModule],
  templateUrl: './form-view-switcher.component.html',
  styleUrls: ['./form-view-switcher.component.scss']
})
export class FormViewSwitcherComponent implements OnInit, OnChanges {
  /** Entity type (e.g., 'spike') */
  @Input() entityType: string = '';
  
  /** Action: 'read', 'edit', 'add' */
  @Input() action: ViewAction = 'edit';
  
  /** Form definition (schema) */
  @Input() formDefinition?: FormDefinition;
  
  /** Data model */
  @Input() model: any = {};
  
  /** Custom template for non-Formly rendering */
  @Input() customTemplate?: TemplateRef<any>;
  
  /** Custom read template */
  @Input() customReadTemplate?: TemplateRef<any>;
  
  /** Show renderer toggle UI */
  @Input() showToggle: boolean = true;
  
  /** Allow user to change renderer */
  @Input() allowChange: boolean = true;
  
  /** Form submitted */
  @Output() save = new EventEmitter<any>();
  
  /** Form cancelled */
  @Output() cancel = new EventEmitter<void>();
  
  /** Renderer changed */
  @Output() rendererChanged = new EventEmitter<string>();

  // Internal state
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  currentRenderer: string = '';
  
  // Available renderers for current action
  availableRenderers: { id: string; name: string; icon: string }[] = [];

  constructor(private viewPrefService: ViewPreferenceService) {}

  ngOnInit(): void {
    this.initializeRenderer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formDefinition'] || changes['action'] || changes['entityType']) {
      this.initializeRenderer();
    }
  }

  private initializeRenderer(): void {
    // Get available renderers for this action
    this.availableRenderers = this.viewPrefService
      .getAvailableRenderers(this.action)
      .map(r => ({ id: r.id, name: r.name, icon: r.icon }));
    
    // Get preferred renderer
    const preferred = this.viewPrefService.getPreferredRenderer(this.entityType, this.action);
    this.currentRenderer = preferred.id;
    
    // Generate Formly fields if using Formly
    if (this.formDefinition && this.isFormlyRenderer) {
      const forceReadonly = this.action === 'read';
      this.fields = toFormlyConfig(this.formDefinition, forceReadonly);
    }
  }

  /**
   * Check if current renderer is Formly-based
   */
  get isFormlyRenderer(): boolean {
    return this.currentRenderer.includes('formly') || 
           this.currentRenderer === 'edit-formly' ||
           this.currentRenderer === 'read-formly-labels';
  }

  /**
   * Check if current renderer is custom template
   */
  get isCustomRenderer(): boolean {
    return this.currentRenderer.includes('custom');
  }

  /**
   * Check if in read mode
   */
  get isReadMode(): boolean {
    return this.action === 'read';
  }

  /**
   * Check if custom template is available
   */
  get hasCustomTemplate(): boolean {
    return this.isReadMode ? !!this.customReadTemplate : !!this.customTemplate;
  }

  /**
   * Get the appropriate custom template
   */
  get activeCustomTemplate(): TemplateRef<any> | undefined {
    return this.isReadMode ? this.customReadTemplate : this.customTemplate;
  }

  /**
   * Switch renderer
   */
  switchRenderer(rendererId: string): void {
    if (!this.allowChange) return;
    
    this.currentRenderer = rendererId;
    this.viewPrefService.setPreference(this.entityType, this.action, rendererId);
    
    // Regenerate fields if switching to Formly
    if (this.isFormlyRenderer && this.formDefinition) {
      const forceReadonly = this.action === 'read';
      this.fields = toFormlyConfig(this.formDefinition, forceReadonly);
    }
    
    this.rendererChanged.emit(rendererId);
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.model);
    }
  }

  /**
   * Cancel form
   */
  onCancel(): void {
    this.cancel.emit();
  }
}
