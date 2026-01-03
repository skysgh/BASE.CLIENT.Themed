/**
 * Form Schema Adapter
 * 
 * Base class for converting FormViewSchema to engine-specific configs.
 * Each form engine (Formly, JSON Forms, etc.) has its own adapter.
 * 
 * DESIGN PATTERN:
 * - Strategy pattern: each adapter is a strategy for rendering forms
 * - Factory pattern: registry creates adapters by engine type
 * 
 * RESPONSIBILITIES:
 * 1. Convert FormFieldSchema → Engine-specific field config
 * 2. Convert FormViewSchema → Engine-specific form config
 * 3. Map validation rules to engine format
 * 4. Map conditional logic to engine format
 * 
 * USAGE:
 * ```typescript
 * const adapter = formEngineRegistry.getAdapter('formly');
 * const formlyConfig = adapter.convertForm(formViewSchema);
 * ```
 */

import { FormFieldSchema, FormFieldType, FormFieldGroup, FormFieldTab } from '../schema/form-field-schema.model';
import { FormViewSchema, FormAction, FormLayout } from '../schema/form-view-schema.model';
import { FormEngineType, FormEngineConfig, FormEngineCapabilities } from './form-engine.types';

// ═══════════════════════════════════════════════════════════════════
// Conversion Result Types
// ═══════════════════════════════════════════════════════════════════

/**
 * Result of form conversion
 */
export interface FormConversionResult<TFormConfig, TFieldConfig> {
  /** Converted form configuration */
  form: TFormConfig;
  
  /** Converted field configurations */
  fields: TFieldConfig[];
  
  /** Warnings during conversion */
  warnings: string[];
  
  /** Features that couldn't be converted */
  unsupportedFeatures: string[];
  
  /** Original schema reference */
  sourceSchema: FormViewSchema;
}

/**
 * Result of field conversion
 */
export interface FieldConversionResult<TFieldConfig> {
  /** Converted field configuration */
  field: TFieldConfig;
  
  /** Warnings during conversion */
  warnings: string[];
  
  /** Whether field was fully converted */
  fullyConverted: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// Abstract Base Adapter
// ═══════════════════════════════════════════════════════════════════

/**
 * Abstract base class for form schema adapters
 * 
 * TFormConfig: Engine's form configuration type
 * TFieldConfig: Engine's field configuration type
 * TValidation: Engine's validation configuration type
 */
export abstract class FormSchemaAdapter<
  TFormConfig = unknown,
  TFieldConfig = unknown,
  TValidation = unknown
> {
  // ─────────────────────────────────────────────────────────────────
  // Identity
  // ─────────────────────────────────────────────────────────────────
  
  /** Engine type this adapter handles */
  abstract readonly engineType: FormEngineType;
  
  /** Adapter version */
  abstract readonly adapterVersion: string;
  
  /** Engine capabilities */
  abstract readonly capabilities: FormEngineCapabilities;
  
  // ─────────────────────────────────────────────────────────────────
  // Main Conversion Methods
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Convert entire form schema to engine config
   */
  abstract convertForm(schema: FormViewSchema): FormConversionResult<TFormConfig, TFieldConfig>;
  
  /**
   * Convert a single field to engine config
   */
  abstract convertField(field: FormFieldSchema): FieldConversionResult<TFieldConfig>;
  
  /**
   * Convert validation rules to engine format
   */
  abstract convertValidation(field: FormFieldSchema): TValidation;
  
  // ─────────────────────────────────────────────────────────────────
  // Optional Conversion Methods (override if engine supports)
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Convert field groups to engine format
   */
  convertGroups?(
    groups: FormFieldGroup[], 
    convertedFields: TFieldConfig[],
    sourceFields: FormFieldSchema[]
  ): unknown;
  
  /**
   * Convert tabs to engine format
   */
  convertTabs?(
    tabs: FormFieldTab[],
    convertedFields: TFieldConfig[],
    sourceFields: FormFieldSchema[]
  ): unknown;
  
  /**
   * Convert actions to engine format (if engine handles actions)
   */
  convertActions?(actions: FormAction[]): unknown;
  
  /**
   * Convert layout to engine format
   */
  convertLayout?(layout: FormLayout): unknown;
  
  // ─────────────────────────────────────────────────────────────────
  // Type Mapping
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Map FormFieldType to engine-specific type
   */
  abstract mapFieldType(type: FormFieldType): string;
  
  /**
   * Get default field type for engine
   */
  abstract getDefaultFieldType(): string;
  
  // ─────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Check if a feature is supported
   */
  supports(capability: keyof FormEngineCapabilities): boolean {
    return this.capabilities[capability] ?? false;
  }
  
  /**
   * Create a warning message
   */
  protected warn(message: string): string {
    return `[${this.engineType}] ${message}`;
  }
}

// ═══════════════════════════════════════════════════════════════════
// Type Aliases for Common Engines
// ═══════════════════════════════════════════════════════════════════

/**
 * Formly-specific types (for reference)
 */
export interface FormlyFieldConfig {
  key?: string;
  type?: string;
  className?: string;
  templateOptions?: Record<string, unknown>;
  props?: Record<string, unknown>;
  validation?: Record<string, unknown>;
  validators?: Record<string, unknown>;
  asyncValidators?: Record<string, unknown>;
  expressions?: Record<string, unknown>;
  hide?: boolean;
  hideExpression?: string | (() => boolean);
  fieldGroup?: FormlyFieldConfig[];
  fieldArray?: FormlyFieldConfig;
  wrappers?: string[];
  defaultValue?: unknown;
  [key: string]: unknown;
}

export interface FormlyFormConfig {
  fields: FormlyFieldConfig[];
  model?: Record<string, unknown>;
  form?: unknown;
  options?: Record<string, unknown>;
}

/**
 * JSON Forms types (for reference)
 */
export interface JsonFormsSchema {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  [key: string]: unknown;
}

export interface JsonFormsUiSchema {
  type: string;
  elements?: JsonFormsUiSchema[];
  scope?: string;
  label?: string;
  [key: string]: unknown;
}
