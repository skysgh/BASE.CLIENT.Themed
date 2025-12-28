import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ArchitecturePrincipleTypeRepository } from '../repositories/architecture-principle-type.repository';
import { ArchitecturePrincipleTypeViewModel } from '../models/view-models/architecture-principle-type.view-model';
import { mapArchitecturePrincipleTypeDtosToViewModels } from '../mappers/architecture-principle-type.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ArchitecturePrincipleTypeService {
  types = signal<ArchitecturePrincipleTypeViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  typeCount = computed(() => this.types().length);
  hasTypes = computed(() => this.types().length > 0);
  
  constructor(
    private repository: ArchitecturePrincipleTypeRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadTypes();
  }
  
  loadTypes() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapArchitecturePrincipleTypeDtosToViewModels(dtos);
          this.types.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} architecture principle types`);
        },
        error: (err) => {
          this.error.set('Failed to load architecture principle types');
          this.loading.set(false);
          this.logger.error(`Error loading architecture principle types: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ArchitecturePrincipleTypeViewModel | undefined {
    return this.types().find(t => t.id === id);
  }
  
  refresh() {
    this.loadTypes();
  }
}
