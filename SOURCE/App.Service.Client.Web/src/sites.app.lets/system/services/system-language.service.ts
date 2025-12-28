import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemLanguageRepository } from '../repositories/system-language.repository';
import { SystemLanguageViewModel } from '../models/view-models/system-language.view-model';
import { mapSystemLanguageDtosToViewModels } from '../mappers/system-language.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class SystemLanguageService {
  languages = signal<SystemLanguageViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledLanguages = computed(() => this.languages().filter(l => l.enabled));
  
  constructor(
    private repository: SystemLanguageRepository,
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
          const viewModels = mapSystemLanguageDtosToViewModels(dtos);
          this.languages.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} languages`);
        },
        error: () => {
          this.error.set('Failed to load languages');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  getByCode(code: string): SystemLanguageViewModel | undefined {
    return this.languages().find(l => l.code === code);
  }
  
  refresh() {
    this.loadLanguages();
  }
}
