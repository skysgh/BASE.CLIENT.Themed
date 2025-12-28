import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceProductTypeRepository } from '../repositories/service-product-type.repository';
import { ServiceProductTypeViewModel } from '../models/view-models/service-product-type.view-model';
import { mapServiceProductTypeDtosToViewModels } from '../mappers/service-product-type.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceProductTypeService {
  productTypes = signal<ServiceProductTypeViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  typeCount = computed(() => this.productTypes().length);
  hasTypes = computed(() => this.productTypes().length > 0);
  
  constructor(
    private repository: ServiceProductTypeRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadProductTypes();
  }
  
  loadProductTypes() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceProductTypeDtosToViewModels(dtos);
          this.productTypes.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} product types`);
        },
        error: (err) => {
          this.error.set('Failed to load product types');
          this.loading.set(false);
          this.logger.error(`Error loading product types: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ServiceProductTypeViewModel | undefined {
    return this.productTypes().find(type => type.id === id);
  }
  
  refresh() {
    this.loadProductTypes();
  }
}
