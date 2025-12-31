import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceOperateLanguageRepository } from '../repositories/service-operate-language.repository';
import { ServiceOperateLanguageViewModel } from '../models/view-models/service-operate-language.view-model';
import { mapServiceOperateLanguageDtosToViewModels } from '../mappers/service-operate-language.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceOperateLanguageService {
  languages = signal<ServiceOperateLanguageViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledLanguages = computed(() => this.languages().filter(l => l.enabled));
  
  constructor(
    private repository: ServiceOperateLanguageRepository,
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
          const viewModels = mapServiceOperateLanguageDtosToViewModels(dtos);
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
  
  getByCode(code: string): ServiceOperateLanguageViewModel | undefined {
    return this.languages().find(l => l.code === code);
  }
  
  refresh() {
    this.loadLanguages();
  }
}
