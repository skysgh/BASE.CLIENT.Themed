import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BrochurePricingPlanRepository } from '../repositories/brochure-pricing-plan.repository';
import { BrochurePricingPlanViewModel } from '../models/view-models/brochure-pricing-plan.view-model';
import { mapBrochurePricingPlanDtosToViewModels } from '../mappers/brochure-pricing-plan.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class BrochurePricingPlanService {
  plans = signal<BrochurePricingPlanViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledPlans = computed(() => this.plans().filter(p => p.enabled));
  
  constructor(
    private repository: BrochurePricingPlanRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadPlans();
  }
  
  loadPlans() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapBrochurePricingPlanDtosToViewModels(dtos);
          this.plans.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} pricing plans`);
        },
        error: () => {
          this.error.set('Failed to load pricing plans');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  refresh() {
    this.loadPlans();
  }
}
