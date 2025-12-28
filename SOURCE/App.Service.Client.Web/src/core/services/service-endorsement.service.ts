import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';

import { ServiceEndorsementRepository } from '../repositories/service-endorsement.repository';
import { ServiceEndorsementViewModel } from '../models/view-models/service-endorsement.view-model';
import { mapServiceEndorsementDtosToViewModels } from '../mappers/service-endorsement.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceEndorsementService {
  
  endorsements = signal<ServiceEndorsementViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledEndorsements = computed(() => 
    this.endorsements().filter(e => e.enabled)
  );
  
  constructor(
    private repository: ServiceEndorsementRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadEndorsements();
  }
  
  loadEndorsements() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceEndorsementDtosToViewModels(dtos);
          this.endorsements.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} endorsements`);
        },
        error: () => {
          this.error.set('Failed to load endorsements');
          this.loading.set(false);
          this.logger.error('Error loading endorsements');
        }
      })
    ).subscribe();
  }
  
  refresh() {
    this.loadEndorsements();
  }
}
