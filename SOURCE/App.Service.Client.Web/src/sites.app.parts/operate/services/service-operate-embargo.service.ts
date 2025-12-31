import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceOperateEmbargoRepository } from '../repositories/service-operate-embargo.repository';
import { ServiceOperateEmbargoViewModel } from '../models/view-models/service-operate-embargo.view-model';
import { mapServiceOperateEmbargoDtosToViewModels } from '../mappers/service-operate-embargo.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceOperateEmbargoService {
  embargos = signal<ServiceOperateEmbargoViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledEmbargos = computed(() => this.embargos().filter(e => e.enabled));
  embargoedCountryCodes = computed(() => this.enabledEmbargos().map(e => e.countryCode));
  
  constructor(
    private repository: ServiceOperateEmbargoRepository,
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
          const viewModels = mapServiceOperateEmbargoDtosToViewModels(dtos);
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
