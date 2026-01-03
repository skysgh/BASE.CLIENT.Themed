/**
 * EntitySchemaService
 * 
 * Central service for loading, caching, and managing entity schemas.
 * Provides:
 * - Schema loading from API
 * - Schema caching
 * - View derivation (detail from edit, add from edit)
 * - Lookup preloading
 * - MRU tracking per entity
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, tap, catchError, shareReplay, BehaviorSubject } from 'rxjs';

import {
  EntitySchema,
  getBrowseViewSchema,
  getEditViewSchema,
  getAddViewSchema,
  getDetailViewSchema,
  getViewSchemaByMode,
  getLookup,
  parseEntitySchema,
} from '../models/schema/entity-schema.model';
import { FormViewSchema, FormViewMode } from '../models/schema/form-view-schema.model';
import { BrowseViewSchema } from '../../core.ag/ui/widgets/browse-view/browse-view-schema.model';
import { OptionsLoaderService } from './options-loader.service';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

// ═══════════════════════════════════════════════════════════════════
// MRU Entry
// ═══════════════════════════════════════════════════════════════════

/**
 * MRU entry for recently accessed entities
 */
export interface EntityMruEntry {
  entityType: string;
  entityId: string;
  title: string;
  subtitle?: string;
  icon?: string;
  route: string;
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════════
// Service Configuration
// ═══════════════════════════════════════════════════════════════════

export interface EntitySchemaServiceConfig {
  /** Base URL for schema API */
  schemaApiBase: string;
  
  /** Cache TTL in seconds */
  cacheTtlSeconds: number;
  
  /** Max MRU entries per entity type */
  mruMaxItems: number;
  
  /** Storage key for MRU */
  mruStorageKey: string;
}

const DEFAULT_CONFIG: EntitySchemaServiceConfig = {
  schemaApiBase: '/api/schema/entities',
  cacheTtlSeconds: 3600, // 1 hour
  mruMaxItems: 10,
  mruStorageKey: 'entity-mru',
};

// ═══════════════════════════════════════════════════════════════════
// Service
// ═══════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class EntitySchemaService {
  private http = inject(HttpClient);
  private optionsLoader = inject(OptionsLoaderService);
  private diagnostics = inject(SystemDiagnosticsTraceService);
  
  private config = DEFAULT_CONFIG;
  
  // Schema cache
  private schemas = new Map<string, EntitySchema>();
  private schemaTimestamps = new Map<string, number>();
  private pending = new Map<string, Observable<EntitySchema>>();
  
  // MRU state
  private mru$ = new BehaviorSubject<Map<string, EntityMruEntry[]>>(new Map());
  
  constructor() {
    this.loadMruFromStorage();
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Configuration
  // ═══════════════════════════════════════════════════════════════════
  
  /**
   * Configure the service
   */
  configure(config: Partial<EntitySchemaServiceConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Schema Loading
  // ═══════════════════════════════════════════════════════════════════
  
  /**
   * Get entity schema (from cache or API)
   */
  getSchema(entityType: string): Observable<EntitySchema | null> {
    // Check cache
    const cached = this.getFromCache(entityType);
    if (cached) {
      return of(cached);
    }
    
    // Check pending
    const pending = this.pending.get(entityType);
    if (pending) {
      return pending;
    }
    
    // Load from API
    const url = `${this.config.schemaApiBase}/${entityType}`;
    const request$ = this.http.get<EntitySchema>(url).pipe(
      tap(schema => {
        this.setCache(entityType, schema);
        this.pending.delete(entityType);
        this.preloadLookups(schema);
      }),
      catchError(error => {
        this.diagnostics.error(`Failed to load schema for ${entityType}: ${error.message}`);
        this.pending.delete(entityType);
        return of(null);
      }),
      shareReplay(1)
    );
    
    this.pending.set(entityType, request$);
    return request$;
  }
  
  /**
   * Get schema synchronously (from cache only)
   */
  getSchemaSync(entityType: string): EntitySchema | null {
    return this.getFromCache(entityType);
  }
  
  /**
   * Register a schema (for client-side defined schemas)
   */
  registerSchema(schema: EntitySchema): void {
    this.setCache(schema.id, schema);
    this.preloadLookups(schema);
  }
  
  /**
   * Register multiple schemas
   */
  registerSchemas(schemas: EntitySchema[]): void {
    for (const schema of schemas) {
      this.registerSchema(schema);
    }
  }
  
  /**
   * Clear schema cache
   */
  clearCache(entityType?: string): void {
    if (entityType) {
      this.schemas.delete(entityType);
      this.schemaTimestamps.delete(entityType);
    } else {
      this.schemas.clear();
      this.schemaTimestamps.clear();
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // View Schema Access
  // ═══════════════════════════════════════════════════════════════════
  
  /**
   * Get browse view schema for entity
   */
  getBrowseView(entityType: string): Observable<BrowseViewSchema | null> {
    return this.getSchema(entityType).pipe(
      map(schema => schema ? getBrowseViewSchema(schema) : null)
    );
  }
  
  /**
   * Get edit form schema for entity
   */
  getEditView(entityType: string): Observable<FormViewSchema | null> {
    return this.getSchema(entityType).pipe(
      map(schema => schema ? getEditViewSchema(schema) : null)
    );
  }
  
  /**
   * Get add form schema for entity
   */
  getAddView(entityType: string): Observable<FormViewSchema | null> {
    return this.getSchema(entityType).pipe(
      map(schema => schema ? getAddViewSchema(schema) : null)
    );
  }
  
  /**
   * Get detail view schema for entity
   */
  getDetailView(entityType: string): Observable<FormViewSchema | null> {
    return this.getSchema(entityType).pipe(
      map(schema => schema ? getDetailViewSchema(schema) : null)
    );
  }
  
  /**
   * Get view schema by mode
   */
  getViewByMode(entityType: string, mode: FormViewMode): Observable<FormViewSchema | null> {
    return this.getSchema(entityType).pipe(
      map(schema => schema ? getViewSchemaByMode(schema, mode) : null)
    );
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // MRU (Most Recently Used)
  // ═══════════════════════════════════════════════════════════════════
  
  /**
   * Get MRU entries for an entity type
   */
  getMru(entityType: string): Observable<EntityMruEntry[]> {
    return this.mru$.pipe(
      map(mruMap => mruMap.get(entityType) || [])
    );
  }
  
  /**
   * Get all MRU entries (across all entity types)
   */
  getAllMru(): Observable<EntityMruEntry[]> {
    return this.mru$.pipe(
      map(mruMap => {
        const all: EntityMruEntry[] = [];
        for (const entries of mruMap.values()) {
          all.push(...entries);
        }
        return all.sort((a, b) => b.timestamp - a.timestamp);
      })
    );
  }
  
  /**
   * Add/update MRU entry
   */
  addToMru(entry: Omit<EntityMruEntry, 'timestamp'>): void {
    const mruMap = new Map(this.mru$.value);
    const entries = mruMap.get(entry.entityType) || [];
    
    // Remove existing entry for same entityId
    const filtered = entries.filter(e => e.entityId !== entry.entityId);
    
    // Add new entry at front
    const newEntry: EntityMruEntry = {
      ...entry,
      timestamp: Date.now(),
    };
    filtered.unshift(newEntry);
    
    // Trim to max
    const schema = this.getSchemaSync(entry.entityType);
    const maxItems = schema?.mruMaxItems || this.config.mruMaxItems;
    mruMap.set(entry.entityType, filtered.slice(0, maxItems));
    
    this.mru$.next(mruMap);
    this.saveMruToStorage();
  }
  
  /**
   * Remove MRU entry
   */
  removeFromMru(entityType: string, entityId: string): void {
    const mruMap = new Map(this.mru$.value);
    const entries = mruMap.get(entityType) || [];
    const filtered = entries.filter(e => e.entityId !== entityId);
    mruMap.set(entityType, filtered);
    this.mru$.next(mruMap);
    this.saveMruToStorage();
  }
  
  /**
   * Clear MRU for entity type (or all)
   */
  clearMru(entityType?: string): void {
    if (entityType) {
      const mruMap = new Map(this.mru$.value);
      mruMap.delete(entityType);
      this.mru$.next(mruMap);
    } else {
      this.mru$.next(new Map());
    }
    this.saveMruToStorage();
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Lookup Helpers
  // ═══════════════════════════════════════════════════════════════════
  
  /**
   * Preload lookups marked for preload
   */
  private preloadLookups(schema: EntitySchema): void {
    if (!schema.lookups) return;
    
    const preloadable = schema.lookups.filter(l => l.preload);
    if (preloadable.length === 0) return;
    
    this.diagnostics.debug(`Preloading ${preloadable.length} lookups for ${schema.id}`);
    
    this.optionsLoader.preloadOptions(
      preloadable.map(l => ({ id: l.id, source: l.source })),
      { formValues: {}, entityType: schema.id }
    );
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Cache Helpers
  // ═══════════════════════════════════════════════════════════════════
  
  private getFromCache(entityType: string): EntitySchema | null {
    const schema = this.schemas.get(entityType);
    if (!schema) return null;
    
    const timestamp = this.schemaTimestamps.get(entityType) || 0;
    const age = (Date.now() - timestamp) / 1000;
    if (age > this.config.cacheTtlSeconds) {
      this.schemas.delete(entityType);
      this.schemaTimestamps.delete(entityType);
      return null;
    }
    
    return schema;
  }
  
  private setCache(entityType: string, schema: EntitySchema): void {
    this.schemas.set(entityType, schema);
    this.schemaTimestamps.set(entityType, Date.now());
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // MRU Storage
  // ═══════════════════════════════════════════════════════════════════
  
  private loadMruFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.config.mruStorageKey);
      if (stored) {
        const data = JSON.parse(stored) as Record<string, EntityMruEntry[]>;
        const mruMap = new Map<string, EntityMruEntry[]>();
        for (const [key, entries] of Object.entries(data)) {
          mruMap.set(key, entries);
        }
        this.mru$.next(mruMap);
      }
    } catch (error) {
      this.diagnostics.warn('Failed to load MRU from storage');
    }
  }
  
  private saveMruToStorage(): void {
    try {
      const data: Record<string, EntityMruEntry[]> = {};
      for (const [key, entries] of this.mru$.value.entries()) {
        data[key] = entries;
      }
      localStorage.setItem(this.config.mruStorageKey, JSON.stringify(data));
    } catch (error) {
      this.diagnostics.warn('Failed to save MRU to storage');
    }
  }
}
