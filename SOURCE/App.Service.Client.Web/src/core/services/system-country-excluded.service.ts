import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemCountryExcludedRepository } from '../repositories/system-country-excluded.repository';
import { SystemCountryExcludedViewModel } from '../models/view-models/system-country-excluded.view-model';
import { mapSystemCountryExcludedDtosToViewModels } from '../mappers/system-country-excluded.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { SystemEmbargoService } from './system-embargo.service';

@Injectable({ providedIn: 'root' })
export class SystemCountryExcludedService {
  countries = signal<SystemCountryExcludedViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  countryCount = computed(() => this.countries().length);
  hasCountries = computed(() => this.countries().length > 0);
  countriesWithIpRanges = computed(() => 
    this.countries().filter(country => !!country.ipRange)
  );
  
  constructor(
    private repository: SystemCountryExcludedRepository,
    private embargoService: SystemEmbargoService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadCountries();
  }
  
  loadCountries() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const getEmbargoReference = (embargoId: string) => {
            const embargo = this.embargoService.getById(embargoId);
            return embargo?.title || 'Unknown Embargo';
          };
          
          const viewModels = mapSystemCountryExcludedDtosToViewModels(dtos, getEmbargoReference);
          this.countries.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} excluded countries`);
        },
        error: (err) => {
          this.error.set('Failed to load excluded countries');
          this.loading.set(false);
          this.logger.error(`Error loading excluded countries: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getByEmbargoId(embargoId: string): SystemCountryExcludedViewModel[] {
    return this.countries().filter(country => country.embargoId === embargoId);
  }
  
  getById(id: string): SystemCountryExcludedViewModel | undefined {
    return this.countries().find(country => country.id === id);
  }
  
  refresh() {
    this.loadCountries();
  }
}
