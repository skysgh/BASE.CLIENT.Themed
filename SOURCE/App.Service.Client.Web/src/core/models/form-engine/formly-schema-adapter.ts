/**
 * Formly Schema Adapter
 * 
 * Converts FormViewSchema to @ngx-formly configuration.
 * 
 * FORMLY CONCEPTS:
 * - FormlyFieldConfig: Individual field configuration
 * - props: Template options (label, placeholder, required, etc.)
 * - expressions: Dynamic expressions for hide, disabled, etc.
 * - validators: Sync validators
 * - asyncValidators: Async validators
 * - wrappers: Field wrappers (form-field, panel, etc.)
 * 
 * MAPPING:
 * FormFieldSchema.field      → FormlyFieldConfig.key
 * FormFieldSchema.type       → FormlyFieldConfig.type (mapped)
 * FormFieldSchema.label      → FormlyFieldConfig.props.label
 * FormFieldSchema.required   → FormlyFieldConfig.props.required
 * FormFieldSchema.visibleWhen → FormlyFieldConfig.expressions.hide (inverted)
 * FormFieldSchema.options    → FormlyFieldConfig.props.options
 * 
 * @see https://formly.dev/docs/guide/properties-options
 */

import { 
  FormSchemaAdapter, 
  FormConversionResult, 
  FieldConversionResult,
  FormlyFieldConfig,
  FormlyFormConfig 
} from './form-schema-adapter';
import { FormFieldSchema, FormFieldType, FormFieldGroup, FormFieldTab } from '../schema/form-field-schema.model';
import { FormViewSchema, FormLayout } from '../schema/form-view-schema.model';
import { FormEngineType, FormEngineCapabilities, FORMLY_ENGINE_CONFIG } from './form-engine.types';

// ═══════════════════════════════════════════════════════════════════
// Type Mapping
// ═══════════════════════════════════════════════════════════════════

/**
 * Map our FormFieldType to Formly type names
 * 
 * FORMLY BUILT-IN TYPES:
 * - input, textarea, select, radio, checkbox, multicheckbox
 * 
 * FORMLY BOOTSTRAP TYPES (if using @ngx-formly/bootstrap):
 * - Adds styling wrappers
 * 
 * CUSTOM TYPES (must be registered):
 * - datepicker, richtext, file, etc.
 */
const FORMLY_TYPE_MAP: Record<FormFieldType, string> = {
  // Text inputs -> 'input' with inputType prop
  text: 'input',
  textarea: 'textarea',
  richtext: 'richtext',  // Custom type
  password: 'input',
  email: 'input',
  url: 'input',
  phone: 'input',
  
  // Numbers -> 'input' with type='number'
  number: 'input',
  currency: 'currency',  // Custom type
  percentage: 'input',
  
  // Selection
  select: 'select',
  multiselect: 'select',  // With multiple=true
  radio: 'radio',
  checkbox: 'checkbox',
  toggle: 'toggle',  // Custom type or checkbox with toggle class
  
  // Date/Time -> Custom types
  date: 'datepicker',
  datetime: 'datetimepicker',
  time: 'timepicker',
  daterange: 'daterangepicker',
  
  // Special -> Custom types
  file: 'file',
  image: 'image',
  color: 'colorpicker',
  rating: 'rating',
  slider: 'slider',
  
  // Readonly display -> Custom types
  label: 'label',
  link: 'link',
  badge: 'badge',
  
  // Layout -> Wrappers or custom types
  divider: 'divider',
  heading: 'heading',
  spacer: 'spacer',
  
  // Custom
  custom: 'custom',
};

/**
 * Input type attribute for 'input' fields
 */
const INPUT_TYPE_MAP: Partial<Record<FormFieldType, string>> = {
  text: 'text',
  password: 'password',
  email: 'email',
  url: 'url',
  phone: 'tel',
  number: 'number',
  percentage: 'number',
};

// ═══════════════════════════════════════════════════════════════════
// Formly Schema Adapter
// ═══════════════════════════════════════════════════════════════════

export class FormlySchemaAdapter extends FormSchemaAdapter<
  FormlyFormConfig,
  FormlyFieldConfig,
  Record<string, unknown>
> {
  // ─────────────────────────────────────────────────────────────────
  // Identity
  // ─────────────────────────────────────────────────────────────────
  
  readonly engineType: FormEngineType = 'formly';
  readonly adapterVersion: string = '1.0.0';
  readonly capabilities: FormEngineCapabilities = FORMLY_ENGINE_CONFIG.capabilities;
  
  // ─────────────────────────────────────────────────────────────────
  // Main Conversion
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Convert entire form schema to Formly config
   */
  convertForm(schema: FormViewSchema): FormConversionResult<FormlyFormConfig, FormlyFieldConfig> {
    const warnings: string[] = [];
    const unsupportedFeatures: string[] = [];
    const fields: FormlyFieldConfig[] = [];
    
    // Convert each field
    for (const fieldSchema of schema.fields) {
      const result = this.convertField(fieldSchema);
      fields.push(result.field);
      warnings.push(...result.warnings);
    }
    
    // Handle tabs
    let finalFields = fields;
    if (schema.tabs?.length) {
      const tabConfig = this.convertTabs(schema.tabs, fields, schema.fields);
      finalFields = [tabConfig];
    } 
    // Handle groups (if no tabs)
    else if (schema.groups?.length) {
      finalFields = this.convertGroups(schema.groups, fields, schema.fields);
    }
    
    // Build form config
    const formConfig: FormlyFormConfig = {
      fields: finalFields,
      options: {
        formState: {
          // Can add form-level state here
        },
      },
    };
    
    return {
      form: formConfig,
      fields,
      warnings,
      unsupportedFeatures,
      sourceSchema: schema,
    };
  }
  
  /**
   * Convert a single field to Formly config
   */
  convertField(field: FormFieldSchema): FieldConversionResult<FormlyFieldConfig> {
    const warnings: string[] = [];
    let fullyConverted = true;
    
    // Base config
    const formlyField: FormlyFieldConfig = {
      key: field.field,
      type: this.mapFieldType(field.type),
    };
    
    // Props (template options)
    formlyField.props = this.buildProps(field, warnings);
    
    // Validation
    const validation = this.convertValidation(field);
    if (Object.keys(validation).length > 0) {
      formlyField.validation = validation;
    }
    
    // Expressions (conditional logic)
    const expressions = this.buildExpressions(field);
    if (Object.keys(expressions).length > 0) {
      formlyField.expressions = expressions;
    }
    
    // Hide expression
    if (field.visibleWhen) {
      formlyField.expressions = formlyField.expressions || {};
      const visibleExpr = typeof field.visibleWhen === 'string' 
        ? field.visibleWhen 
        : field.visibleWhen.expression;
      // Formly uses 'hide', so invert the visible condition
      formlyField.expressions['hide'] = `!(${visibleExpr})`;
    }
    
    // Hidden field
    if (field.hidden) {
      formlyField.hide = true;
    }
    
    // Default value
    if (field.defaultValue !== undefined) {
      formlyField.defaultValue = field.defaultValue;
    }
    
    // Layout / CSS class
    if (field.layout?.wrapperClass) {
      formlyField.className = field.layout.wrapperClass;
    } else if (field.layout?.colSpan) {
      formlyField.className = `col-md-${field.layout.colSpan}`;
    }
    
    // Custom component
    if (field.type === 'custom' && field.customComponent) {
      formlyField.type = field.customComponent;
      if (field.customConfig) {
        formlyField.props = { ...formlyField.props, ...field.customConfig };
      }
    }
    
    return { field: formlyField, warnings, fullyConverted };
  }
  
  /**
   * Convert validation rules to Formly format
   */
  convertValidation(field: FormFieldSchema): Record<string, unknown> {
    const validation: Record<string, { message: string } | unknown> = {};
    
    // Messages object for validation messages
    const messages: Record<string, string> = {};
    
    if (field.required) {
      messages['required'] = `${field.label} is required`;
    }
    
    if (field.minLength) {
      messages['minLength'] = `${field.label} must be at least ${field.minLength} characters`;
    }
    
    if (field.maxLength) {
      messages['maxLength'] = `${field.label} cannot exceed ${field.maxLength} characters`;
    }
    
    if (field.min !== undefined) {
      messages['min'] = `${field.label} must be at least ${field.min}`;
    }
    
    if (field.max !== undefined) {
      messages['max'] = `${field.label} cannot exceed ${field.max}`;
    }
    
    if (field.pattern) {
      messages['pattern'] = `${field.label} format is invalid`;
    }
    
    // Add custom validation rules
    if (field.validations) {
      for (const rule of field.validations) {
        if (rule.message) {
          messages[rule.type] = rule.message;
        }
      }
    }
    
    if (Object.keys(messages).length > 0) {
      validation['messages'] = messages;
    }
    
    return validation;
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Groups and Tabs
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Convert groups to Formly fieldGroup
   */
  override convertGroups(
    groups: FormFieldGroup[], 
    convertedFields: FormlyFieldConfig[],
    sourceFields: FormFieldSchema[]
  ): FormlyFieldConfig[] {
    // Create a map for quick lookup
    const fieldMap = new Map<string, FormlyFieldConfig>();
    convertedFields.forEach((f, i) => {
      if (f.key) {
        fieldMap.set(f.key as string, f);
      }
    });
    
    const result: FormlyFieldConfig[] = [];
    const usedFields = new Set<string>();
    
    // Create group wrappers
    for (const group of groups) {
      const groupFields: FormlyFieldConfig[] = [];
      
      // Get fields for this group
      const fieldNames = group.fields || sourceFields
        .filter(f => f.group === group.id)
        .map(f => f.field);
      
      for (const fieldName of fieldNames) {
        const field = fieldMap.get(fieldName);
        if (field) {
          groupFields.push(field);
          usedFields.add(fieldName);
        }
      }
      
      if (groupFields.length > 0) {
        result.push({
          type: 'formly-group', // Custom wrapper or use fieldGroup
          props: {
            label: group.label,
            collapsible: group.collapsible,
            collapsed: group.collapsed,
            icon: group.icon,
          },
          fieldGroup: groupFields,
          className: group.layout?.className,
        });
      }
    }
    
    // Add ungrouped fields at the end
    for (const field of convertedFields) {
      if (field.key && !usedFields.has(field.key as string)) {
        result.push(field);
      }
    }
    
    return result;
  }
  
  /**
   * Convert tabs to Formly tabs wrapper
   */
  override convertTabs(
    tabs: FormFieldTab[],
    convertedFields: FormlyFieldConfig[],
    sourceFields: FormFieldSchema[]
  ): FormlyFieldConfig {
    const fieldMap = new Map<string, FormlyFieldConfig>();
    convertedFields.forEach((f) => {
      if (f.key) {
        fieldMap.set(f.key as string, f);
      }
    });
    
    const tabConfigs = tabs.map(tab => {
      // Get fields for this tab
      const fieldNames = tab.fields || sourceFields
        .filter(f => f.tab === tab.id)
        .map(f => f.field);
      
      const tabFields = fieldNames
        .map(name => fieldMap.get(name))
        .filter((f): f is FormlyFieldConfig => !!f);
      
      return {
        props: {
          label: tab.label,
          icon: tab.icon,
          badge: tab.badge,
          disabled: tab.disabled,
        },
        fieldGroup: tabFields,
      };
    });
    
    return {
      type: 'tabs', // Custom tabs type
      fieldGroup: tabConfigs,
    };
  }
  
  /**
   * Convert layout to Formly options
   */
  override convertLayout(layout: FormLayout): Record<string, unknown> {
    return {
      formClass: layout.formClass,
      labelWidth: layout.labelWidth,
      fieldWrapperClass: layout.fieldWrapperClass,
    };
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Type Mapping
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Map our field type to Formly type
   */
  mapFieldType(type: FormFieldType): string {
    return FORMLY_TYPE_MAP[type] || 'input';
  }
  
  /**
   * Get default field type
   */
  getDefaultFieldType(): string {
    return 'input';
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Private Helpers
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Build props object from field schema
   */
  private buildProps(field: FormFieldSchema, warnings: string[]): Record<string, unknown> {
    const props: Record<string, unknown> = {
      label: field.label,
    };
    
    // Input type for 'input' fields
    const inputType = INPUT_TYPE_MAP[field.type];
    if (inputType) {
      props['type'] = inputType;
    }
    
    // Basic props
    if (field.placeholder) props['placeholder'] = field.placeholder;
    if (field.required) props['required'] = true;
    if (field.disabled) props['disabled'] = true;
    if (field.readonly) props['readonly'] = true;
    if (field.helpText) props['description'] = field.helpText;
    if (field.tooltip) props['tooltip'] = field.tooltip;
    
    // Validation props
    if (field.minLength) props['minLength'] = field.minLength;
    if (field.maxLength) props['maxLength'] = field.maxLength;
    if (field.min !== undefined) props['min'] = field.min;
    if (field.max !== undefined) props['max'] = field.max;
    if (field.step) props['step'] = field.step;
    if (field.pattern) props['pattern'] = field.pattern;
    
    // Textarea
    if (field.rows) props['rows'] = field.rows;
    
    // Icon
    if (field.icon) {
      props['addonLeft'] = { icon: field.icon };
    }
    
    // Prefix/Suffix
    if (field.prefix) props['prefix'] = field.prefix;
    if (field.suffix) props['suffix'] = field.suffix;
    
    // Options for select/radio/checkbox
    if (field.options) {
      props['options'] = field.options.map(opt => ({
        value: opt.value,
        label: opt.label,
        disabled: opt.disabled,
      }));
    }
    
    // API-driven options
    if (field.optionsSource?.api) {
      // This needs to be handled by a service that populates options
      // Store the source config for the form component to use
      props['optionsSource'] = field.optionsSource;
    }
    
    // Multi-select
    if (field.type === 'multiselect') {
      props['multiple'] = true;
    }
    
    // File/Image
    if (field.accept) props['accept'] = field.accept;
    if (field.maxFileSize) props['maxFileSize'] = field.maxFileSize;
    if (field.showPreview) props['showPreview'] = field.showPreview;
    
    // Date format
    if (field.dateFormat) props['dateFormat'] = field.dateFormat;
    
    // Currency
    if (field.currency) props['currency'] = field.currency;
    
    // Rating
    if (field.maxRating) props['max'] = field.maxRating;
    
    // Slider
    if (field.showValue) props['showValue'] = field.showValue;
    
    return props;
  }
  
  /**
   * Build expressions object from field schema
   */
  private buildExpressions(field: FormFieldSchema): Record<string, unknown> {
    const expressions: Record<string, unknown> = {};
    
    // Enabled when
    if (field.enabledWhen) {
      const expr = typeof field.enabledWhen === 'string' 
        ? field.enabledWhen 
        : field.enabledWhen.expression;
      expressions['props.disabled'] = `!(${expr})`;
    }
    
    // Required when
    if (field.requiredWhen) {
      const expr = typeof field.requiredWhen === 'string' 
        ? field.requiredWhen 
        : field.requiredWhen.expression;
      expressions['props.required'] = expr;
    }
    
    return expressions;
  }
}

// ═══════════════════════════════════════════════════════════════════
// Singleton Instance
// ═══════════════════════════════════════════════════════════════════

/** Default Formly adapter instance */
export const formlyAdapter = new FormlySchemaAdapter();
