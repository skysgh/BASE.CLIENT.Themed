import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceDescribePricingPlanRepository } from '../repositories/service-describe-pricing-plan.repository';
import { ServiceDescribePricingPlanViewModel } from '../models/view-models/service-describe-pricing-plan.view-model';
import { mapServiceDescribePricingPlanDtosToViewModels } from '../mappers/service-describe-pricing-plan.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceDescribePricingPlanService {
  plans = signal<ServiceDescribePricingPlanViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledPlans = computed(() => this.plans().filter(p => p.enabled));
  
  constructor(
    private repository: ServiceDescribePricingPlanRepository,
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
          const viewModels = mapServiceDescribePricingPlanDtosToViewModels(dtos);
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
