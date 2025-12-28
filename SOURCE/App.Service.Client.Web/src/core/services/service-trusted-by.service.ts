import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';

import { ServiceTrustedByRepository } from '../repositories/service-trusted-by.repository';
import { ServiceTrustedByViewModel } from '../models/view-models/service-trusted-by.view-model';
import { mapServiceTrustedByDtosToViewModels } from '../mappers/service-trusted-by.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceTrustedByService {
  
  clients = signal<ServiceTrustedByViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledClients = computed(() => 
    this.clients().filter(c => c.enabled)
  );
  
  constructor(
    private repository: ServiceTrustedByRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadClients();
  }
  
  loadClients() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceTrustedByDtosToViewModels(dtos);
          this.clients.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} clients`);
        },
        error: () => {
          this.error.set('Failed to load clients');
          this.loading.set(false);
          this.logger.error('Error loading clients');
        }
      })
    ).subscribe();
  }
  
  refresh() {
    this.loadClients();
  }
}
