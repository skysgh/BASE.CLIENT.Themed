import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceDescribeStatsRepository } from '../repositories/service-describe-stats.repository';
import { ServiceDescribeStatsViewModel } from '../models/view-models/service-describe-stats.view-model';
import { mapServiceDescribeStatsDtosToViewModels } from '../mappers/service-describe-stats.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceDescribeStatsService {
  stats = signal<ServiceDescribeStatsViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledStats = computed(() => this.stats().filter(s => s.enabled));
  
  constructor(
    private repository: ServiceDescribeStatsRepository,
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
          const viewModels = mapServiceDescribeStatsDtosToViewModels(dtos);
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
