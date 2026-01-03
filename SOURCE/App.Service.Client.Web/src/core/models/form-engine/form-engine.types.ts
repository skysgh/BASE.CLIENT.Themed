/**
 * Form Engine Types
 * 
 * Abstracts form rendering engines so schemas can be rendered by different engines.
 * 
 * SUPPORTED ENGINES:
 * - formly: @ngx-formly - Current primary engine
 * - jsonforms: JSON Forms - Future alternative
 * - reactive: Hand-coded reactive forms (custom components)
 * - template: Template-driven forms (custom components)
 * 
 * ARCHITECTURE:
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                     FormViewSchema                              │
 * │                   (Engine-Agnostic)                             │
 * └───────────────────────────┬─────────────────────────────────────┘
 *                             │
 *                    FormSchemaAdapter
 *                             │
 *         ┌───────────────────┼───────────────────┐
 *         ↓                   ↓                   ↓
 *  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
 *  │   Formly    │    │  JSONForms  │    │   Custom    │
 *  │   Adapter   │    │   Adapter   │    │   Adapter   │
 *  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
 *         │                  │                  │
 *         ↓                  ↓                  ↓
 *  FormlyFieldConfig    JsonSchema       ReactiveForm
 * 
 * USAGE:
 * ```typescript
 * const adapter = formEngineRegistry.getAdapter('formly');
 * const formlyConfig = adapter.convert(formViewSchema);
 * ```
 */

// ═══════════════════════════════════════════════════════════════════
// Engine Types
// ═══════════════════════════════════════════════════════════════════

/**
 * Supported form engine types
 */
export type FormEngineType = 
  | 'formly'      // @ngx-formly - Dynamic forms
  | 'jsonforms'   // JSON Forms - JSON Schema based
  | 'reactive'    // Hand-coded reactive forms
  | 'template'    // Template-driven forms
  | 'custom';     // Custom implementation

/**
 * Form engine version (for migration support)
 */
export interface FormEngineVersion {
  engine: FormEngineType;
  version: string;  // Semver for the adapter, not the library
}

/**
 * Current default engine
 */
export const DEFAULT_FORM_ENGINE: FormEngineType = 'formly';

/**
 * Engine capability flags
 */
export interface FormEngineCapabilities {
  /** Supports dynamic field visibility */
  conditionalVisibility: boolean;
  
  /** Supports field validation */
  validation: boolean;
  
  /** Supports async validation */
  asyncValidation: boolean;
  
  /** Supports repeating/array fields */
  repeatableFields: boolean;
  
  /** Supports nested object fields */
  nestedFields: boolean;
  
  /** Supports custom field types */
  customTypes: boolean;
  
  /** Supports field expressions */
  expressions: boolean;
  
  /** Supports tabs layout */
  tabs: boolean;
  
  /** Supports groups/sections */
  groups: boolean;
  
  /** Supports grid layout */
  gridLayout: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// Engine Configuration
// ═══════════════════════════════════════════════════════════════════

/**
 * Configuration for a form engine
 */
export interface FormEngineConfig {
  /** Engine type */
  type: FormEngineType;
  
  /** Engine display name */
  name: string;
  
  /** Engine description */
  description?: string;
  
  /** Is this engine available (installed/configured)? */
  available: boolean;
  
  /** Engine capabilities */
  capabilities: FormEngineCapabilities;
  
  /** Engine-specific options */
  options?: Record<string, unknown>;
}

/**
 * Formly engine configuration
 */
export const FORMLY_ENGINE_CONFIG: FormEngineConfig = {
  type: 'formly',
  name: 'Formly',
  description: 'Dynamic forms powered by @ngx-formly',
  available: true,
  capabilities: {
    conditionalVisibility: true,
    validation: true,
    asyncValidation: true,
    repeatableFields: true,
    nestedFields: true,
    customTypes: true,
    expressions: true,
    tabs: true,
    groups: true,
    gridLayout: true,
  },
};

/**
 * JSON Forms engine configuration
 */
export const JSONFORMS_ENGINE_CONFIG: FormEngineConfig = {
  type: 'jsonforms',
  name: 'JSON Forms',
  description: 'Forms from JSON Schema',
  available: false, // Not yet implemented
  capabilities: {
    conditionalVisibility: true,
    validation: true,
    asyncValidation: false,
    repeatableFields: true,
    nestedFields: true,
    customTypes: true,
    expressions: false,
    tabs: true,
    groups: true,
    gridLayout: true,
  },
};

/**
 * Reactive forms engine configuration
 */
export const REACTIVE_ENGINE_CONFIG: FormEngineConfig = {
  type: 'reactive',
  name: 'Reactive Forms',
  description: 'Hand-coded Angular reactive forms',
  available: true,
  capabilities: {
    conditionalVisibility: true,
    validation: true,
    asyncValidation: true,
    repeatableFields: true,
    nestedFields: true,
    customTypes: true,
    expressions: true,
    tabs: true,
    groups: true,
    gridLayout: true,
  },
};

/**
 * All registered engine configurations
 */
export const FORM_ENGINE_CONFIGS: Record<FormEngineType, FormEngineConfig> = {
  formly: FORMLY_ENGINE_CONFIG,
  jsonforms: JSONFORMS_ENGINE_CONFIG,
  reactive: REACTIVE_ENGINE_CONFIG,
  template: {
    type: 'template',
    name: 'Template Forms',
    description: 'Template-driven forms',
    available: true,
    capabilities: {
      conditionalVisibility: false,
      validation: true,
      asyncValidation: false,
      repeatableFields: false,
      nestedFields: false,
      customTypes: true,
      expressions: false,
      tabs: false,
      groups: true,
      gridLayout: false,
    },
  },
  custom: {
    type: 'custom',
    name: 'Custom',
    description: 'Fully custom form implementation',
    available: true,
    capabilities: {
      conditionalVisibility: true,
      validation: true,
      asyncValidation: true,
      repeatableFields: true,
      nestedFields: true,
      customTypes: true,
      expressions: true,
      tabs: true,
      groups: true,
      gridLayout: true,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// Engine Selection
// ═══════════════════════════════════════════════════════════════════

/**
 * Get available engines
 */
export function getAvailableEngines(): FormEngineConfig[] {
  return Object.values(FORM_ENGINE_CONFIGS).filter(e => e.available);
}

/**
 * Get engine config by type
 */
export function getEngineConfig(type: FormEngineType): FormEngineConfig | undefined {
  return FORM_ENGINE_CONFIGS[type];
}

/**
 * Check if engine supports a capability
 */
export function engineSupports(
  engine: FormEngineType, 
  capability: keyof FormEngineCapabilities
): boolean {
  const config = FORM_ENGINE_CONFIGS[engine];
  return config?.capabilities[capability] ?? false;
}

// ═══════════════════════════════════════════════════════════════════
// Form Specification (what engine to use)
// ═══════════════════════════════════════════════════════════════════

/**
 * Specification for which form engine to use
 * Embedded in FormViewSchema
 */
export interface FormEngineSpec {
  /** Engine type */
  engine: FormEngineType;
  
  /** Adapter version (for migration) */
  adapterVersion?: string;
  
  /** Engine-specific config */
  engineConfig?: Record<string, unknown>;
  
  /** Fallback engine if primary unavailable */
  fallback?: FormEngineType;
}

/**
 * Default engine specification
 */
export const DEFAULT_ENGINE_SPEC: FormEngineSpec = {
  engine: 'formly',
  adapterVersion: '1.0.0',
  fallback: 'reactive',
};

/**
 * Create engine spec
 */
export function createEngineSpec(
  engine: FormEngineType,
  options?: Partial<FormEngineSpec>
): FormEngineSpec {
  return {
    engine,
    adapterVersion: '1.0.0',
    ...options,
  };
}
