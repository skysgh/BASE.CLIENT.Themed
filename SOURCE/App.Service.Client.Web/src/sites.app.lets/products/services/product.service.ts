import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ProductRepository } from '../repositories/product.repository';
import { ProductViewModel } from '../models/view-models/product.view-model';
import { mapProductDtosToViewModels } from '../mappers/product.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  products = signal<ProductViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  productCount = computed(() => this.products().length);
  hasProducts = computed(() => this.products().length > 0);
  totalValue = computed(() => 
    this.products().reduce((sum, p) => sum + p.priceAmount, 0)
  );
  
  constructor(
    private repository: ProductRepository,
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
          const viewModels = mapProductDtosToViewModels(dtos);
          this.products.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} products`);
        },
        error: () => {
          this.error.set('Failed to load products');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ProductViewModel | undefined {
    return this.products().find(p => p.id === id);
  }
  
  refresh() {
    this.loadProducts();
  }
}
