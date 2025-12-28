import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BrochureFaqRepository } from '../repositories/brochure-faq.repository';
import { BrochureFaqViewModel } from '../models/view-models/brochure-faq.view-model';
import { mapBrochureFaqDtosToViewModels } from '../mappers/brochure-faq.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class BrochureFaqService {
  faqs = signal<BrochureFaqViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledFaqs = computed(() => this.faqs().filter(f => f.enabled));
  
  constructor(
    private repository: BrochureFaqRepository,
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
          const viewModels = mapBrochureFaqDtosToViewModels(dtos);
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
  
  getFaqsByCategory(categoryId: string): BrochureFaqViewModel[] {
    return this.faqs().filter(f => f.categoryId === categoryId);
  }
  
  refresh() {
    this.loadFaqs();
  }
}
