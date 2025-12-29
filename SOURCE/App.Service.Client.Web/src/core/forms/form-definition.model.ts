/**
 * Form Engine Abstraction
 * 
 * Provides a unified interface for form rendering that can be backed by
 * either Formly or JSON Forms. This allows comparison and easy switching.
 * 
 * ARCHITECTURE:
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    FormDefinition                           │
 * │  (Our normalized schema - engine agnostic)                  │
 * └────────────────────────┬────────────────────────────────────┘
 *                          │
 *         ┌────────────────┼────────────────┐
 *         ▼                                 ▼
 * ┌───────────────────┐           ┌───────────────────┐
 * │  FormlyAdapter    │           │  JsonFormsAdapter │
 * │  (Formly config)  │           │  (JSON Schema)    │
 * └───────────────────┘           └───────────────────┘
 *         │                                 │
 *         ▼                                 ▼
 * ┌───────────────────┐           ┌───────────────────┐
 * │  <formly-form>    │           │  <jsonforms>      │
 * └───────────────────┘           └───────────────────┘
 */

/**
 * Form Field Definition Model
 * 
 * Engine-agnostic field definition that works with both Formly and JSON Forms.
 */

/**
 * Form field type
 */
export type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'toggle'
  | 'radio'
  | 'date'
  | 'datetime'
  | 'time'
  | 'hidden'
  | 'file'
  | 'array'
  | 'object'
  | 'custom';

/**
 * Form mode
 */
export type FormMode = 'view' | 'edit' | 'add';

/**
 * Form engine type
 */
export type FormEngineType = 'formly' | 'jsonforms';

/**
 * Field validation configuration
 */
export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  messages?: Record<string, string>;
}

/**
 * Field option (for select, multiselect, radio)
 */
export interface FieldOption {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
}

/**
 * Form field definition
 */
export interface FormFieldDefinition {
  /** Unique field key (property name) */
  key: string;
  /** Field type */
  type: FormFieldType;
  /** Display label */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Help text/description */
  description?: string;
  /** Required field */
  required?: boolean;
  /** Readonly field */
  readonly?: boolean;
  /** Disabled field */
  disabled?: boolean;
  /** Default value */
  defaultValue?: any;
  /** Options (for select, multiselect, radio) */
  options?: FieldOption[];
  /** Options source (for dynamic loading) */
  optionsSource?: string;
  /** Validation rules */
  validation?: FieldValidation;
  /** Conditional expressions */
  expressions?: Record<string, any>;
  /** Hide expression */
  hideExpression?: string | boolean;
  /** CSS class */
  className?: string;
  /** Grid column span (for layout) */
  colSpan?: number;
  /** Nested fields for object type */
  fieldGroup?: FormFieldDefinition[];
  /** Array item definition for array type */
  fieldArray?: FormFieldDefinition;
  
  // ─────────────────────────────────────────────────────────────
  // TYPE-SPECIFIC PROPERTIES
  // ─────────────────────────────────────────────────────────────
  
  /** Rows for textarea (default: 3) */
  rows?: number;
  /** Step for number inputs */
  step?: number;
  /** Min date for date inputs */
  minDate?: string;
  /** Max date for date inputs */
  maxDate?: string;
  /** Accept types for file inputs */
  accept?: string;
}

/**
 * Form section (for layout)
 */
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fieldKeys: string[];
  collapsed?: boolean;
}

/**
 * Form layout configuration
 */
export interface FormLayout {
  columns?: number;
  sections?: FormSection[];
}

/**
 * Complete form definition
 */
export interface FormDefinition {
  /** Unique form ID */
  id: string;
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Form mode */
  mode: FormMode;
  /** Field definitions */
  fields: FormFieldDefinition[];
  /** Form-level validation */
  validation?: FormValidation;
  /** Layout configuration */
  layout?: FormLayout;
}

/**
 * Form-level validation
 */
export interface FormValidation {
  /** Cross-field validation rules */
  rules?: FormValidationRule[];
}

/**
 * Cross-field validation rule
 */
export interface FormValidationRule {
  name: string;
  expression: string;
  message: string;
}

/**
 * Form engine configuration
 */
export interface FormEngineConfig {
  /** Preferred engine */
  engine: FormEngineType;
  /** Fallback engine if preferred not available */
  fallback?: FormEngineType;
}

/**
 * Default form engine config
 */
export const DEFAULT_FORM_ENGINE_CONFIG: FormEngineConfig = {
  engine: 'formly',
  fallback: 'jsonforms'
};
