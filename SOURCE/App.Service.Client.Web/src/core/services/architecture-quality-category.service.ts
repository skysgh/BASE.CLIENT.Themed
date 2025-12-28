import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ArchitectureQualityCategoryRepository } from '../repositories/architecture-quality-category.repository';
import { ArchitectureQualityCategoryViewModel } from '../models/view-models/architecture-quality-category.view-model';
import { mapArchitectureQualityCategoryDtosToViewModels } from '../mappers/architecture-quality-category.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ArchitectureQualityCategoryService {
  qualityCategories = signal<ArchitectureQualityCategoryViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  categoryCount = computed(() => this.qualityCategories().length);
  hasCategories = computed(() => this.qualityCategories().length > 0);
  
  constructor(
    private repository: ArchitectureQualityCategoryRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadQualityCategories();
  }
  
  loadQualityCategories() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapArchitectureQualityCategoryDtosToViewModels(dtos);
          this.qualityCategories.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} quality categories`);
        },
        error: (err) => {
          this.error.set('Failed to load quality categories');
          this.loading.set(false);
          this.logger.error(`Error loading quality categories: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getByTypeId(typeId: string): ArchitectureQualityCategoryViewModel[] {
    return this.qualityCategories().filter(category => category.typeId === typeId);
  }
  
  getById(id: string): ArchitectureQualityCategoryViewModel | undefined {
    return this.qualityCategories().find(category => category.id === id);
  }
  
  refresh() {
    this.loadQualityCategories();
  }
}
