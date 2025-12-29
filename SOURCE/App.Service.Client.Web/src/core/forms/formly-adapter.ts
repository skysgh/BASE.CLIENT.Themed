/**
 * Formly Adapter
 * 
 * Converts engine-agnostic FormDefinition to Formly configuration.
 * This adapter allows forms to be defined once and rendered by Formly.
 */

import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormDefinition, FormFieldDefinition } from './form-definition.model';

/**
 * Convert FormDefinition to Formly fields
 * 
 * @param formDef - Engine-agnostic form definition
 * @param forceReadonly - Force all fields to use 'label' type (for Read view)
 * @returns Formly field configuration array
 */
export function toFormlyConfig(formDef: FormDefinition, forceReadonly: boolean = false): FormlyFieldConfig[] {
  // If view mode, use label types
  const isViewMode = forceReadonly || formDef.mode === 'view';
  
  return formDef.fields.map(field => convertField(field, isViewMode));
}

/**
 * Convert single field to Formly config
 */
function convertField(field: FormFieldDefinition, isViewMode: boolean = false): FormlyFieldConfig {
  const formlyType = isViewMode || field.readonly ? 'label' : mapFieldType(field.type);
  
  const fieldConfig: FormlyFieldConfig = {
    key: field.key,
    type: formlyType,
    props: {
      label: field.label,
      placeholder: field.placeholder,
      description: field.description,
      required: field.required,
      disabled: field.disabled,
      readonly: field.readonly || isViewMode,
      options: field.options,
      multiple: field.type === 'multiselect',
      displayAs: getDisplayAs(field),
      // Type-specific properties
      rows: field.rows || (field.type === 'textarea' ? 3 : undefined),
      step: field.step,
      min: field.validation?.min,
      max: field.validation?.max,
    },
    defaultValue: field.defaultValue,
    hide: field.type === 'hidden',
    className: field.className,
  };

  // Add type attribute for date/number inputs
  if (!isViewMode && !field.readonly) {
    if (field.type === 'date') {
      fieldConfig.props!['type'] = 'date';
    } else if (field.type === 'datetime') {
      fieldConfig.props!['type'] = 'datetime-local';
    } else if (field.type === 'time') {
      fieldConfig.props!['type'] = 'time';
    } else if (field.type === 'number') {
      fieldConfig.props!['type'] = 'number';
    } else if (field.type === 'email') {
      fieldConfig.props!['type'] = 'email';
    } else if (field.type === 'password') {
      fieldConfig.props!['type'] = 'password';
    }
  }

  // Add validators
  if (field.validation) {
    if (field.validation.minLength) {
      fieldConfig.props!['minLength'] = field.validation.minLength;
    }
    if (field.validation.maxLength) {
      fieldConfig.props!['maxLength'] = field.validation.maxLength;
    }
    if (field.validation.pattern) {
      fieldConfig.props!['pattern'] = field.validation.pattern;
    }
    
    // Add validation messages
    if (field.validation.messages) {
      fieldConfig.validation = {
        messages: field.validation.messages
      };
    }
  }

  // Add expressions for conditional visibility
  if (field.expressions) {
    fieldConfig.expressions = field.expressions;
  }

  return fieldConfig;
}

/**
 * Map abstract field type to Formly type
 */
function mapFieldType(type: FormFieldDefinition['type']): string {
  switch (type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'date':
    case 'datetime':
    case 'time':
      return 'input';
    case 'textarea':
      return 'textarea';
    case 'select':
    case 'multiselect':
      return 'select';
    case 'checkbox':
    case 'toggle':
      return 'checkbox';
    case 'radio':
      return 'radio';
    case 'hidden':
      return 'input';
    case 'file':
      return 'input';
    default:
      return 'input';
  }
}

/**
 * Get display style hint for label type
 */
function getDisplayAs(field: FormFieldDefinition): string | undefined {
  if (field.key.includes('status')) return 'badge';
  if (field.key.includes('priority')) return 'badge';
  if (field.type === 'multiselect') return 'tags';
  if (field.type === 'date') return 'date';
  return undefined;
}

/**
 * Create initial model from form definition
 */
export function createFormlyModel(formDef: FormDefinition): Record<string, any> {
  const model: Record<string, any> = {};
  
  for (const field of formDef.fields) {
    if (field.defaultValue !== undefined) {
      model[field.key] = field.defaultValue;
    }
  }
  
  return model;
}

/**
 * Convert Formly fields to view mode (labels instead of inputs)
 */
export function toViewModeConfig(fields: FormlyFieldConfig[]): FormlyFieldConfig[] {
  return fields.map(field => ({
    ...field,
    type: 'label',
    props: {
      ...field.props,
      readonly: true,
    },
  }));
}
