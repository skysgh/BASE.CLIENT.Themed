import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemEmbargoRepository } from '../repositories/system-embargo.repository';
import { SystemEmbargoViewModel } from '../models/view-models/system-embargo.view-model';
import { mapSystemEmbargoDtosToViewModels } from '../mappers/system-embargo.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class SystemEmbargoService {
  embargos = signal<SystemEmbargoViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  embargoCount = computed(() => this.embargos().length);
  hasEmbargos = computed(() => this.embargos().length > 0);
  enabledEmbargos = computed(() => 
    this.embargos().filter(embargo => embargo.enabled)
  );
  
  constructor(
    private repository: SystemEmbargoRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadEmbargos();
  }
  
  loadEmbargos() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapSystemEmbargoDtosToViewModels(dtos);
          this.embargos.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} embargos`);
        },
        error: (err) => {
          this.error.set('Failed to load embargos');
          this.loading.set(false);
          this.logger.error(`Error loading embargos: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): SystemEmbargoViewModel | undefined {
    return this.embargos().find(embargo => embargo.id === id);
  }
  
  refresh() {
    this.loadEmbargos();
  }
}
