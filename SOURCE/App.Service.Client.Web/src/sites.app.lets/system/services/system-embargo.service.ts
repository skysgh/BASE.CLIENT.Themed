import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemEmbargoRepository } from '../repositories/system-embargo.repository';
import { SystemEmbargoViewModel } from '../models/view-models/system-embargo.view-model';
import { mapSystemEmbargoDtosToViewModels } from '../mappers/system-embargo.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class SystemEmbargoService {
  embargos = signal<SystemEmbargoViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledEmbargos = computed(() => this.embargos().filter(e => e.enabled));
  embargoedCountryCodes = computed(() => this.enabledEmbargos().map(e => e.countryCode));
  
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
        error: () => {
          this.error.set('Failed to load embargos');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  isCountryEmbargoed(countryCode: string): boolean {
    return this.embargoedCountryCodes().includes(countryCode);
  }
  
  refresh() {
    this.loadEmbargos();
  }
}
