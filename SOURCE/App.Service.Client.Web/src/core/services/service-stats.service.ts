import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceStatsRepository } from '../repositories/service-stats.repository';
import { ServiceStatsViewModel } from '../models/view-models/service-stats.view-model';
import { mapServiceStatsDtosToViewModels } from '../mappers/service-stats.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceStatsService {
  stats = signal<ServiceStatsViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledStats = computed(() => 
    this.stats().filter(s => s.enabled)
  );
  
  constructor(
    private repository: ServiceStatsRepository,
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
          const viewModels = mapServiceStatsDtosToViewModels(dtos);
          this.stats.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} stats`);
        },
        error: () => {
          this.error.set('Failed to load stats');
          this.loading.set(false);
          this.logger.error('Error loading stats');
        }
      })
    ).subscribe();
  }
}
