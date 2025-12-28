import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { ServiceFeatureRepository } from '../repositories/service-feature.repository';
import { ServiceFeatureViewModel } from '../models/view-models/service-feature.view-model';
import { 
  mapServiceFeatureDtoToViewModel, 
  mapServiceFeatureDtosToViewModels,
  mapServiceFeatureViewModelToDto 
} from '../mappers/service-feature.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

/**
 * Service Feature Service
 * 
 * Modern service using Angular signals and composition pattern.
 * Manages business logic and state for service features.
 * 
 * **Pattern Benefits:**
 * - Signals for reactive state (no manual subscription management!)
 * - Computed values update automatically
 * - Composition over inheritance (no base classes)
 * - Clear separation: Repository (data) → Mapper (transform) → Service (logic)
 * 
 * **Usage in Components:**
 * ```typescript
 * @Component({...})
 * export class FeatureListComponent {
 *   constructor(public featureService: ServiceFeatureService) {}
 *   
 *   // Template uses signals directly:
 *   // {{ featureService.features() | json }}
 *   // {{ featureService.enabledCount() }}
 * }
 * ```
 * 
 * **No Subscriptions Needed!**
 * Components consume signals directly. Angular handles reactivity.
 */
@Injectable({ providedIn: 'root' })
export class ServiceFeatureService {
  
  // ============================================================================
  // Signals (Reactive State)
  // ============================================================================
  
  /**
   * All features loaded from API
   */
  readonly features = signal<ServiceFeatureViewModel[]>([]);
  
  /**
   * Loading state indicator
   */
  readonly loading = signal<boolean>(false);
  
  /**
   * Error message (null if no error)
   */
  readonly error = signal<string | null>(null);
  
  /**
   * Whether features have been loaded at least once
   */
  readonly initialized = signal<boolean>(false);

  // ============================================================================
  // Computed Signals (Auto-updating Derived State)
  // ============================================================================
  
  /**
   * Only enabled features
   * Automatically updates when features() changes
   */
  readonly enabledFeatures = computed(() => 
    this.features().filter(f => f.isEnabled)
  );
  
  /**
   * Only disabled features
   */
  readonly disabledFeatures = computed(() => 
    this.features().filter(f => !f.isEnabled)
  );
  
  /**
   * Total feature count
   */
  readonly totalCount = computed(() => 
    this.features().length
  );
  
  /**
   * Enabled feature count
   */
  readonly enabledCount = computed(() => 
    this.enabledFeatures().length
  );
  
  /**
   * Whether any features exist
   */
  readonly hasFeatures = computed(() => 
    this.totalCount() > 0
  );
  
  /**
   * Whether we're in error state
   */
  readonly hasError = computed(() => 
    this.error() !== null
  );

  // ============================================================================
  // Constructor & Initialization
  // ============================================================================
  
  constructor(
    private repository: ServiceFeatureRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    
    // Auto-load on startup
    this.loadFeatures();
  }

  // ============================================================================
  // Public Methods (Business Logic)
  // ============================================================================
  
  /**
   * Load all features from API
   * 
   * Updates signals automatically:
   * - features() receives data
   * - loading() shows progress
   * - error() captures failures
   */
  loadFeatures(): Observable<ServiceFeatureViewModel[]> {
    this.logger.debug(`${this.constructor.name}.loadFeatures()`);
    
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      map(dtos => mapServiceFeatureDtosToViewModels(dtos)),
      tap(vms => {
        this.features.set(vms);
        this.loading.set(false);
        this.initialized.set(true);
        this.logger.debug(`Loaded ${vms.length} features`);
      }),
      catchError(err => {
        const message = 'Failed to load features';
        this.logger.error(`${message}: ${err}`);
        this.error.set(message);
        this.loading.set(false);
        return of([]);
      })
    );
  }

  /**
   * Reload features (force refresh)
   */
  refresh(): Observable<ServiceFeatureViewModel[]> {
    this.logger.debug(`${this.constructor.name}.refresh()`);
    return this.loadFeatures();
  }

  /**
   * Get feature by ID
   * 
   * @param id - Feature identifier
   * @returns Feature or undefined
   */
  getById(id: string): ServiceFeatureViewModel | undefined {
    return this.features().find(f => f.id === id);
  }

  /**
   * Add new feature
   * 
   * @param vm - Feature view model
   */
  addFeature(vm: ServiceFeatureViewModel): Observable<ServiceFeatureViewModel> {
    this.logger.debug(`${this.constructor.name}.addFeature(${vm.id})`);
    
    const dto = mapServiceFeatureViewModelToDto(vm);
    
    return this.repository.create(dto).pipe(
      map(mapServiceFeatureDtoToViewModel),
      tap(newVm => {
        this.features.update(current => [...current, newVm]);
        this.logger.debug(`Feature added: ${newVm.id}`);
      }),
      catchError(err => {
        this.logger.error(`Failed to add feature: ${err}`);
        throw err;
      })
    );
  }

  /**
   * Update existing feature
   * 
   * @param vm - Updated feature view model
   */
  updateFeature(vm: ServiceFeatureViewModel): Observable<ServiceFeatureViewModel> {
    this.logger.debug(`${this.constructor.name}.updateFeature(${vm.id})`);
    
    const dto = mapServiceFeatureViewModelToDto(vm);
    
    return this.repository.update(vm.id, dto).pipe(
      map(mapServiceFeatureDtoToViewModel),
      tap(updatedVm => {
        this.features.update(current =>
          current.map(f => f.id === updatedVm.id ? updatedVm : f)
        );
        this.logger.debug(`Feature updated: ${updatedVm.id}`);
      }),
      catchError(err => {
        this.logger.error(`Failed to update feature: ${err}`);
        throw err;
      })
    );
  }

  /**
   * Delete feature
   * 
   * @param id - Feature identifier
   */
  deleteFeature(id: string): Observable<void> {
    this.logger.debug(`${this.constructor.name}.deleteFeature(${id})`);
    
    return this.repository.delete(id).pipe(
      tap(() => {
        this.features.update(current =>
          current.filter(f => f.id !== id)
        );
        this.logger.debug(`Feature ${id} deleted`);
      }),
      catchError(err => {
        this.logger.error(`Failed to delete feature: ${err}`);
        throw err;
      })
    );
  }

  /**
   * Toggle feature enabled state
   * 
   * @param id - Feature identifier
   * @param enabled - New enabled state
   */
  toggleEnabled(id: string, enabled: boolean): Observable<ServiceFeatureViewModel> {
    this.logger.debug(`${this.constructor.name}.toggleEnabled(${id}, ${enabled})`);
    
    return this.repository.toggleEnabled(id, enabled).pipe(
      map(mapServiceFeatureDtoToViewModel),
      tap(updatedVm => {
        this.features.update(current =>
          current.map(f => f.id === updatedVm.id ? updatedVm : f)
        );
        this.logger.debug(`Feature ${id} enabled=${enabled}`);
      }),
      catchError(err => {
        this.logger.error(`Failed to toggle feature: ${err}`);
        throw err;
      })
    );
  }

  /**
   * Clear all features (useful for testing/reset)
   */
  clear(): void {
    this.logger.debug(`${this.constructor.name}.clear()`);
    this.features.set([]);
    this.error.set(null);
    this.initialized.set(false);
  }
}
