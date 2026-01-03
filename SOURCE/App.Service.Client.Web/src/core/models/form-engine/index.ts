/**
 * Form Engine Module
 * 
 * Barrel export for form engine abstraction layer.
 * 
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                     FormViewSchema                              │
 * │                   (Engine-Agnostic)                             │
 * └───────────────────────────┬─────────────────────────────────────┘
 *                             │
 *               FormEngineRegistry.convertForm()
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
 * import { 
 *   FormEngineRegistry,
 *   generateEditForm,
 *   formlyAdapter,
 * } from '../form-engine';
 * 
 * // Generate form from entity
 * const formSchema = generateEditForm(myEntity, 'formly');
 * 
 * // Convert to engine config
 * const formlyConfig = formlyAdapter.convertForm(formSchema);
 * // Or via registry
 * const config = formEngineRegistry.toFormly(formSchema);
 * ```
 */

// ═══════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════

export {
  // Engine types
  FormEngineType,
  FormEngineVersion,
  FormEngineCapabilities,
  FormEngineConfig,
  FormEngineSpec,
  
  // Engine configs
  DEFAULT_FORM_ENGINE,
  DEFAULT_ENGINE_SPEC,
  FORMLY_ENGINE_CONFIG,
  JSONFORMS_ENGINE_CONFIG,
  REACTIVE_ENGINE_CONFIG,
  FORM_ENGINE_CONFIGS,
  
  // Helpers
  getAvailableEngines,
  getEngineConfig,
  engineSupports,
  createEngineSpec,
} from './form-engine.types';

// ═══════════════════════════════════════════════════════════════════
// Adapter Base
// ═══════════════════════════════════════════════════════════════════

export {
  // Adapter base class
  FormSchemaAdapter,
  
  // Result types
  FormConversionResult,
  FieldConversionResult,
  
  // Engine-specific types
  FormlyFieldConfig,
  FormlyFormConfig,
  JsonFormsSchema,
  JsonFormsUiSchema,
} from './form-schema-adapter';

// ═══════════════════════════════════════════════════════════════════
// Formly Adapter
// ═══════════════════════════════════════════════════════════════════

export {
  FormlySchemaAdapter,
  formlyAdapter,
} from './formly-schema-adapter';

// ═══════════════════════════════════════════════════════════════════
// Generator
// ═══════════════════════════════════════════════════════════════════

export {
  // Options
  FormGenerationOptions,
  
  // Main generator
  generateFormSchema,
  generateAllFormSchemas,
  
  // Convenience functions
  generateEditForm,
  generateAddForm,
  generateDetailForm,
} from './form-schema-generator';
