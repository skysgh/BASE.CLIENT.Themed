/**
 * JSON Forms Adapter
 * 
 * Converts our engine-agnostic FormDefinition to JSON Schema + UI Schema
 * for use with @jsonforms/core.
 */

import { FormDefinition, FormFieldDefinition, FormFieldType } from './form-definition.model';

/**
 * JSON Schema types
 */
interface JsonSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean';
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  enum?: any[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  default?: any;
  title?: string;
  description?: string;
}

/**
 * JSON Forms UI Schema
 */
interface UISchemaElement {
  type: string;
  scope?: string;
  label?: string | boolean;
  options?: Record<string, any>;
  elements?: UISchemaElement[];
  rule?: {
    effect: 'SHOW' | 'HIDE' | 'ENABLE' | 'DISABLE';
    condition: {
      scope: string;
      schema: Record<string, any>;
    };
  };
}

/**
 * Map our field type to JSON Schema type
 */
function toJsonSchemaType(fieldType: FormFieldType): JsonSchema['type'] {
  switch (fieldType) {
    case 'number':
      return 'number';
    case 'checkbox':
    case 'toggle':
      return 'boolean';
    case 'array':
      return 'array';
    case 'object':
      return 'object';
    default:
      return 'string';
  }
}

/**
 * Convert FormFieldDefinition to JSON Schema property
 */
function toJsonSchemaProperty(field: FormFieldDefinition): JsonSchema {
  const schema: JsonSchema = {
    type: toJsonSchemaType(field.type),
    title: field.label,
    description: field.description,
    default: field.defaultValue
  };

  // Handle format
  if (field.type === 'email') {
    schema.format = 'email';
  } else if (field.type === 'date') {
    schema.format = 'date';
  } else if (field.type === 'datetime') {
    schema.format = 'date-time';
  }

  // Handle enum (select/radio options)
  if (field.options && (field.type === 'select' || field.type === 'radio')) {
    schema.enum = field.options.map(opt => opt.value);
  }

  // Handle validation
  if (field.validation) {
    if (field.validation.minLength !== undefined) {
      schema.minLength = field.validation.minLength;
    }
    if (field.validation.maxLength !== undefined) {
      schema.maxLength = field.validation.maxLength;
    }
    if (field.validation.min !== undefined) {
      schema.minimum = field.validation.min;
    }
    if (field.validation.max !== undefined) {
      schema.maximum = field.validation.max;
    }
    if (field.validation.pattern) {
      schema.pattern = field.validation.pattern;
    }
  }

  // Handle nested object
  if (field.type === 'object' && field.fieldGroup) {
    schema.properties = {};
    const required: string[] = [];
    
    for (const nestedField of field.fieldGroup) {
      schema.properties[nestedField.key] = toJsonSchemaProperty(nestedField);
      if (nestedField.required) {
        required.push(nestedField.key);
      }
    }
    
    if (required.length > 0) {
      schema.required = required;
    }
  }

  // Handle array
  if (field.type === 'array' && field.fieldArray) {
    schema.items = toJsonSchemaProperty(field.fieldArray);
  }

  return schema;
}

/**
 * Convert FormFieldDefinition to UI Schema element
 */
function toUISchemaElement(field: FormFieldDefinition): UISchemaElement {
  const element: UISchemaElement = {
    type: 'Control',
    scope: `#/properties/${field.key}`,
    label: field.label
  };

  // Handle specific UI types
  if (field.type === 'textarea') {
    element.options = { multi: true };
  } else if (field.type === 'radio') {
    element.options = { format: 'radio' };
  } else if (field.type === 'toggle') {
    element.options = { toggle: true };
  }

  // Handle readonly
  if (field.readonly) {
    element.options = { ...element.options, readonly: true };
  }

  // Handle hide expression (simplified)
  if (field.hideExpression) {
    // Note: JSON Forms uses a different condition syntax
    // This is a simplified mapping
    element.rule = {
      effect: 'HIDE',
      condition: {
        scope: '#', // Would need to parse expression
        schema: {}
      }
    };
  }

  return element;
}

/**
 * Convert FormDefinition to JSON Schema
 */
export function toJsonSchema(definition: FormDefinition): JsonSchema {
  const schema: JsonSchema = {
    type: 'object',
    properties: {},
    required: []
  };

  for (const field of definition.fields) {
    schema.properties![field.key] = toJsonSchemaProperty(field);
    if (field.required) {
      schema.required!.push(field.key);
    }
  }

  return schema;
}

/**
 * Convert FormDefinition to UI Schema
 */
export function toUISchema(definition: FormDefinition): UISchemaElement {
  // Check if we have sections
  if (definition.layout?.sections && definition.layout.sections.length > 0) {
    return {
      type: 'VerticalLayout',
      elements: definition.layout.sections.map(section => ({
        type: 'Group',
        label: section.title,
        elements: section.fieldKeys
          .map(key => definition.fields.find(f => f.key === key))
          .filter((f): f is FormFieldDefinition => f !== undefined)
          .map(toUISchemaElement)
      }))
    };
  }

  // No sections, flat layout
  return {
    type: 'VerticalLayout',
    elements: definition.fields.map(toUISchemaElement)
  };
}

/**
 * Convert FormDefinition to JSON Forms configuration
 */
export function toJsonFormsConfig(definition: FormDefinition): {
  schema: JsonSchema;
  uischema: UISchemaElement;
} {
  return {
    schema: toJsonSchema(definition),
    uischema: toUISchema(definition)
  };
}
