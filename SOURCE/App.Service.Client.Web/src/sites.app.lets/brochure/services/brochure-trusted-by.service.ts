import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BrochureTrustedByRepository } from '../repositories/brochure-trusted-by.repository';
import { BrochureTrustedByViewModel } from '../models/view-models/brochure-trusted-by.view-model';
import { mapBrochureTrustedByDtosToViewModels } from '../mappers/brochure-trusted-by.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class BrochureTrustedByService {
  clients = signal<BrochureTrustedByViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledClients = computed(() => this.clients().filter(c => c.enabled));
  
  constructor(
    private repository: BrochureTrustedByRepository,
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
          const viewModels = mapBrochureTrustedByDtosToViewModels(dtos);
          this.clients.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} clients`);
        },
        error: () => {
          this.error.set('Failed to load clients');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  refresh() {
    this.loadClients();
  }
}
