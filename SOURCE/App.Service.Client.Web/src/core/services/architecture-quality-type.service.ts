import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ArchitectureQualityTypeRepository } from '../repositories/architecture-quality-type.repository';
import { ArchitectureQualityTypeViewModel } from '../models/view-models/architecture-quality-type.view-model';
import { mapArchitectureQualityTypeDtosToViewModels } from '../mappers/architecture-quality-type.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ArchitectureQualityTypeService {
  qualityTypes = signal<ArchitectureQualityTypeViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  typeCount = computed(() => this.qualityTypes().length);
  hasTypes = computed(() => this.qualityTypes().length > 0);
  
  constructor(
    private repository: ArchitectureQualityTypeRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadQualityTypes();
  }
  
  loadQualityTypes() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapArchitectureQualityTypeDtosToViewModels(dtos);
          this.qualityTypes.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} quality types`);
        },
        error: (err) => {
          this.error.set('Failed to load quality types');
          this.loading.set(false);
          this.logger.error(`Error loading quality types: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ArchitectureQualityTypeViewModel | undefined {
    return this.qualityTypes().find(type => type.id === id);
  }
  
  refresh() {
    this.loadQualityTypes();
  }
}
