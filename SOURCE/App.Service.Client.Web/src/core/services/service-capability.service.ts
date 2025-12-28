import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceCapabilityRepository } from '../repositories/service-capability.repository';
import { ServiceCapabilityViewModel } from '../models/view-models/service-capability.view-model';
import { mapServiceCapabilityDtosToViewModels } from '../mappers/service-capability.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceCapabilityService {
  capabilities = signal<ServiceCapabilityViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledCapabilities = computed(() => 
    this.capabilities().filter(c => c.enabled)
  );
  
  constructor(
    private repository: ServiceCapabilityRepository,
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
          const viewModels = mapServiceCapabilityDtosToViewModels(dtos);
          this.capabilities.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} capabilities`);
        },
        error: () => {
          this.error.set('Failed to load capabilities');
          this.loading.set(false);
          this.logger.error('Error loading capabilities');
        }
      })
    ).subscribe();
  }
}
