import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ArchitecturePrincipleRepository } from '../repositories/architecture-principle.repository';
import { ArchitecturePrincipleViewModel } from '../models/view-models/architecture-principle.view-model';
import { mapArchitecturePrincipleDtosToViewModels } from '../mappers/architecture-principle.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ArchitecturePrincipleService {
  principles = signal<ArchitecturePrincipleViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  principleCount = computed(() => this.principles().length);
  hasPrinciples = computed(() => this.principles().length > 0);
  
  constructor(
    private repository: ArchitecturePrincipleRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadPrinciples();
  }
  
  loadPrinciples() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapArchitecturePrincipleDtosToViewModels(dtos);
          this.principles.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} architecture principles`);
        },
        error: (err) => {
          this.error.set('Failed to load architecture principles');
          this.loading.set(false);
          this.logger.error(`Error loading architecture principles: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ArchitecturePrincipleViewModel | undefined {
    return this.principles().find(p => p.id === id);
  }

  getByTypeId(typeId: string): ArchitecturePrincipleViewModel[] {
    return this.principles().filter(p => p.typeId === typeId);
  }
  
  refresh() {
    this.loadPrinciples();
  }
}
