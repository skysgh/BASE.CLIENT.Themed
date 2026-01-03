/**
 * Form Engine Registry Service
 * 
 * Central registry for form engine adapters.
 * Manages adapter selection, fallbacks, and configuration.
 * 
 * USAGE:
 * ```typescript
 * // Get adapter for a specific engine
 * const adapter = formEngineRegistry.getAdapter('formly');
 * 
 * // Convert schema to engine config
 * const config = adapter.convertForm(formViewSchema);
 * 
 * // Or use the convenience method
 * const config = formEngineRegistry.convertForm(formViewSchema, 'formly');
 * ```
 * 
 * REGISTRATION:
 * ```typescript
 * // Register a new adapter
 * formEngineRegistry.register(new MyCustomAdapter());
 * ```
 */

import { Injectable } from '@angular/core';
import { 
  FormSchemaAdapter, 
  FormConversionResult, 
  FormlyFormConfig, 
  FormlyFieldConfig 
} from '../models/form-engine/form-schema-adapter';
import { FormlySchemaAdapter, formlyAdapter } from '../models/form-engine/formly-schema-adapter';
import { 
  FormEngineType, 
  FormEngineConfig, 
  FormEngineSpec, 
  DEFAULT_ENGINE_SPEC,
  FORM_ENGINE_CONFIGS,
  getAvailableEngines,
} from '../models/form-engine/form-engine.types';
import { FormViewSchema } from '../models/schema/form-view-schema.model';
import { EntitySchema } from '../models/schema/entity-schema.model';
import { generateFormSchema, FormGenerationOptions } from '../models/form-engine/form-schema-generator';

// ═══════════════════════════════════════════════════════════════════
// Registry Interface
// ═══════════════════════════════════════════════════════════════════

/**
 * Form engine registry interface
 */
export interface IFormEngineRegistry {
  /** Register an adapter */
  register(adapter: FormSchemaAdapter): void;
  
  /** Get adapter by engine type */
  getAdapter(engine: FormEngineType): FormSchemaAdapter | undefined;
  
  /** Get available engines */
  getAvailableEngines(): FormEngineConfig[];
  
  /** Convert form schema using specified engine */
  convertForm<TForm, TField>(
    schema: FormViewSchema, 
    engine?: FormEngineType
  ): FormConversionResult<TForm, TField>;
  
  /** Generate and convert form from entity */
  generateAndConvert<TForm, TField>(
    entity: EntitySchema,
    options: FormGenerationOptions
  ): FormConversionResult<TForm, TField>;
}

// ═══════════════════════════════════════════════════════════════════
// Form Engine Registry Implementation
// ═══════════════════════════════════════════════════════════════════

@Injectable({
  providedIn: 'root'
})
export class FormEngineRegistry implements IFormEngineRegistry {
  /** Registered adapters by engine type */
  private adapters = new Map<FormEngineType, FormSchemaAdapter>();
  
  /** Default engine to use */
  private defaultEngine: FormEngineType = 'formly';
  
  constructor() {
    // Register built-in adapters
    this.register(formlyAdapter);
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Registration
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Register a form schema adapter
   */
  register(adapter: FormSchemaAdapter): void {
    this.adapters.set(adapter.engineType, adapter);
  }
  
  /**
   * Unregister an adapter
   */
  unregister(engine: FormEngineType): void {
    this.adapters.delete(engine);
  }
  
  /**
   * Set the default engine
   */
  setDefaultEngine(engine: FormEngineType): void {
    if (this.adapters.has(engine)) {
      this.defaultEngine = engine;
    } else {
      console.warn(`Engine '${engine}' not registered, keeping default '${this.defaultEngine}'`);
    }
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Queries
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Get adapter by engine type
   */
  getAdapter(engine: FormEngineType): FormSchemaAdapter | undefined {
    return this.adapters.get(engine);
  }
  
  /**
   * Get adapter with fallback
   */
  getAdapterWithFallback(spec: FormEngineSpec): FormSchemaAdapter {
    // Try primary engine
    let adapter = this.adapters.get(spec.engine);
    
    // Try fallback
    if (!adapter && spec.fallback) {
      adapter = this.adapters.get(spec.fallback);
    }
    
    // Use default
    if (!adapter) {
      adapter = this.adapters.get(this.defaultEngine);
    }
    
    // Last resort: return Formly adapter
    if (!adapter) {
      return formlyAdapter;
    }
    
    return adapter;
  }
  
  /**
   * Get all registered engines
   */
  getRegisteredEngines(): FormEngineType[] {
    return Array.from(this.adapters.keys());
  }
  
  /**
   * Get available engine configurations
   */
  getAvailableEngines(): FormEngineConfig[] {
    return getAvailableEngines().filter(
      config => this.adapters.has(config.type)
    );
  }
  
  /**
   * Check if engine is registered
   */
  hasEngine(engine: FormEngineType): boolean {
    return this.adapters.has(engine);
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Conversion
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Convert form schema to engine-specific config
   */
  convertForm<TForm = unknown, TField = unknown>(
    schema: FormViewSchema,
    engine?: FormEngineType
  ): FormConversionResult<TForm, TField> {
    const engineType = engine || this.defaultEngine;
    const adapter = this.getAdapter(engineType);
    
    if (!adapter) {
      throw new Error(`No adapter registered for engine '${engineType}'`);
    }
    
    return adapter.convertForm(schema) as FormConversionResult<TForm, TField>;
  }
  
  /**
   * Convert form schema using spec (with fallback handling)
   */
  convertFormWithSpec<TForm = unknown, TField = unknown>(
    schema: FormViewSchema,
    spec: FormEngineSpec = DEFAULT_ENGINE_SPEC
  ): FormConversionResult<TForm, TField> {
    const adapter = this.getAdapterWithFallback(spec);
    return adapter.convertForm(schema) as FormConversionResult<TForm, TField>;
  }
  
  /**
   * Generate form schema from entity and convert to engine config
   */
  generateAndConvert<TForm = unknown, TField = unknown>(
    entity: EntitySchema,
    options: FormGenerationOptions
  ): FormConversionResult<TForm, TField> {
    // Generate the form schema
    const formSchema = generateFormSchema(entity, options);
    
    // Convert using specified engine
    const engine = options.engine || this.defaultEngine;
    return this.convertForm<TForm, TField>(formSchema, engine);
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Convenience Methods (Formly-specific)
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Convert to Formly config (convenience method)
   */
  toFormly(schema: FormViewSchema): FormConversionResult<FormlyFormConfig, FormlyFieldConfig> {
    return this.convertForm<FormlyFormConfig, FormlyFieldConfig>(schema, 'formly');
  }
  
  /**
   * Generate and convert to Formly
   */
  generateFormlyConfig(
    entity: EntitySchema,
    mode: 'add' | 'edit' | 'detail' | 'clone'
  ): FormConversionResult<FormlyFormConfig, FormlyFieldConfig> {
    return this.generateAndConvert<FormlyFormConfig, FormlyFieldConfig>(
      entity,
      { mode, engine: 'formly' }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════
// Singleton Instance (for non-DI usage)
// ═══════════════════════════════════════════════════════════════════

let _formEngineRegistry: FormEngineRegistry | null = null;

/**
 * Get the form engine registry singleton
 * Use this for non-Angular contexts; prefer DI in Angular
 */
export function getFormEngineRegistry(): FormEngineRegistry {
  if (!_formEngineRegistry) {
    _formEngineRegistry = new FormEngineRegistry();
  }
  return _formEngineRegistry;
}
