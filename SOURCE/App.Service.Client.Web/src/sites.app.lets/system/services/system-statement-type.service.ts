import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemStatementTypeRepository } from '../repositories/system-statement-type.repository';
import { SystemStatementTypeViewModel } from '../models/view-models/system-statement-type.view-model';
import { mapSystemStatementTypeDtosToViewModels } from '../mappers/system-statement-type.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class SystemStatementTypeService {
  statementTypes = signal<SystemStatementTypeViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
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
        error: () => {
          this.error.set('Failed to load statement types');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  getByCode(code: string): SystemStatementTypeViewModel | undefined {
    return this.statementTypes().find(st => st.code === code);
  }
  
  refresh() {
    this.loadStatementTypes();
  }
}
