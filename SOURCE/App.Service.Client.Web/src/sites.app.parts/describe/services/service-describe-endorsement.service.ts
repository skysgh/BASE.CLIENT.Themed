import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceDescribeEndorsementRepository } from '../repositories/service-describe-endorsement.repository';
import { ServiceDescribeEndorsementViewModel } from '../models/view-models/service-describe-endorsement.view-model';
import { mapServiceDescribeEndorsementDtosToViewModels } from '../mappers/service-describe-endorsement.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceDescribeEndorsementService {
  endorsements = signal<ServiceDescribeEndorsementViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledEndorsements = computed(() => this.endorsements().filter(e => e.enabled));
  
  constructor(
    private repository: ServiceDescribeEndorsementRepository,
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
          const viewModels = mapServiceDescribeEndorsementDtosToViewModels(dtos);
          this.endorsements.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} endorsements`);
        },
        error: () => {
          this.error.set('Failed to load endorsements');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  refresh() {
    this.loadEndorsements();
  }
}
