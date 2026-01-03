/**
 * FormFieldSchema Model
 * 
 * Defines a field for form rendering (edit/add/detail views).
 * Supports:
 * - Multiple input types
 * - Validation rules
 * - Conditional visibility
 * - Dynamic options via OptionsSource DSL
 * - Layout hints
 * 
 * USAGE:
 * ```json
 * {
 *   "field": "title",
 *   "type": "text",
 *   "label": "Title",
 *   "required": true,
 *   "maxLength": 200,
 *   "placeholder": "Enter a descriptive title"
 * }
 * ```
 */

import { OptionsSource, FieldOption } from './options-source.model';

// ═══════════════════════════════════════════════════════════════════
// Field Types
// ═══════════════════════════════════════════════════════════════════

/**
 * Available form field types
 */
export type FormFieldType =
  // Text inputs
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'password'
  | 'email'
  | 'url'
  | 'phone'
  // Numbers
  | 'number'
  | 'currency'
  | 'percentage'
  // Selection
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'toggle'
  // Date/Time
  | 'date'
  | 'datetime'
  | 'time'
  | 'daterange'
  // Special
  | 'file'
  | 'image'
  | 'color'
  | 'rating'
  | 'slider'
  // Readonly display
  | 'label'
  | 'link'
  | 'badge'
  // Layout
  | 'divider'
  | 'heading'
  | 'spacer'
  // Custom
  | 'custom';

// ═══════════════════════════════════════════════════════════════════
// Validation Rules
// ═══════════════════════════════════════════════════════════════════

/**
 * Validation rule definition
 */
export interface ValidationRule {
  /** Rule type */
  type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'custom';
  
  /** Rule value (for minLength, maxLength, min, max, pattern) */
  value?: string | number;
  
  /** Error message to show when validation fails */
  message?: string;
  
  /** i18n key for error message */
  messageKey?: string;
  
  /** For custom validation: resolver name */
  resolver?: string;
}

// ═══════════════════════════════════════════════════════════════════
// Conditional Logic
// ═══════════════════════════════════════════════════════════════════

/**
 * Condition for visibility/enabled state
 * 
 * Expression format:
 * - "fieldName == 'value'"
 * - "fieldName != null"
 * - "fieldName > 10"
 * - "fieldName in ['a', 'b', 'c']"
 * - "fieldName.length > 0"
 */
export interface FieldCondition {
  /** Expression to evaluate */
  expression: string;
  
  /** Fields this condition depends on (for reactivity) */
  dependsOn?: string[];
}

// ═══════════════════════════════════════════════════════════════════
// Layout Hints
// ═══════════════════════════════════════════════════════════════════

/**
 * Layout configuration for the field
 */
export interface FieldLayout {
  /** Grid column span (1-12, Bootstrap grid) */
  colSpan?: number;
  
  /** Responsive column spans */
  colSpanSm?: number;
  colSpanMd?: number;
  colSpanLg?: number;
  
  /** Start a new row before this field */
  newRow?: boolean;
  
  /** CSS class for field wrapper */
  wrapperClass?: string;
  
  /** CSS class for input element */
  inputClass?: string;
  
  /** Field order (for sorting) */
  order?: number;
}

// ═══════════════════════════════════════════════════════════════════
// Form Field Schema
// ═══════════════════════════════════════════════════════════════════

/**
 * Complete field definition for forms
 */
export interface FormFieldSchema {
  // ─────────────────────────────────────────────────────────────────
  // Identity
  // ─────────────────────────────────────────────────────────────────
  
  /** Field name (maps to model property) */
  field: string;
  
  /** Field type (determines input control) */
  type: FormFieldType;
  
  // ─────────────────────────────────────────────────────────────────
  // Display
  // ─────────────────────────────────────────────────────────────────
  
  /** Display label */
  label: string;
  
  /** i18n key for label */
  labelKey?: string;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** i18n key for placeholder */
  placeholderKey?: string;
  
  /** Help text shown below field */
  helpText?: string;
  
  /** i18n key for help text */
  helpTextKey?: string;
  
  /** Tooltip text */
  tooltip?: string;
  
  /** Icon class (shown in input or label) */
  icon?: string;
  
  /** Icon position */
  iconPosition?: 'left' | 'right' | 'label';
  
  /** Prefix text (e.g., "$" for currency) */
  prefix?: string;
  
  /** Suffix text (e.g., "kg" for weight) */
  suffix?: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────────────────────────────
  
  /** Field is required */
  required?: boolean;
  
  /** Minimum length (for text) */
  minLength?: number;
  
  /** Maximum length (for text) */
  maxLength?: number;
  
  /** Minimum value (for numbers) */
  min?: number;
  
  /** Maximum value (for numbers) */
  max?: number;
  
  /** Step increment (for numbers) */
  step?: number;
  
  /** Regex pattern for validation */
  pattern?: string;
  
  /** Additional validation rules */
  validations?: ValidationRule[];
  
  // ─────────────────────────────────────────────────────────────────
  // Options (for select, multiselect, radio, checkbox)
  // ─────────────────────────────────────────────────────────────────
  
  /** 
   * Options source (static or dynamic)
   * Uses OptionsSource DSL for API-driven options
   */
  optionsSource?: OptionsSource;
  
  /** 
   * Convenience: inline static options
   * Equivalent to optionsSource.options
   */
  options?: FieldOption[];
  
  // ─────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────
  
  /** Default value for new records */
  defaultValue?: unknown;
  
  /** Field is read-only */
  readonly?: boolean;
  
  /** Field is disabled */
  disabled?: boolean;
  
  /** Field is hidden (but value still submitted) */
  hidden?: boolean;
  
  /** Condition for visibility */
  visibleWhen?: FieldCondition | string;
  
  /** Condition for enabled state */
  enabledWhen?: FieldCondition | string;
  
  /** Condition for required state */
  requiredWhen?: FieldCondition | string;
  
  // ─────────────────────────────────────────────────────────────────
  // Layout
  // ─────────────────────────────────────────────────────────────────
  
  /** Layout configuration */
  layout?: FieldLayout;
  
  /** Group this field belongs to */
  group?: string;
  
  /** Tab this field appears on */
  tab?: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Type-Specific Config
  // ─────────────────────────────────────────────────────────────────
  
  /** For textarea: number of rows */
  rows?: number;
  
  /** For file/image: accepted mime types */
  accept?: string;
  
  /** For file/image: max file size in bytes */
  maxFileSize?: number;
  
  /** For image: show preview */
  showPreview?: boolean;
  
  /** For rating: max stars */
  maxRating?: number;
  
  /** For slider: show value label */
  showValue?: boolean;
  
  /** For date/datetime: date format */
  dateFormat?: string;
  
  /** For currency: currency code */
  currency?: string;
  
  /** For custom: component name */
  customComponent?: string;
  
  /** For custom: component config */
  customConfig?: Record<string, unknown>;
  
  // ─────────────────────────────────────────────────────────────────
  // Metadata
  // ─────────────────────────────────────────────────────────────────
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════
// Field Group
// ═══════════════════════════════════════════════════════════════════

/**
 * Group of related fields
 */
export interface FormFieldGroup {
  /** Group ID */
  id: string;
  
  /** Group label */
  label?: string;
  
  /** i18n key for label */
  labelKey?: string;
  
  /** Group description */
  description?: string;
  
  /** Icon for group header */
  icon?: string;
  
  /** Whether group is collapsible */
  collapsible?: boolean;
  
  /** Whether group is initially collapsed */
  collapsed?: boolean;
  
  /** Fields in this group (by field name) */
  fields?: string[];
  
  /** Layout for this group */
  layout?: {
    /** Number of columns */
    columns?: number;
    
    /** CSS class for group */
    className?: string;
  };
}

// ═══════════════════════════════════════════════════════════════════
// Field Tab
// ═══════════════════════════════════════════════════════════════════

/**
 * Tab containing fields
 */
export interface FormFieldTab {
  /** Tab ID */
  id: string;
  
  /** Tab label */
  label: string;
  
  /** i18n key for label */
  labelKey?: string;
  
  /** Tab icon */
  icon?: string;
  
  /** Badge count/text */
  badge?: string | number;
  
  /** Fields in this tab (by field name) */
  fields?: string[];
  
  /** Groups in this tab (by group ID) */
  groups?: string[];
  
  /** Whether tab is disabled */
  disabled?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════

/**
 * Check if field type is a selection type
 */
export function isSelectionField(type: FormFieldType): boolean {
  return ['select', 'multiselect', 'radio', 'checkbox'].includes(type);
}

/**
 * Check if field type is a text input type
 */
export function isTextInputField(type: FormFieldType): boolean {
  return ['text', 'textarea', 'richtext', 'password', 'email', 'url', 'phone'].includes(type);
}

/**
 * Check if field type is a numeric type
 */
export function isNumericField(type: FormFieldType): boolean {
  return ['number', 'currency', 'percentage', 'rating', 'slider'].includes(type);
}

/**
 * Check if field type is a date/time type
 */
export function isDateTimeField(type: FormFieldType): boolean {
  return ['date', 'datetime', 'time', 'daterange'].includes(type);
}

/**
 * Check if field type is a layout-only type (no value)
 */
export function isLayoutField(type: FormFieldType): boolean {
  return ['divider', 'heading', 'spacer'].includes(type);
}

/**
 * Check if field type is readonly display only
 */
export function isDisplayField(type: FormFieldType): boolean {
  return ['label', 'link', 'badge'].includes(type);
}

/**
 * Convert an editable field to readonly (for detail view)
 */
export function toReadonlyField(field: FormFieldSchema): FormFieldSchema {
  // Map editable types to display types
  const typeMap: Partial<Record<FormFieldType, FormFieldType>> = {
    text: 'label',
    textarea: 'label',
    richtext: 'label',
    password: 'label',
    email: 'label',
    url: 'link',
    phone: 'label',
    number: 'label',
    currency: 'label',
    percentage: 'label',
    select: 'label',
    multiselect: 'label',
    radio: 'label',
    checkbox: 'label',
    toggle: 'label',
    date: 'label',
    datetime: 'label',
    time: 'label',
    daterange: 'label',
    rating: 'rating', // Keep as rating (read-only display)
  };
  
  return {
    ...field,
    type: typeMap[field.type] || 'label',
    readonly: true,
    disabled: false,
    // Clear validation since it's readonly
    required: false,
    validations: undefined,
  };
}

/**
 * Create a simple text field
 */
export function createTextField(
  field: string,
  label: string,
  options?: Partial<FormFieldSchema>
): FormFieldSchema {
  return {
    field,
    type: 'text',
    label,
    ...options,
  };
}

/**
 * Create a select field with API options
 */
export function createSelectField(
  field: string,
  label: string,
  apiEndpoint: string,
  options?: Partial<FormFieldSchema>
): FormFieldSchema {
  return {
    field,
    type: 'select',
    label,
    optionsSource: {
      api: {
        endpoint: apiEndpoint,
        valueField: 'id',
        labelField: 'name',
      },
      includeEmpty: true,
    },
    ...options,
  };
}
