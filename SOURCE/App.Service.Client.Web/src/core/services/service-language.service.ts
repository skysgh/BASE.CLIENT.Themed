import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceLanguageRepository } from '../repositories/service-language.repository';
import { ServiceLanguageViewModel } from '../models/view-models/service-language.view-model';
import { mapServiceLanguageDtosToViewModels } from '../mappers/service-language.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceLanguageService {
  languages = signal<ServiceLanguageViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledLanguages = computed(() => 
    this.languages().filter(l => l.enabled)
  );
  
  constructor(
    private repository: ServiceLanguageRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadLanguages();
  }
  
  loadLanguages() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceLanguageDtosToViewModels(dtos);
          this.languages.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} languages`);
        },
        error: () => {
          this.error.set('Failed to load languages');
          this.loading.set(false);
          this.logger.error('Error loading languages');
        }
      })
    ).subscribe();
  }
}
