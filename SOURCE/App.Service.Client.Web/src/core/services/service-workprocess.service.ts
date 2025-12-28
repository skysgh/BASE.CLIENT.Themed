import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceWorkprocessRepository } from '../repositories/service-workprocess.repository';
import { ServiceWorkprocessViewModel } from '../models/view-models/service-workprocess.view-model';
import { mapServiceWorkprocessDtosToViewModels } from '../mappers/service-workprocess.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceWorkprocessService {
  workprocessSteps = signal<ServiceWorkprocessViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  stepCount = computed(() => this.workprocessSteps().length);
  hasSteps = computed(() => this.workprocessSteps().length > 0);
  enabledSteps = computed(() => 
    this.workprocessSteps().filter(step => step.enabled)
  );
  
  constructor(
    private repository: ServiceWorkprocessRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadWorkprocessSteps();
  }
  
  loadWorkprocessSteps() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceWorkprocessDtosToViewModels(dtos);
          this.workprocessSteps.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} workprocess steps`);
        },
        error: (err) => {
          this.error.set('Failed to load workprocess steps');
          this.loading.set(false);
          this.logger.error(`Error loading workprocess steps: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getByServiceId(serviceId: string): ServiceWorkprocessViewModel[] {
    return this.workprocessSteps().filter(step => step.serviceId === serviceId);
  }
  
  getById(id: string): ServiceWorkprocessViewModel | undefined {
    return this.workprocessSteps().find(step => step.id === id);
  }
  
  refresh() {
    this.loadWorkprocessSteps();
  }
}
