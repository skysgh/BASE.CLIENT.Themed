import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BrochureEndorsementRepository } from '../repositories/brochure-endorsement.repository';
import { BrochureEndorsementViewModel } from '../models/view-models/brochure-endorsement.view-model';
import { mapBrochureEndorsementDtosToViewModels } from '../mappers/brochure-endorsement.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class BrochureEndorsementService {
  endorsements = signal<BrochureEndorsementViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledEndorsements = computed(() => this.endorsements().filter(e => e.enabled));
  
  constructor(
    private repository: BrochureEndorsementRepository,
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
          const viewModels = mapBrochureEndorsementDtosToViewModels(dtos);
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
