import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemCountryExcludedRepository } from '../repositories/system-country-excluded.repository';
import { SystemCountryExcludedViewModel } from '../models/view-models/system-country-excluded.view-model';
import { mapSystemCountryExcludedDtosToViewModels } from '../mappers/system-country-excluded.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class SystemCountryExcludedService {
  excludedCountries = signal<SystemCountryExcludedViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  excludedCountryCodes = computed(() => this.excludedCountries().map(c => c.countryCode));
  
  constructor(
    private repository: SystemCountryExcludedRepository,
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
          const viewModels = mapSystemCountryExcludedDtosToViewModels(dtos);
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
