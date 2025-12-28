import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BrochureCapabilityRepository } from '../repositories/brochure-capability.repository';
import { BrochureCapabilityViewModel } from '../models/view-models/brochure-capability.view-model';
import { mapBrochureCapabilityDtosToViewModels } from '../mappers/brochure-capability.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class BrochureCapabilityService {
  capabilities = signal<BrochureCapabilityViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledCapabilities = computed(() => this.capabilities().filter(c => c.enabled));
  
  constructor(
    private repository: BrochureCapabilityRepository,
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
          const viewModels = mapBrochureCapabilityDtosToViewModels(dtos);
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
