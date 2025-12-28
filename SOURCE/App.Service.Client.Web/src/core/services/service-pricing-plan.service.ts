import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServicePricingPlanRepository } from '../repositories/service-pricing-plan.repository';
import { ServicePricingPlanViewModel } from '../models/view-models/service-pricing-plan.view-model';
import { mapServicePricingPlanDtosToViewModels } from '../mappers/service-pricing-plan.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServicePricingPlanService {
  plans = signal<ServicePricingPlanViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledPlans = computed(() => 
    this.plans().filter(p => p.enabled)
  );
  
  constructor(
    private repository: ServicePricingPlanRepository,
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
          const viewModels = mapServicePricingPlanDtosToViewModels(dtos);
          this.plans.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} pricing plans`);
        },
        error: () => {
          this.error.set('Failed to load pricing plans');
          this.loading.set(false);
          this.logger.error('Error loading pricing plans');
        }
      })
    ).subscribe();
  }
}
