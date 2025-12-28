import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemStatementTypeRepository } from '../repositories/system-statement-type.repository';
import { SystemStatementTypeViewModel } from '../models/view-models/system-statement-type.view-model';
import { mapSystemStatementTypeDtosToViewModels } from '../mappers/system-statement-type.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class SystemStatementTypeService {
  statementTypes = signal<SystemStatementTypeViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  typeCount = computed(() => this.statementTypes().length);
  hasTypes = computed(() => this.statementTypes().length > 0);
  
  constructor(
    private repository: SystemStatementTypeRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadStatementTypes();
  }
  
  loadStatementTypes() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapSystemStatementTypeDtosToViewModels(dtos);
          this.statementTypes.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} statement types`);
        },
        error: (err) => {
          this.error.set('Failed to load statement types');
          this.loading.set(false);
          this.logger.error(`Error loading statement types: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): SystemStatementTypeViewModel | undefined {
    return this.statementTypes().find(type => type.id === id);
  }
  
  refresh() {
    this.loadStatementTypes();
  }
}
