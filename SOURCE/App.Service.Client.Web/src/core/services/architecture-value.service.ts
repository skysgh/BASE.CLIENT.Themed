import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ArchitectureValueRepository } from '../repositories/architecture-value.repository';
import { ArchitectureValueViewModel } from '../models/view-models/architecture-value.view-model';
import { mapArchitectureValueDtosToViewModels } from '../mappers/architecture-value.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ArchitectureValueService {
  values = signal<ArchitectureValueViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  valueCount = computed(() => this.values().length);
  hasValues = computed(() => this.values().length > 0);
  
  constructor(
    private repository: ArchitectureValueRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadValues();
  }
  
  loadValues() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapArchitectureValueDtosToViewModels(dtos);
          this.values.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} architecture values`);
        },
        error: (err) => {
          this.error.set('Failed to load architecture values');
          this.loading.set(false);
          this.logger.error(`Error loading architecture values: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ArchitectureValueViewModel | undefined {
    return this.values().find(value => value.id === id);
  }
  
  refresh() {
    this.loadValues();
  }
}
