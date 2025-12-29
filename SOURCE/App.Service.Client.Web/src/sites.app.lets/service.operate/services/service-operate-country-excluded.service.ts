import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceOperateCountryExcludedRepository } from '../repositories/service-operate-country-excluded.repository';
import { ServiceOperateCountryExcludedViewModel } from '../models/view-models/service-operate-country-excluded.view-model';
import { mapServiceOperateCountryExcludedDtosToViewModels } from '../mappers/service-operate-country-excluded.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceOperateCountryExcludedService {
  excludedCountries = signal<ServiceOperateCountryExcludedViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  excludedCountryCodes = computed(() => this.excludedCountries().map(c => c.countryCode));
  
  constructor(
    private repository: ServiceOperateCountryExcludedRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadExcludedCountries();
  }
  
  loadExcludedCountries() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceOperateCountryExcludedDtosToViewModels(dtos);
          this.excludedCountries.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} excluded countries`);
        },
        error: () => {
          this.error.set('Failed to load excluded countries');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  isCountryExcluded(countryCode: string): boolean {
    return this.excludedCountryCodes().includes(countryCode);
  }
  
  refresh() {
    this.loadExcludedCountries();
  }
}
