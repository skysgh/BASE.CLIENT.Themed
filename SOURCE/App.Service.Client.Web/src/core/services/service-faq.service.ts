import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';

import { ServiceFaqRepository } from '../repositories/service-faq.repository';
import { ServiceFaqViewModel } from '../models/view-models/service-faq.view-model';
import { mapServiceFaqDtosToViewModels } from '../mappers/service-faq.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

/**
 * ServiceFaq Service
 * 
 * Modern signal-based service for FAQ management.
 * No inheritance, no subscriptions needed in components!
 * 
 * Usage in Component:
 * ```typescript
 * constructor(public faqService: ServiceFaqService) {}
 * 
 * // In template:
 * <div *ngFor="let faq of faqService.enabledFaqs()">
 *   {{ faq.question }}
 * </div>
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ServiceFaqService {
  
  // ✅ SIGNALS - No subscriptions needed!
  faqs = signal<ServiceFaqViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // ✅ COMPUTED - Auto-updates when faqs changes!
  enabledFaqs = computed(() => 
    this.faqs().filter(f => f.enabled)
  );
  
  constructor(
    private repository: ServiceFaqRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadFaqs();
  }
  
  /**
   * Load all FAQs
   */
  loadFaqs() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceFaqDtosToViewModels(dtos);
          this.faqs.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} FAQs`);
        },
        error: (err) => {
          this.error.set('Failed to load FAQs');
          this.loading.set(false);
          this.logger.error('Error loading FAQs');
        }
      })
    ).subscribe();
  }
  
  /**
   * Get FAQs by category
   */
  getFaqsByCategory(categoryId: string): ServiceFaqViewModel[] {
    return this.faqs().filter(f => f.categoryId === categoryId);
  }
  
  /**
   * Refresh FAQs
   */
  refresh() {
    this.loadFaqs();
  }
}
