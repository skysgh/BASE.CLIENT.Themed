/**
 * Language Service
 * 
 * Business logic for language management.
 */
import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LanguageRepository } from '../repositories/language.repository';
import { LanguageViewModel } from '../models/language.view-model';
import { mapLanguageDtosToViewModels } from '../mappers/language.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  // State
  languages = signal<LanguageViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Computed
  enabledLanguages = computed(() => this.languages().filter(l => l.enabled));
  enabledCount = computed(() => this.enabledLanguages().length);
  
  constructor(
    private repository: LanguageRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    // Auto-load languages on service initialization
    this.loadLanguages();
  }
  
  /** Load all languages */
  loadLanguages(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapLanguageDtosToViewModels(dtos);
          this.languages.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} languages`);
        },
        error: (err) => {
          this.error.set('Failed to load languages');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  /** Toggle language enabled status */
  toggleEnabled(id: string): void {
    const lang = this.languages().find(l => l.id === id);
    if (!lang) return;
    
    this.repository.toggleEnabled(id, !lang.enabled).pipe(
      tap({
        next: () => {
          this.languages.update(all =>
            all.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l)
          );
        }
      })
    ).subscribe();
  }
}
