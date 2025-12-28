import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceProductRepository } from '../repositories/service-product.repository';
import { ServiceProductViewModel } from '../models/view-models/service-product.view-model';
import { mapServiceProductDtosToViewModels } from '../mappers/service-product.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceProductService {
  products = signal<ServiceProductViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  productCount = computed(() => this.products().length);
  hasProducts = computed(() => this.products().length > 0);
  totalValue = computed(() => 
    this.products().reduce((sum, p) => sum + p.priceAmount, 0)
  );
  
  constructor(
    private repository: ServiceProductRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadProducts();
  }
  
  loadProducts() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceProductDtosToViewModels(dtos);
          this.products.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} products`);
        },
        error: (err) => {
          this.error.set('Failed to load products');
          this.loading.set(false);
          this.logger.error(`Error loading products: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ServiceProductViewModel | undefined {
    return this.products().find(product => product.id === id);
  }
  
  refresh() {
    this.loadProducts();
  }
}
