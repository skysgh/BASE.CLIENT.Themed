import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RepositoryService } from './base/repository.service';
import { ServiceFaqDto } from '../models/dtos/service-faq.dto';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../services/system.error.service';

/**
 * ServiceFaq Repository
 * 
 * Handles HTTP operations for FAQ data using modern repository pattern.
 * No inheritance chains - just composition.
 * 
 * Usage:
 * ```typescript
 * constructor(private faqRepo: ServiceFaqRepository) {}
 * 
 * this.faqRepo.getAll().subscribe(faqs => ...);
 * this.faqRepo.getByCategory('general').subscribe(faqs => ...);
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ServiceFaqRepository extends RepositoryService<ServiceFaqDto> {
  
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Faqs', logger, errorService);
  }

  /**
   * Get only enabled FAQs
   */
  getEnabled(): Observable<ServiceFaqDto[]> {
    this.logger.debug(`${this.constructor.name}.getEnabled()`);
    return this.query({ enabled: true });
  }

  /**
   * Get FAQs by category
   */
  getByCategory(categoryId: string): Observable<ServiceFaqDto[]> {
    this.logger.debug(`${this.constructor.name}.getByCategory(${categoryId})`);
    return this.query({ categoryId });
  }

  /**
   * Get enabled FAQs by category
   */
  getEnabledByCategory(categoryId: string): Observable<ServiceFaqDto[]> {
    this.logger.debug(`${this.constructor.name}.getEnabledByCategory(${categoryId})`);
    return this.query({ categoryId, enabled: true });
  }
}
