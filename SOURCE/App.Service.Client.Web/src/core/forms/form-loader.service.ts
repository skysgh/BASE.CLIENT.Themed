import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, switchMap } from 'rxjs';
import { parse as parseYaml } from 'yaml';
import { FormDefinition } from './form-definition.model';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';

/**
 * Form Loader Service
 * 
 * Loads form definitions from YAML or JSON files.
 * Strategy: Try YAML first, fallback to JSON.
 * 
 * FALLBACK STRATEGY:
 * 1. Try YAML file for exact mode (e.g., spike.add.form.yml)
 * 2. Fallback to JSON file for exact mode
 * 3. If mode is 'add', fallback to 'edit' form (add is usually edit with defaults)
 * 4. If all fail, return error
 * 
 * Benefits of YAML:
 * - Supports comments (for non-technical stakeholders)
 * - More readable/writable by humans
 * - Less syntax noise (no quotes, commas)
 * 
 * File locations:
 * - YAML: assets/data/forms/{formId}.{mode}.form.yml
 * - JSON: assets/data/forms/{formId}.{mode}.form.json
 */
@Injectable({ providedIn: 'root' })
export class FormLoaderService {
  
  /** Base path for form definitions */
  private readonly FORMS_BASE_PATH = 'assets/data/forms';
  
  /** Cache loaded forms */
  private formCache = new Map<string, FormDefinition>();

  constructor(
    private http: HttpClient,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  /**
   * Load a form definition by ID
   * Tries YAML first, falls back to JSON
   * For 'add' mode, falls back to 'edit' if add not found
   * 
   * @param formId Form identifier (e.g., 'spike', 'spike-item')
   * @param mode Form mode (optional, for mode-specific forms)
   * @returns Observable<FormDefinition>
   */
  loadForm(formId: string, mode?: 'view' | 'edit' | 'add'): Observable<FormDefinition> {
    const cacheKey = mode ? `${formId}-${mode}` : formId;
    
    // Check cache first
    if (this.formCache.has(cacheKey)) {
      this.logger.debug(`Form loaded from cache: ${cacheKey}`);
      return of(this.formCache.get(cacheKey)!);
    }
    
    const fileName = mode ? `${formId}.${mode}.form` : `${formId}.form`;
    
    // Try YAML first, then JSON
    return this.loadYaml(fileName).pipe(
      catchError(() => {
        this.logger.debug(`YAML not found for ${fileName}, trying JSON`);
        return this.loadJson(fileName);
      }),
      catchError(() => {
        // If mode is 'add' and not found, fallback to 'edit'
        if (mode === 'add') {
          this.logger.debug(`Add form not found, falling back to edit: ${formId}`);
          return this.loadFormWithFallback(formId, 'edit').pipe(
            map(editForm => this.adaptEditFormForAdd(editForm, formId))
          );
        }
        throw new Error(`Form not found: ${formId} (mode: ${mode})`);
      }),
      map(formDef => {
        // Cache the result
        this.formCache.set(cacheKey, formDef);
        return formDef;
      }),
      catchError(err => {
        this.logger.error(`Failed to load form: ${fileName}`);
        throw new Error(`Form not found: ${formId}`);
      })
    );
  }

  /**
   * Load form with YAML → JSON fallback (no add→edit fallback)
   */
  private loadFormWithFallback(formId: string, mode: 'view' | 'edit'): Observable<FormDefinition> {
    const fileName = `${formId}.${mode}.form`;
    
    return this.loadYaml(fileName).pipe(
      catchError(() => this.loadJson(fileName))
    );
  }

  /**
   * Adapt an edit form for add mode
   * Changes mode and adds any add-specific defaults
   */
  private adaptEditFormForAdd(editForm: FormDefinition, formId: string): FormDefinition {
    this.logger.debug(`Adapting edit form for add: ${formId}`);
    
    return {
      ...editForm,
      id: `${formId}-add`,
      title: editForm.title?.replace('Edit', 'Create New') || 'Create New',
      mode: 'add',
      // Fields stay the same - add mode just uses defaults
    };
  }

  /**
   * Load YAML form file
   */
  private loadYaml(fileName: string): Observable<FormDefinition> {
    const path = `${this.FORMS_BASE_PATH}/${fileName}.yml`;
    
    return this.http.get(path, { responseType: 'text' }).pipe(
      map(yamlContent => {
        this.logger.debug(`Loaded YAML form: ${path}`);
        const parsed = parseYaml(yamlContent) as FormDefinition;
        return this.validateFormDefinition(parsed);
      })
    );
  }

  /**
   * Load JSON form file
   */
  private loadJson(fileName: string): Observable<FormDefinition> {
    const path = `${this.FORMS_BASE_PATH}/${fileName}.json`;
    
    return this.http.get<FormDefinition>(path).pipe(
      map(formDef => {
        this.logger.debug(`Loaded JSON form: ${path}`);
        return this.validateFormDefinition(formDef);
      })
    );
  }

  /**
   * Validate and normalize form definition
   */
  private validateFormDefinition(formDef: any): FormDefinition {
    if (!formDef.id) {
      throw new Error('Form definition must have an id');
    }
    if (!formDef.fields || !Array.isArray(formDef.fields)) {
      throw new Error('Form definition must have a fields array');
    }
    
    // Ensure defaults
    return {
      id: formDef.id,
      title: formDef.title || formDef.id,
      description: formDef.description,
      mode: formDef.mode || 'edit',
      fields: formDef.fields,
      validation: formDef.validation,
      layout: formDef.layout,
    };
  }

  /**
   * Clear the form cache
   */
  clearCache(): void {
    this.formCache.clear();
    this.logger.debug('Form cache cleared');
  }

  /**
   * Preload multiple forms
   */
  preloadForms(formIds: string[]): void {
    formIds.forEach(id => {
      this.loadForm(id).subscribe({
        error: () => {} // Ignore errors during preload
      });
    });
  }

  /**
   * Check if a form exists (without loading)
   */
  formExists(formId: string, mode?: 'view' | 'edit' | 'add'): Observable<boolean> {
    const cacheKey = mode ? `${formId}-${mode}` : formId;
    
    if (this.formCache.has(cacheKey)) {
      return of(true);
    }
    
    return this.loadForm(formId, mode).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
