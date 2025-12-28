import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BrochureStatsRepository } from '../repositories/brochure-stats.repository';
import { BrochureStatsViewModel } from '../models/view-models/brochure-stats.view-model';
import { mapBrochureStatsDtosToViewModels } from '../mappers/brochure-stats.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class BrochureStatsService {
  stats = signal<BrochureStatsViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledStats = computed(() => this.stats().filter(s => s.enabled));
  
  constructor(
    private repository: BrochureStatsRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadStats();
  }
  
  loadStats() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapBrochureStatsDtosToViewModels(dtos);
          this.stats.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} stats`);
        },
        error: () => {
          this.error.set('Failed to load stats');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  refresh() {
    this.loadStats();
  }
}
