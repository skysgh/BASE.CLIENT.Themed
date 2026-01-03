/**
 * OptionsLoaderService
 * 
 * Executes the OptionsSource DSL to load options for select fields.
 * Supports:
 * - Static inline options
 * - API-driven dynamic options
 * - Named resolver pattern
 * - Caching with TTL
 * - Dependency tracking
 * - Placeholder interpolation
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, map, catchError, shareReplay, tap, BehaviorSubject } from 'rxjs';

import {
  OptionsSource,
  ApiOptionsSource,
  FieldOption,
  OptionsLoadContext,
  OptionsResolver,
  hasOptionsSource,
  isStaticOptionsSource,
} from '../../models/schema/options-source.model';
import { SystemDiagnosticsTraceService } from '../system.diagnostics-trace.service';

// ═══════════════════════════════════════════════════════════════════
// Cache Entry
// ═══════════════════════════════════════════════════════════════════

interface CacheEntry {
  options: FieldOption[];
  timestamp: number;
  ttlSeconds: number;
}

// ═══════════════════════════════════════════════════════════════════
// Service
// ═══════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class OptionsLoaderService {
  private http = inject(HttpClient);
  private diagnostics = inject(SystemDiagnosticsTraceService);
  
  // Cache for loaded options
  private cache = new Map<string, CacheEntry>();
  
  // In-flight requests (for deduplication)
  private pending = new Map<string, Observable<FieldOption[]>>();
  
  // Registered resolvers
  private resolvers = new Map<string, OptionsResolver>();
  
  // ═══════════════════════════════════════════════════════════════════
  // Public API
  // ═══════════════════════════════════════════════════════════════════
  
  /**
   * Load options from an OptionsSource
   */
  loadOptions(
    source: OptionsSource,
    context: OptionsLoadContext = { formValues: {} }
  ): Observable<FieldOption[]> {
    if (!hasOptionsSource(source)) {
      return of([]);
    }
    
    // Static options
    if (isStaticOptionsSource(source)) {
      return of(this.applyEmptyOption(source.options || [], source));
    }
    
    // API-driven options
    if (source.api) {
      return this.loadFromApi(source.api, source, context);
    }
    
    // Resolver-driven options
    if (source.resolver) {
      return this.loadFromResolver(source.resolver.resolver, source.resolver.params, source, context);
    }
    
    return of([]);
  }
  
  /**
   * Preload options for multiple sources
   */
  preloadOptions(
    sources: Array<{ id: string; source: OptionsSource }>,
    context: OptionsLoadContext = { formValues: {} }
  ): void {
    for (const { source } of sources) {
      if (source.api?.cacheKey) {
        this.loadOptions(source, context).subscribe();
      }
    }
  }
  
  /**
   * Clear cache (all or specific key)
   */
  clearCache(cacheKey?: string): void {
    if (cacheKey) {
      this.cache.delete(cacheKey);
      this.pending.delete(cacheKey);
    } else {
      this.cache.clear();
      this.pending.clear();
    }
  }
  
  /**
   * Register a custom resolver
   */
  registerResolver(resolver: OptionsResolver): void {
    this.resolvers.set(resolver.name, resolver);
    this.diagnostics.debug(`Registered options resolver: ${resolver.name}`);
  }
  
  /**
   * Check if options should be reloaded based on dependency changes
   */
  shouldReload(
    source: OptionsSource,
    previousValues: Record<string, unknown>,
    currentValues: Record<string, unknown>
  ): boolean {
    const deps = source.api?.dependsOn || source.resolver?.dependsOn || [];
    return deps.some(dep => previousValues[dep] !== currentValues[dep]);
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // API Loading
  // ═══════════════════════════════════════════════════════════════════
  
  private loadFromApi(
    apiSource: ApiOptionsSource,
    source: OptionsSource,
    context: OptionsLoadContext
  ): Observable<FieldOption[]> {
    // Check loadWhen condition
    if (apiSource.loadWhen && !this.evaluateCondition(apiSource.loadWhen, context)) {
      return of([]);
    }
    
    // Build cache key
    const cacheKey = this.buildCacheKey(apiSource, context);
    
    // Check cache
    if (cacheKey) {
      const cached = this.getFromCache(cacheKey, apiSource.cacheTtl || 300);
      if (cached) {
        return of(this.applyEmptyOption(cached, source));
      }
      
      // Check pending request
      const pending = this.pending.get(cacheKey);
      if (pending) {
        return pending;
      }
    }
    
    // Build URL with interpolated placeholders
    const url = this.interpolate(apiSource.endpoint, context);
    
    // Build params
    let params = new HttpParams();
    if (apiSource.params) {
      for (const [key, value] of Object.entries(apiSource.params)) {
        params = params.set(key, String(value));
      }
    }
    if (apiSource.filter) {
      params = params.set('filter', apiSource.filter);
    }
    if (apiSource.sort) {
      params = params.set('sort', apiSource.sort);
    }
    
    // Make request
    const request$ = this.http.get<unknown>(url, { params }).pipe(
      map(response => this.mapResponse(response, apiSource)),
      tap(options => {
        if (cacheKey) {
          this.setCache(cacheKey, options, apiSource.cacheTtl || 300);
          this.pending.delete(cacheKey);
        }
      }),
      map(options => this.applyEmptyOption(options, source)),
      catchError(error => {
        this.diagnostics.error(`Failed to load options from ${url}: ${error.message}`);
        if (cacheKey) {
          this.pending.delete(cacheKey);
        }
        return of([]);
      }),
      shareReplay(1)
    );
    
    if (cacheKey) {
      this.pending.set(cacheKey, request$);
    }
    
    return request$;
  }
  
  private mapResponse(response: unknown, apiSource: ApiOptionsSource): FieldOption[] {
    // Navigate to response path
    let data = response;
    if (apiSource.responsePath) {
      const parts = apiSource.responsePath.split('.');
      for (const part of parts) {
        if (data && typeof data === 'object' && part in data) {
          data = (data as Record<string, unknown>)[part];
        } else {
          this.diagnostics.warn(`Response path '${apiSource.responsePath}' not found`);
          return [];
        }
      }
    }
    
    // Ensure array
    if (!Array.isArray(data)) {
      this.diagnostics.warn('API response is not an array');
      return [];
    }
    
    // Map to FieldOption
    return data.map(item => ({
      value: String(this.getNestedValue(item, apiSource.valueField)),
      label: String(this.getNestedValue(item, apiSource.labelField)),
      icon: apiSource.iconField ? String(this.getNestedValue(item, apiSource.iconField) || '') : undefined,
      description: apiSource.descriptionField ? String(this.getNestedValue(item, apiSource.descriptionField) || '') : undefined,
      badge: apiSource.badgeField ? String(this.getNestedValue(item, apiSource.badgeField) || '') : undefined,
      group: apiSource.groupField ? String(this.getNestedValue(item, apiSource.groupField) || '') : undefined,
    })).filter(opt => opt.value && opt.label);
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Resolver Loading
  // ═══════════════════════════════════════════════════════════════════
  
  private loadFromResolver(
    resolverName: string,
    params: Record<string, unknown> | undefined,
    source: OptionsSource,
    context: OptionsLoadContext
  ): Observable<FieldOption[]> {
    const resolver = this.resolvers.get(resolverName);
    if (!resolver) {
      this.diagnostics.warn(`Options resolver '${resolverName}' not registered`);
      return of([]);
    }
    
    return resolver.resolve(params, context).pipe(
      map(options => this.applyEmptyOption(options, source)),
      catchError(error => {
        this.diagnostics.error(`Resolver '${resolverName}' failed: ${error.message}`);
        return of([]);
      })
    );
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Helpers
  // ═══════════════════════════════════════════════════════════════════
  
  private applyEmptyOption(options: FieldOption[], source: OptionsSource): FieldOption[] {
    if (!source.includeEmpty) {
      return options;
    }
    
    const emptyOption: FieldOption = {
      value: source.emptyValue || '',
      label: source.emptyLabel || 'Select...',
    };
    
    return [emptyOption, ...options];
  }
  
  private buildCacheKey(apiSource: ApiOptionsSource, context: OptionsLoadContext): string | null {
    if (!apiSource.cacheKey) {
      return null;
    }
    
    let key = apiSource.cacheKey;
    
    // Include dependent values in cache key
    if (apiSource.dependsOn) {
      const depValues = apiSource.dependsOn
        .map(dep => `${dep}=${context.formValues[dep] ?? 'null'}`)
        .join('|');
      key = `${key}:${depValues}`;
    }
    
    // Include scope
    if (apiSource.cacheScope === 'entity' && context.entityType) {
      key = `${context.entityType}:${key}`;
    }
    
    return key;
  }
  
  private getFromCache(key: string, defaultTtl: number): FieldOption[] | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }
    
    const age = (Date.now() - entry.timestamp) / 1000;
    if (age > (entry.ttlSeconds || defaultTtl)) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.options;
  }
  
  private setCache(key: string, options: FieldOption[], ttlSeconds: number): void {
    this.cache.set(key, {
      options,
      timestamp: Date.now(),
      ttlSeconds,
    });
  }
  
  private interpolate(template: string, context: OptionsLoadContext): string {
    return template.replace(/\$\{(\w+(?:\.\w+)*)\}/g, (_, path) => {
      const value = this.getNestedValue(context.formValues, path) ?? 
                    this.getNestedValue(context, path);
      return String(value ?? '');
    });
  }
  
  private getNestedValue(obj: unknown, path: string): unknown {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      if (typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    
    return current;
  }
  
  private evaluateCondition(expression: string, context: OptionsLoadContext): boolean {
    // Simple expression evaluator for conditions like:
    // "fieldName != null"
    // "fieldName == 'value'"
    // "fieldName > 0"
    
    const match = expression.match(/^(\w+(?:\.\w+)*)\s*(==|!=|>|>=|<|<=)\s*(.+)$/);
    if (!match) {
      this.diagnostics.warn(`Invalid condition expression: ${expression}`);
      return true; // Default to true for invalid expressions
    }
    
    const [, fieldPath, operator, valueStr] = match;
    const fieldValue = this.getNestedValue(context.formValues, fieldPath);
    
    // Parse the comparison value
    let compareValue: unknown;
    if (valueStr === 'null') {
      compareValue = null;
    } else if (valueStr === 'true') {
      compareValue = true;
    } else if (valueStr === 'false') {
      compareValue = false;
    } else if (valueStr.startsWith("'") && valueStr.endsWith("'")) {
      compareValue = valueStr.slice(1, -1);
    } else if (!isNaN(Number(valueStr))) {
      compareValue = Number(valueStr);
    } else {
      compareValue = valueStr;
    }
    
    // Evaluate
    switch (operator) {
      case '==':
        return fieldValue === compareValue;
      case '!=':
        return fieldValue !== compareValue;
      case '>':
        return Number(fieldValue) > Number(compareValue);
      case '>=':
        return Number(fieldValue) >= Number(compareValue);
      case '<':
        return Number(fieldValue) < Number(compareValue);
      case '<=':
        return Number(fieldValue) <= Number(compareValue);
      default:
        return true;
    }
  }
}
