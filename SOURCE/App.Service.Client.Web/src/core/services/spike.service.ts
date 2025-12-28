import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SpikeRepository } from '../repositories/spike.repository';
import { SpikeViewModel } from '../models/view-models/spike.view-model';
import { mapSpikeDtosToViewModels } from '../mappers/spike.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

/**
 * Spike Service
 * 
 * Signal-based service providing reactive state management for Spikes.
 * Part of the repository pattern: Repository → Mapper → Service → Component
 * 
 * Responsibilities:
 * - Manage spike state using Angular Signals
 * - Load data from repository
 * - Transform DTOs to ViewModels via mapper
 * - Provide computed signals (filtering, sorting)
 * - Handle loading/error states
 * 
 * Architecture:
 * - providedIn: 'root' (singleton)
 * - Signal-based reactivity (no Observables exposed)
 * - Auto-loads on construction
 * - Stateful (maintains signal state)
 * - Components read signals directly
 * 
 * Usage in Components:
 * ```typescript
 * constructor(public spikeService: SpikeService) {}
 * 
 * // In template:
 * @for (spike of spikeService.spikes(); track spike.id) {
 *   <div>{{ spike.displayLabel }}</div>
 * }
 * 
 * @if (spikeService.loading()) {
 *   <div>Loading...</div>
 * }
 * ```
 * 
 * Benefits:
 * - Automatic change detection (signals)
 * - No manual unsubscribe needed
 * - Computed signals update automatically
 * - Single source of truth
 */
@Injectable({ providedIn: 'root' })
export class SpikeService {
  /**
   * Signal: All spikes loaded from API
   */
  spikes = signal<SpikeViewModel[]>([]);

  /**
   * Signal: Loading state
   */
  loading = signal(false);

  /**
   * Signal: Error message (null if no error)
   */
  error = signal<string | null>(null);

  /**
   * Computed Signal: Count of spikes
   * Updates automatically when spikes() changes
   */
  spikeCount = computed(() => this.spikes().length);

  /**
   * Computed Signal: Whether any spikes exist
   * Useful for empty state checks
   */
  hasSpikes = computed(() => this.spikes().length > 0);

  constructor(
    private repository: SpikeRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadSpikes();
  }

  /**
   * Load all spikes from API
   * 
   * Flow:
   * 1. Set loading = true
   * 2. Call repository.getAll()
   * 3. Map DTOs → ViewModels
   * 4. Update spikes signal
   * 5. Set loading = false
   * 
   * Automatically called on service construction
   */
  loadSpikes() {
    this.loading.set(true);
    this.error.set(null);

    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapSpikeDtosToViewModels(dtos);
          this.spikes.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} spikes`);
        },
        error: (err) => {
          this.error.set('Failed to load spikes');
          this.loading.set(false);
          this.logger.error(`Error loading spikes: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }

  /**
   * Get spike by ID
   * 
   * @param id Spike ID
   * @returns SpikeViewModel | undefined
   */
  getById(id: string): SpikeViewModel | undefined {
    return this.spikes().find(spike => spike.id === id);
  }

  /**
   * Reload spikes from API
   * Useful for manual refresh
   */
  refresh() {
    this.loadSpikes();
  }
}
