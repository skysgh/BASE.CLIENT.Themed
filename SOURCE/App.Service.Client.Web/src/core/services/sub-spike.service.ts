import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SubSpikeRepository } from '../repositories/sub-spike.repository';
import { SubSpikeViewModel } from '../models/view-models/sub-spike.view-model';
import { mapSubSpikeDtosToViewModels } from '../mappers/sub-spike.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

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
   * Reload sub-spikes from API
   * Useful for manual refresh
   */
  refresh() {
    this.loadSubSpikes();
  }
}
