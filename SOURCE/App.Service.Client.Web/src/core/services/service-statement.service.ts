import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceStatementRepository } from '../repositories/service-statement.repository';
import { ServiceStatementViewModel } from '../models/view-models/service-statement.view-model';
import { mapServiceStatementDtosToViewModels } from '../mappers/service-statement.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { SystemStatementTypeService } from './system-statement-type.service';

@Injectable({ providedIn: 'root' })
export class ServiceStatementService {
  statements = signal<ServiceStatementViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  statementCount = computed(() => this.statements().length);
  hasStatements = computed(() => this.statements().length > 0);
  privacyStatements = computed(() => 
    this.statements().filter(s => s.typeName?.toLowerCase().includes('privacy'))
  );
  
  constructor(
    private repository: ServiceStatementRepository,
    private statementTypeService: SystemStatementTypeService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadStatements();
  }
  
  loadStatements() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const getTypeName = (typeId: string) => {
            const type = this.statementTypeService.getById(typeId);
            return type?.title || 'Unknown Type';
          };
          
          const viewModels = mapServiceStatementDtosToViewModels(dtos, getTypeName);
          this.statements.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} statements`);
        },
        error: (err) => {
          this.error.set('Failed to load statements');
          this.loading.set(false);
          this.logger.error(`Error loading statements: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getByTypeId(typeId: string): ServiceStatementViewModel[] {
    return this.statements().filter(stmt => stmt.typeId === typeId);
  }
  
  getById(id: string): ServiceStatementViewModel | undefined {
    return this.statements().find(stmt => stmt.id === id);
  }
  
  refresh() {
    this.loadStatements();
  }
}
