import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ArchitectureQualityCategoryRepository } from '../repositories/architecture-quality-category.repository';
import { ArchitectureQualityCategoryViewModel } from '../models/view-models/architecture-quality-category.view-model';
import { mapArchitectureQualityCategoryDtosToViewModels } from '../mappers/architecture-quality-category.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ArchitectureQualityCategoryService {
  categories = signal<ArchitectureQualityCategoryViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  categoryCount = computed(() => this.categories().length);
  hasCategories = computed(() => this.categories().length > 0);
  
  constructor(
    private repository: ArchitectureQualityCategoryRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadCategories();
  }
  
  loadCategories() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapArchitectureQualityCategoryDtosToViewModels(dtos);
          this.categories.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} architecture quality categories`);
        },
        error: (err) => {
          this.error.set('Failed to load architecture quality categories');
          this.loading.set(false);
          this.logger.error(`Error loading architecture quality categories: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ArchitectureQualityCategoryViewModel | undefined {
    return this.categories().find(c => c.id === id);
  }

  getByTypeId(typeId: string): ArchitectureQualityCategoryViewModel[] {
    return this.categories().filter(c => c.typeId === typeId);
  }
  
  refresh() {
    this.loadCategories();
  }
}
