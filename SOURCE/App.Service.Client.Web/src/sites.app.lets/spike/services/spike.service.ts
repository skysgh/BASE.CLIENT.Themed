import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { SpikeRepository } from '../repositories/spike.repository';
import { SpikeViewModel } from '../models/view-models/spike.view-model';
import { SpikeDto } from '../models/dtos/spike.dto';
import { mapSpikeDtosToViewModels } from '../mappers/spike.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

/**
 * Spike Service
 * 
 * Signal-based service providing reactive state management for Spikes.
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
   * Signal: Saving state
   */
  saving = signal(false);

  /**
   * Signal: Error message (null if no error)
   */
  error = signal<string | null>(null);

  /**
   * Computed Signal: Count of spikes
   */
  spikeCount = computed(() => this.spikes().length);

  /**
   * Computed Signal: Whether any spikes exist
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
   */
  getById(id: string): SpikeViewModel | undefined {
    return this.spikes().find(spike => spike.id === id);
  }

  /**
   * Create a new spike
   * 
   * @param model Form model data
   * @returns Observable<SpikeDto> Created spike
   */
  create(model: Record<string, any>): Observable<SpikeDto | null> {
    this.saving.set(true);
    this.error.set(null);

    const dto = this.buildDto(model);
    
    return this.repository.create(dto).pipe(
      tap({
        next: (created) => {
          this.saving.set(false);
          this.logger.info(`Created spike: ${created.id}`);
          // Reload to get fresh data
          this.loadSpikes();
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set('Failed to create spike');
          this.logger.error(`Error creating spike: ${err?.message || err}`);
        }
      }),
      catchError(err => {
        this.saving.set(false);
        this.error.set('Failed to create spike');
        return of(null);
      })
    );
  }

  /**
   * Update an existing spike
   * 
   * @param id Spike ID
   * @param model Form model data
   * @returns Observable<SpikeDto> Updated spike
   */
  update(id: string, model: Record<string, any>): Observable<SpikeDto | null> {
    this.saving.set(true);
    this.error.set(null);

    const existing = this.getById(id);
    const dto = this.buildDto(model, existing);
    
    return this.repository.update(id, dto).pipe(
      tap({
        next: (updated) => {
          this.saving.set(false);
          this.logger.info(`Updated spike: ${updated.id}`);
          // Update local state
          this.spikes.update(spikes => 
            spikes.map(s => s.id === id ? { ...s, title: model['title'] || s.title, description: model['description'] || s.description } : s)
          );
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set('Failed to update spike');
          this.logger.error(`Error updating spike: ${err?.message || err}`);
        }
      }),
      catchError(err => {
        this.saving.set(false);
        this.error.set('Failed to update spike');
        return of(null);
      })
    );
  }

  /**
   * Delete a spike
   */
  delete(id: string): Observable<boolean> {
    this.saving.set(true);
    this.error.set(null);

    return this.repository.delete(id).pipe(
      map(() => {
        this.saving.set(false);
        this.logger.info(`Deleted spike: ${id}`);
        this.spikes.update(spikes => spikes.filter(s => s.id !== id));
        return true;
      }),
      catchError(err => {
        this.saving.set(false);
        this.error.set('Failed to delete spike');
        this.logger.error(`Error deleting spike: ${err?.message || err}`);
        return of(false);
      })
    );
  }

  /**
   * Reload spikes from API
   */
  refresh() {
    this.loadSpikes();
  }

  /**
   * Build DTO from form model
   */
  private buildDto(model: Record<string, any>, existing?: SpikeViewModel): SpikeDto {
    const now = new Date().toISOString();
    
    return {
      id: existing?.id || crypto.randomUUID(),
      title: model['title'] || '',
      description: model['description'],
      categoryId: model['categoryId'] || '1',
      statusId: model['statusId'] || '1',
      dueDate: model['dueDate'],
      estimatedEffort: model['estimatedEffort'],
      priority: model['priority'] || 3,
      classificationIds: model['classificationIds'] || [],
      parts: model['parts'] || [],
      items: model['items'] || [],
      createdUtc: existing ? now : now, // Would preserve original on update
      modifiedUtc: now,
      createdBy: model['createdBy'],
      modifiedBy: model['modifiedBy'],
    };
  }
}
