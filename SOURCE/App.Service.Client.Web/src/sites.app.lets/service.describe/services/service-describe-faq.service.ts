import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceDescribeFaqRepository } from '../repositories/service-describe-faq.repository';
import { ServiceDescribeFaqViewModel } from '../models/view-models/service-describe-faq.view-model';
import { mapServiceDescribeFaqDtosToViewModels } from '../mappers/service-describe-faq.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceDescribeFaqService {
  faqs = signal<ServiceDescribeFaqViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledFaqs = computed(() => this.faqs().filter(f => f.enabled));
  
  constructor(
    private repository: ServiceDescribeFaqRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadFaqs();
  }
  
  loadFaqs() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceDescribeFaqDtosToViewModels(dtos);
          this.faqs.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} FAQs`);
        },
        error: () => {
          this.error.set('Failed to load FAQs');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  getFaqsByCategory(categoryId: string): ServiceDescribeFaqViewModel[] {
    return this.faqs().filter(f => f.categoryId === categoryId);
  }
  
  refresh() {
    this.loadFaqs();
  }
}
