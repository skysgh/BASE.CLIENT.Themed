import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ArchitecturePrincipleRepository } from '../repositories/architecture-principle.repository';
import { ArchitecturePrincipleViewModel } from '../models/view-models/architecture-principle.view-model';
import { mapArchitecturePrincipleDtosToViewModels } from '../mappers/architecture-principle.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { ArchitecturePrincipleTypeService } from './architecture-principle-type.service';

@Injectable({ providedIn: 'root' })
export class ArchitecturePrincipleService {
  principles = signal<ArchitecturePrincipleViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  principleCount = computed(() => this.principles().length);
  hasPrinciples = computed(() => this.principles().length > 0);
  
  constructor(
    private repository: ArchitecturePrincipleRepository,
    private principleTypeService: ArchitecturePrincipleTypeService,
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
          const getCategoryName = (typeId: string) => {
            const type = this.principleTypeService.getById(typeId);
            return type?.title || 'unknown';
          };
          
          const viewModels = mapArchitecturePrincipleDtosToViewModels(dtos, getCategoryName);
          this.principles.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} principles`);
        },
        error: (err) => {
          this.error.set('Failed to load principles');
          this.loading.set(false);
          this.logger.error(`Error loading principles: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getByTypeId(typeId: string): ArchitecturePrincipleViewModel[] {
    return this.principles().filter(principle => principle.typeId === typeId);
  }
  
  getById(id: string): ArchitecturePrincipleViewModel | undefined {
    return this.principles().find(principle => principle.id === id);
  }
  
  refresh() {
    this.loadPrinciples();
  }
}
