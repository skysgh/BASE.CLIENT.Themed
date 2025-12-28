import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ProductTypeRepository } from '../repositories/product-type.repository';
import { ProductTypeViewModel } from '../models/view-models/product-type.view-model';
import { mapProductTypeDtosToViewModels } from '../mappers/product-type.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ProductTypeService {
  productTypes = signal<ProductTypeViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  productTypeCount = computed(() => this.productTypes().length);
  hasProductTypes = computed(() => this.productTypes().length > 0);
  
  constructor(
    private repository: ProductTypeRepository,
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
          const viewModels = mapProductTypeDtosToViewModels(dtos);
          this.productTypes.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} product types`);
        },
        error: () => {
          this.error.set('Failed to load product types');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ProductTypeViewModel | undefined {
    return this.productTypes().find(pt => pt.id === id);
  }
  
  refresh() {
    this.loadProductTypes();
  }
}
