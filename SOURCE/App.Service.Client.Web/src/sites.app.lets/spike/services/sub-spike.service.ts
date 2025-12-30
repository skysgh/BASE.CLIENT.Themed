import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { SubSpikeRepository } from '../repositories/sub-spike.repository';
import { SubSpikeViewModel } from '../models/view-models/sub-spike.view-model';
import { SubSpikeDto } from '../models/dtos/sub-spike.dto';
import { mapSubSpikeDtosToViewModels, mapSubSpikeDtoToViewModel } from '../mappers/sub-spike.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

/**
 * SubSpike Service
 * 
 * Signal-based service providing reactive state management for SubSpikes.
 * Part of the repository pattern: Repository → Mapper → Service → Component
 * 
 * Responsibilities:
 * - Manage sub-spike state using Angular Signals
 * - Load data from repository (all or by parent)
 * - Transform DTOs to ViewModels via mapper
 * - Provide computed signals (filtering by parent)
 * - Handle loading/error states
 * 
 * Architecture:
 * - providedIn: 'root' (singleton)
 * - Signal-based reactivity (no Observables exposed)
 * - Auto-loads all sub-spikes on construction
 * - Stateful (maintains signal state)
 * - Components read signals directly or call getByParentId()
 * 
 * Usage in Components:
 * ```typescript
 * constructor(public subSpikeService: SubSpikeService) {}
 * 
 * // Get sub-spikes for specific parent
 * parentSpikes = computed(() => 
 *   this.subSpikeService.getByParentId(this.selectedSpikeId())
 * );
 * 
 * // In template:
 * @for (subSpike of parentSpikes(); track subSpike.id) {
 *   <div>{{ subSpike.displayLabel }}</div>
 * }
 * ```
 * 
 * Benefits:
 * - Automatic change detection (signals)
 * - No manual unsubscribe needed
 * - Hierarchical data support
 * - Single source of truth
 */
@Injectable({ providedIn: 'root' })
export class SubSpikeService {
  /**
   * Signal: All sub-spikes loaded from API
   */
  subSpikes = signal<SubSpikeViewModel[]>([]);

  /**
   * Signal: Loading state
   */
  loading = signal(false);

  /**
   * Signal: Saving state
   */
  saving = signal(false);

  /**
   * Signal: Error message (null if no error)
   */
  error = signal<string | null>(null);

  /**
   * Computed Signal: Count of sub-spikes
   * Updates automatically when subSpikes() changes
   */
  subSpikeCount = computed(() => this.subSpikes().length);

  /**
   * Computed Signal: Whether any sub-spikes exist
   * Useful for empty state checks
   */
  hasSubSpikes = computed(() => this.subSpikes().length > 0);

  constructor(
    private repository: SubSpikeRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadSubSpikes();
  }

  /**
   * Load all sub-spikes from API
   * 
   * Flow:
   * 1. Set loading = true
   * 2. Call repository.getAll()
   * 3. Map DTOs → ViewModels
   * 4. Update subSpikes signal
   * 5. Set loading = false
   * 
   * Automatically called on service construction
   */
  loadSubSpikes() {
    this.loading.set(true);
    this.error.set(null);

    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapSubSpikeDtosToViewModels(dtos);
          this.subSpikes.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} sub-spikes`);
        },
        error: (err) => {
          this.error.set('Failed to load sub-spikes');
          this.loading.set(false);
          this.logger.error(`Error loading sub-spikes: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }

  /**
   * Get sub-spikes by parent spike ID
   * 
   * Filters from in-memory signal (no new API call)
   * Use this for displaying children of a specific spike
   * 
   * @param parentId Parent Spike ID
   * @returns SubSpikeViewModel[] Array of child sub-spikes
   * 
   * @example
   * ```typescript
   * // In component:
   * childSpikes = computed(() => 
   *   this.subSpikeService.getByParentId(this.selectedSpikeId())
   * );
   * ```
   */
  getByParentId(parentId: string): SubSpikeViewModel[] {
    return this.subSpikes().filter(subSpike => subSpike.parentId === parentId);
  }

  /**
   * Get sub-spike by ID
   * 
   * @param id SubSpike ID
   * @returns SubSpikeViewModel | undefined
   */
  getById(id: string): SubSpikeViewModel | undefined {
    return this.subSpikes().find(subSpike => subSpike.id === id);
  }

  /**
   * Create a new sub-spike
   * 
   * @param parentId Parent Spike ID
   * @param model Form model data
   * @returns Observable<SubSpikeDto> Created sub-spike
   */
  create(parentId: string, model: Record<string, any>): Observable<SubSpikeDto | null> {
    this.saving.set(true);
    this.error.set(null);

    const dto = this.buildDto(parentId, model);
    
    return this.repository.create(dto).pipe(
      tap({
        next: (created) => {
          this.logger.info(`Created sub-spike: ${created.id}`);
          // Add to local state immediately (optimistic update)
          const newViewModel = mapSubSpikeDtoToViewModel(created);
          this.subSpikes.update(items => [...items, newViewModel]);
          this.saving.set(false);
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set('Failed to create sub-spike');
          this.logger.error(`Error creating sub-spike: ${err?.message || err}`);
        }
      }),
      catchError(err => {
        this.saving.set(false);
        this.error.set('Failed to create sub-spike');
        return of(null);
      })
    );
  }

  /**
   * Update an existing sub-spike
   * 
   * @param id SubSpike ID
   * @param model Form model data
   * @returns Observable<SubSpikeDto> Updated sub-spike
   */
  update(id: string, model: Record<string, any>): Observable<SubSpikeDto | null> {
    this.saving.set(true);
    this.error.set(null);

    const existing = this.getById(id);
    const dto = this.buildDto(existing?.parentId || '', model, existing);
    
    return this.repository.update(id, dto).pipe(
      tap({
        next: (updated) => {
          this.saving.set(false);
          this.logger.info(`Updated sub-spike: ${updated.id}`);
          // Update local state
          this.subSpikes.update(items => 
            items.map(s => s.id === id ? { 
              ...s, 
              title: model['title'] || s.title, 
              description: model['description'] || s.description 
            } : s)
          );
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set('Failed to update sub-spike');
          this.logger.error(`Error updating sub-spike: ${err?.message || err}`);
        }
      }),
      catchError(err => {
        this.saving.set(false);
        this.error.set('Failed to update sub-spike');
        return of(null);
      })
    );
  }

  /**
   * Delete a sub-spike
   */
  delete(id: string): Observable<boolean> {
    this.saving.set(true);
    this.error.set(null);

    return this.repository.delete(id).pipe(
      map(() => {
        this.saving.set(false);
        this.logger.info(`Deleted sub-spike: ${id}`);
        this.subSpikes.update(items => items.filter(s => s.id !== id));
        return true;
      }),
      catchError(err => {
        this.saving.set(false);
        this.error.set('Failed to delete sub-spike');
        this.logger.error(`Error deleting sub-spike: ${err?.message || err}`);
        return of(false);
      })
    );
  }

  /**
   * Reload sub-spikes from API
   * Useful for manual refresh
   */
  refresh() {
    this.loadSubSpikes();
  }

  /**
   * Build DTO from form model
   */
  private buildDto(parentId: string, model: Record<string, any>, existing?: SubSpikeViewModel): SubSpikeDto {
    return {
      id: existing?.id || crypto.randomUUID(),
      parentFK: parentId,
      title: model['title'] || '',
      description: model['description'],
    };
  }
}
