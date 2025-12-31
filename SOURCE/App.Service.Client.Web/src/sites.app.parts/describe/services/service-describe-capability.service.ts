import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceDescribeCapabilityRepository } from '../repositories/service-describe-capability.repository';
import { ServiceDescribeCapabilityViewModel } from '../models/view-models/service-describe-capability.view-model';
import { mapServiceDescribeCapabilityDtosToViewModels } from '../mappers/service-describe-capability.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceDescribeCapabilityService {
  capabilities = signal<ServiceDescribeCapabilityViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledCapabilities = computed(() => this.capabilities().filter(c => c.enabled));
  
  constructor(
    private repository: ServiceDescribeCapabilityRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadCapabilities();
  }
  
  loadCapabilities() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceDescribeCapabilityDtosToViewModels(dtos);
          this.capabilities.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} capabilities`);
        },
        error: () => {
          this.error.set('Failed to load capabilities');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
}
