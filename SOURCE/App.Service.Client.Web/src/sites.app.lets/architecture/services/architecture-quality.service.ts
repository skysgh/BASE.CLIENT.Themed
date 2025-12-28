import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ArchitectureQualityRepository } from '../repositories/architecture-quality.repository';
import { ArchitectureQualityViewModel } from '../models/view-models/architecture-quality.view-model';
import { mapArchitectureQualityDtosToViewModels } from '../mappers/architecture-quality.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ArchitectureQualityService {
  qualities = signal<ArchitectureQualityViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  qualityCount = computed(() => this.qualities().length);
  hasQualities = computed(() => this.qualities().length > 0);
  
  constructor(
    private repository: ArchitectureQualityRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadQualities();
  }
  
  loadQualities() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapArchitectureQualityDtosToViewModels(dtos);
          this.qualities.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} architecture qualities`);
        },
        error: (err) => {
          this.error.set('Failed to load architecture qualities');
          this.loading.set(false);
          this.logger.error(`Error loading architecture qualities: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ArchitectureQualityViewModel | undefined {
    return this.qualities().find(q => q.id === id);
  }

  getByCategoryId(categoryId: string): ArchitectureQualityViewModel[] {
    return this.qualities().filter(q => q.categoryId === categoryId);
  }
  
  refresh() {
    this.loadQualities();
  }
}
